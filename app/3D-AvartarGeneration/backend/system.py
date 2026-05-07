import requests
import time
import torch
import os
from PIL import Image
import logging
import cloudinary
import cloudinary.uploader
# Set up logging configuration
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
from dotenv import load_dotenv

# Load environment variables
load_dotenv()  
# Cloudinary Configuration
cloudinary.config(
    cloud_url=os.getenv("CLOUD_URL"),
    cloud_name=os.getenv("CLOUD_NAME"), 
    api_key=os.getenv("CLOUD_API_KEY"),     
    api_secret=os.getenv("CLOUD_API_SECRET")
)

def save_tensor(image_tensor, filename):
    try:
        logger.debug(f"Saving tensor to {filename}")
        if image_tensor.dim() > 3:
            image_tensor = image_tensor[0]
        if image_tensor.dtype == torch.float32:
            image_tensor = (image_tensor * 255).byte()
        if image_tensor.dim() == 2:
            image_tensor = image_tensor.unsqueeze(0) 
        if image_tensor.dim() == 3 and image_tensor.size(0) == 3:
            image_tensor = image_tensor.permute(1, 2, 0)
        if image_tensor.is_cuda:
            image_tensor = image_tensor.cpu()
        image_np = image_tensor.numpy()
        image_pil = Image.fromarray(image_np)
        if image_np.shape[2] == 4:
            name = filename + '.png'
            image_pil.save(name, 'PNG')
        else:
            name = filename + '.jpg'
            image_pil.save(name, 'JPEG')
        logger.debug(f"Image saved to {name}")
        return name
    except Exception as e:
        logger.error(f"Error saving tensor: {e}")
        raise

tripo_base_url = "api.tripo3d.ai/v2/openapi"

