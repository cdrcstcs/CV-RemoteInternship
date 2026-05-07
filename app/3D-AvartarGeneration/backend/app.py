import os
import logging
from flask import Flask, request, jsonify
from system import TripoAPI, save_tensor
from flask_cors import CORS
from torchvision import transforms
from PIL import Image as PILImage
from dotenv import load_dotenv
import base64
from io import BytesIO

# Load environment variables
load_dotenv()  
tripo_api_key = os.getenv("TRIPO_API_KEY")

def GetTripoAPI(apikey: str):
    apikey = tripo_api_key if tripo_api_key else apikey
    if not apikey:
        raise RuntimeError("TRIPO API key is required")
    return TripoAPI(apikey), apikey

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Setup logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Log to both console and file
file_handler = logging.FileHandler("app.log")
file_handler.setLevel(logging.DEBUG)  # Set file logging level to DEBUG
file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
app.logger.addHandler(file_handler)

@app.route('/generate_text_to_model', methods=['POST'])
def generate_text_to_model_api():
    try:
        data = request.json
        prompt = data.get("prompt")
        prompt = prompt + ' and is standing with normal body position'
        model_version = data.get("model_version", "v2.5-20250123")
        style = data.get("style", None)
        texture = data.get("texture", True)
        pbr = data.get("pbr", True)
        image_seed = data.get("image_seed", 42)
        model_seed = data.get("model_seed", 42)
        texture_seed = data.get("texture_seed", 42)
        texture_quality = data.get("texture_quality", "standard")
        face_limit = data.get("face_limit", -1)
        quad = data.get("quad", False)

        logger.info(f"Received request for text-to-model generation with prompt: {prompt}")

        if not prompt:
            logger.error("Prompt is missing in the request")
            return jsonify({"error": "Prompt is required"}), 400

        # Get the API object
        api, _ = GetTripoAPI(tripo_api_key)
        logger.debug("Calling TripoAPI.text_to_3d with parameters.")
        result = api.text_to_3d(prompt, model_version, style, texture, pbr, image_seed, model_seed, texture_seed, texture_quality, face_limit, quad)

        if result['status'] == 'success':
            logger.info("Model generated and converted successfully")
            # Now return the model URLs in all formats
            return jsonify({"model": result['model_url'], "task_id": result['task_id']}), 200
        else:
            logger.error(f"Failed to generate mesh: {result['message']}")
            return jsonify({"error": f"Failed to generate mesh: {result['message']}"}), 400
    except Exception as e:
        logger.exception("Error occurred during text-to-model generation")
        return jsonify({"error": str(e)}), 500


@app.route('/generate_image_to_model', methods=['POST'])
def generate_image_to_model_api():
    try:
        image = request.files.get("image")
        model_version = request.form.get("model_version", "v2.5-20250123")
        style = request.form.get("style", None)
        texture = request.form.get("texture", True)
        pbr = request.form.get("pbr", True)
        model_seed = request.form.get("model_seed", 42)
        texture_seed = request.form.get("texture_seed", 42)
        texture_quality = request.form.get("texture_quality", "standard")
        texture_alignment = request.form.get("texture_alignment", "original_image")
        face_limit = request.form.get("face_limit", -1)
        quad = request.form.get("quad", False)

        logger.info("Received request for image-to-model generation")

        if not image:
            logger.error("No image provided in the request")
            return jsonify({"error": "Image is required"}), 400

        # Open the image using PIL
        img = PILImage.open(image.stream)

        # Transform the image to tensor
        transform = transforms.ToTensor()  # Transform to tensor
        image_tensor = transform(img)

        # Save the tensor (ensure the save function handles file naming correctly)
        image_name = save_tensor(image_tensor, os.path.join('./assets/', "image"))
        logger.debug(f"Image saved with name: {image_name}")

        # Get the API object
        api, _ = GetTripoAPI(tripo_api_key)
        logger.debug("Calling TripoAPI.image_to_3d with parameters.")
        result = api.image_to_3d(image_name, model_version, style, texture, pbr, model_seed, texture_seed, texture_quality, texture_alignment, face_limit, quad)

        if result['status'] == 'success':
            logger.info("Model generated successfully")
            return jsonify({"model": result['model_url'], "task_id": result['task_id']}), 200
        else:
            logger.error(f"Failed to generate mesh: {result['message']}")
            return jsonify({"error": f"Failed to generate mesh: {result['message']}"}), 400
    except Exception as e:
        logger.exception("Error occurred during image-to-model generation")
        return jsonify({"error": str(e)}), 500

@app.route('/generate_multiview_to_model', methods=['POST'])
def generate_multiview_to_model_api():
    try:
        image = request.files.get("image")
        image_left = request.files.get("imageLeft")
        image_back = request.files.get("imageBack")
        image_right = request.files.get("imageRight")
        model_version = request.form.get("model_version", "v2.5-20250123")
        texture = request.form.get("texture", True)
        pbr = request.form.get("pbr", True)
        multiview_orth_proj = request.form.get("multiview_orth_proj")
        model_seed = request.form.get("model_seed", 42)
        texture_seed = request.form.get("texture_seed", 42)
        texture_quality = request.form.get("texture_quality", "standard")
        texture_alignment = request.form.get("texture_alignment", "original_image")
        face_limit = request.form.get("face_limit", -1)
        quad = request.form.get("quad", False)

        logger.info("Received request for multiview-to-model generation")

        if not any([image, image_left, image_back, image_right]):
            logger.error("At least one image (left, right, back, or main image) is required for multiview.")
            return jsonify({"error": "At least one image (left, right, back, or main image) is required for multiview."}), 400

        image_names = []
        # Handle images
        for img_name in ["image", "imageLeft", "imageBack", "imageRight"]:
            img = request.files.get(img_name)
            if img:
                # Open the image using PIL
                img_pil = PILImage.open(img.stream)
                # Transform the image to tensor and save it
                transform = transforms.ToTensor()
                image_tensor = transform(img_pil)
                image_filename = save_tensor(image_tensor, os.path.join('./assets/', img_name))
                image_names.append(image_filename)
            else:
                image_names.append(None)

        # Get the API object
        api, _ = GetTripoAPI(tripo_api_key)
        logger.debug("Calling TripoAPI.multiview_to_3d with parameters.")
        result = api.multiview_to_3d(image_names, model_version, texture, pbr, multiview_orth_proj, model_seed, texture_seed, texture_quality, texture_alignment, face_limit, quad)

        if result['status'] == 'success':
            logger.info("Model generated successfully")
            return jsonify({"model": result['model_url'], "task_id": result['task_id']}), 200
        else:
            logger.error(f"Failed to generate mesh: {result['message']}")
            return jsonify({"error": f"Failed to generate mesh: {result['message']}"}), 400
    except Exception as e:
        logger.exception("Error occurred during multiview-to-model generation")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