class TripoAPI:
    def __init__(self, api_key, timeout=24000):
        self.api_key = api_key
        self.api_url = f"https://{tripo_base_url}"
        self.polling_interval = 2 
        self.timeout = timeout
        logger.info(f"TripoAPI initialized with key: {api_key}")

    def upload(self, image_name):
        try:
            logger.debug(f"Uploading image: {image_name}")
            with open(image_name, 'rb') as f:
                files = {
                    'file': (image_name, f, 'image/jpeg')
                }
                headers = {
                    "Authorization": f"Bearer {self.api_key}"
                }
                response = requests.post(f"{self.api_url}/upload", headers=headers, files=files)
            
            if response.status_code == 200:
                logger.info(f"Image uploaded successfully: {image_name}")
                return response.json()['data']['image_token']
            else:
                error_message = response.json().get('message', 'An unexpected error occurred')
                logger.error(f"Failed to upload image: {error_message}")
                return {'status': 'error', 'message': error_message, 'task_id': None}
        except Exception as e:
            logger.error(f"Error uploading image: {e}")
            return {'status': 'error', 'message': str(e), 'task_id': None}

    def animate_rig(self, original_model_task_id, out_format="glb"):
        start_time = time.time()
        response = self._submit_task(
            "animate_rig",
            {"original_model_task_id": original_model_task_id, "out_format": out_format},
            start_time
        )
        return self._handle_task_response(response, start_time)

    def convert(self, original_model_task_id, format, quad, face_limit, texture_size, texture_format):
        start_time = time.time()
        response = self._submit_task(
            "convert_model",
            {
                "original_model_task_id": original_model_task_id,
                "format": format,
                "quad": quad,
                "face_limit": face_limit,
                "texture_size": texture_size,
                "texture_format": texture_format,
            },
            start_time
        )
        return self._handle_task_response(response, start_time)
    
    def texture(self, original_model_task_id):
        start_time = time.time()
        param = {
            "original_model_task_id": original_model_task_id,
            "texture": True,
            "pbr": True,
            "texture_seed": 42,
            "texture_quality": "standard",
            "texture_alignment": "original_image"
        }
        response = self._submit_task(
            "texture_model",
            param,
            start_time)
        return self._handle_task_response(response, start_time)
    def text_to_3d(self, prompt, model_version, style, texture, pbr, image_seed, model_seed, texture_seed, texture_quality, face_limit, quad):
        try:
            logger.debug(f"Creating 3D model from text prompt: {prompt}")
            start_time = time.time()

            # Prepare parameters for the model creation
            param = {
                "prompt": prompt,
                "model_version": model_version,
                "style": style,
                "texture": texture,
                "pbr": pbr,
                "image_seed": image_seed,
                "model_seed": model_seed,
                "texture_seed": texture_seed,
                "texture_quality": texture_quality,
                "face_limit": face_limit,
                "quad": quad
            }

            # Remove None or invalid parameters
            param = {key: value for key, value in param.items() if value not in [None, 'None']}

            # Step 1: Create the 3D model from the text prompt
            response = self._submit_task("text_to_model", param, start_time)
            model_data = self._handle_task_response(response, start_time)

            # If model creation failed, return early
            if model_data['status'] != 'success':
                logger.error("Model creation failed, aborting.")
                return model_data

            # Unique task ID for model creation
            model_creation_task_id = model_data['task_id']
            logger.info(f"Model created successfully with task ID: {model_creation_task_id}")

            # Step 2: Animate the rig
            logger.debug(f"Animating rig for model with task ID: {model_creation_task_id}")
            animate_response = self.animate_rig(model_creation_task_id)
            
            if animate_response['status'] != 'success':
                logger.error(f"Rig animation failed: {animate_response['message']}")
                return animate_response

            texture_response = self.texture(model_creation_task_id)
            
            if texture_response['status'] != 'success':
                logger.error(f"Texture failed: {texture_response['message']}")
                return texture_response
            return texture_response

        except Exception as e:
            logger.error(f"Error creating, animating, or converting 3D model: {e}")
            return {'status': 'error', 'message': str(e), 'task_id': None}


    def image_to_3d(self, image_name, model_version, style, texture, pbr, model_seed, texture_seed, texture_quality, texture_alignment, face_limit, quad):
        try:
            logger.debug(f"Creating 3D model from image: {image_name}")
            start_time = time.time()
            image_token = self.upload(image_name)
            if isinstance(image_token, dict):
                return image_token
            param = {
                "file": {
                    "type": "jpg", 
                    "file_token": image_token
                },
                "model_version": model_version,
                "style": style,
                "texture": texture,
                "pbr": pbr,
                "model_seed": model_seed,
                "texture_seed": texture_seed,
                "texture_quality": texture_quality,
                "texture_alignment": texture_alignment,
                "face_limit": face_limit,
                "quad": quad
            }
            # Remove None or invalid parameters
            param = {key: value for key, value in param.items() if value not in [None, 'None']}
            response = self._submit_task("image_to_model", param, start_time)
            model_data = self._handle_task_response(response, start_time)
            if model_data['status'] != 'success':
                logger.error("Model creation failed, aborting.")
                return model_data
            model_creation_task_id = model_data['task_id']
            logger.info(f"Model created successfully with task ID: {model_creation_task_id}")

            # Step 2: Animate the rig
            logger.debug(f"Animating rig for model with task ID: {model_creation_task_id}")
            animate_response = self.animate_rig(model_creation_task_id)
            
            if animate_response['status'] != 'success':
                logger.error(f"Rig animation failed: {animate_response['message']}")
                return animate_response

            texture_response = self.texture(model_creation_task_id)
            
            if texture_response['status'] != 'success':
                logger.error(f"Texture failed: {texture_response['message']}")
                return texture_response
            return texture_response
        except Exception as e:
            logger.error(f"Error creating 3D model from image: {e}")
            return {'status': 'error', 'message': str(e), 'task_id': None}

    def multiview_to_3d(self, image_names, model_version, texture, pbr, multiview_orth_proj, model_seed, texture_seed, texture_quality, texture_alignment, face_limit, quad):
        try:
            logger.debug(f"Creating 3D model from multiview images: {image_names}")
            start_time = time.time()
            image_tokens = []
            for image_name in image_names:
                if image_name:
                    image_token = self.upload(image_name)
                    if isinstance(image_token, dict):  
                        return image_token
                    image_tokens.append(image_token)
                else:
                    image_tokens.append(None) 
            param = {
                "files": [{"type": "jpg", "file_token": token} for token in image_tokens if token],
                "model_version": model_version,
                "texture": texture,
                "pbr": pbr,
                "multiview_orth_proj": multiview_orth_proj,
                "model_seed": model_seed,
                "texture_seed": texture_seed,
                "texture_quality": texture_quality,
                "texture_alignment": texture_alignment,
                "face_limit": face_limit,
                "quad": quad
            }
            # Remove None or invalid parameters
            param = {key: value for key, value in param.items() if value not in [None, 'None']}
            response = self._submit_task("multiview_to_model", param, start_time)
            model_data = self._handle_task_response(response, start_time)
            if model_data['status'] != 'success':
                logger.error("Model creation failed, aborting.")
                return model_data
            model_creation_task_id = model_data['task_id']
            logger.info(f"Model created successfully with task ID: {model_creation_task_id}")

            # Step 2: Animate the rig
            logger.debug(f"Animating rig for model with task ID: {model_creation_task_id}")
            animate_response = self.animate_rig(model_creation_task_id)
            
            if animate_response['status'] != 'success':
                logger.error(f"Rig animation failed: {animate_response['message']}")
                return animate_response

            texture_response = self.texture(model_creation_task_id)
            
            if texture_response['status'] != 'success':
                logger.error(f"Texture failed: {texture_response['message']}")
                return texture_response
            return texture_response        
        except Exception as e:
            logger.error(f"Error creating 3D model from multiview images: {e}")
            return {'status': 'error', 'message': str(e), 'task_id': None}

    def _submit_task(self, task_type, task_payload, start_time):
        try:
            if time.time() - start_time > self.timeout:
                logger.error("Operation timed out while submitting task.")
                return {'status': 'error', 'message': 'Operation timed out', 'task_id': None}
            logger.debug(f"Submitting task: {task_type}")
            response = requests.post(
                f"{self.api_url}/task",
                headers={"Content-Type": "application/json", "Authorization": f"Bearer {self.api_key}"},
                json={"type": task_type, **task_payload}
            )
            logger.debug(f"Task submission response: {response.status_code} {response.text}")
            return response
        except Exception as e:
            logger.error(f"Error submitting task: {e}")
            return {'status': 'error', 'message': str(e), 'task_id': None}

    def _poll_task_status(self, task_id, start_time):
        try:
            last_progress = -1
            while True:
                if time.time() - start_time > self.timeout:
                    logger.error("Operation timed out while polling task status.")
                    return {'status': 'error', 'message': 'Operation timed out', 'task_id': task_id}
                response = requests.get(
                    f"{self.api_url}/task/{task_id}",
                    headers={"Authorization": f"Bearer {self.api_key}"}
                )
                if response.status_code == 200:
                    data = response.json()
                    status = data['data']['status']
                    progress = data['data'].get('progress', 0)
                    if progress != last_progress:
                        logger.info(f"Task Progress: {progress}%")
                        last_progress = progress
                    if status not in ['queued', 'running']:
                        return data
                else:
                    logger.error(f"Failed to get task status: {response.status_code}")
                    return "Failed to get task status."
                time.sleep(self.polling_interval)
        except Exception as e:
            logger.error(f"Error polling task status: {e}")
            return {'status': 'error', 'message': str(e), 'task_id': task_id}

    def _handle_task_response(self, response, start_time):
        try:
            if response.status_code == 200:
                task_id = response.json()['data']['task_id']
                logger.info(f"Task ID: {task_id}")
                result = self._poll_task_status(task_id, start_time)
                if isinstance(result, str):
                    raise Exception(result)
                status = result['data']['status']
                if status == 'success':
                    logger.info("Task completed successfully.")
                    return self._download_model(result['data']['output'], task_id)
                else:
                    logger.error(f"Task did not complete successfully. Status: {status}")
                    return {'status': status, 'message': 'Task did not complete successfully', 'task_id': task_id}
            else:
                logger.error(f"Error handling task response: {response.json().get('message', 'Unknown error')}")
                return {'status': 'error', 'message': response.json().get('message', 'An unexpected error occurred'), 'task_id': None}
        except Exception as e:
            logger.error(f"Error handling task response: {e}")
            return {'status': 'error', 'message': str(e), 'task_id': None}

        
    def _download_model(self, model_url, task_id):
        try:
            logger.debug(f"Downloading model from URL: {model_url}")
            
            # Check if model_url contains one of the expected keys
            for name in ["pbr_model", "model", "base_model"]:
                if name in model_url:
                    model_url = model_url[name]
                    break

            # Download the model content
            response = requests.get(model_url)
            
            if response.status_code == 200:
                # Process the URL to get the correct file name
                postfix_index = model_url.find('?')
                assert postfix_index > 0
                model_url = model_url[:postfix_index]
                postfix_index = model_url.rfind('/')
                assert postfix_index > 0
                file_name = model_url[postfix_index + 1:]
                file_name_without_extension, extension = os.path.splitext(file_name)
                if extension == '.glb':
                    file_name_without_extension = file_name_without_extension 
                # Upload the downloaded model to Cloudinary
                logger.debug(f"Uploading model to Cloudinary...")

                # Ensure the public_id doesn't contain the extension twice
                public_id = f"models/{task_id}/{file_name_without_extension}"  # Use task_id and file_name without extension as part of the public ID
                
                upload_response = cloudinary.uploader.upload(
                    response.content, 
                    resource_type="auto",  
                    public_id=public_id  # Use the cleaned up public_id
                )

                if 'url' in upload_response:
                    logger.info(f"Model uploaded to Cloudinary: {upload_response['url']}")
                    return {'status': 'success', 'model_url': upload_response['url'], 'task_id': task_id}
                else:
                    logger.error(f"Cloudinary response does not contain a 'url': {upload_response}")
                    return {'status': 'error', 'message': "Cloudinary upload failed (no URL in response)", 'task_id': task_id}
                    
            else:
                logger.error(f"Failed to download model: {response.status_code}")
                return {'status': 'error', 'message': 'Failed to download model', 'task_id': task_id}

        except Exception as e:
            logger.error(f"Error downloading model: {e}")
            return {'status': 'error', 'message': str(e), 'task_id': task_id}
