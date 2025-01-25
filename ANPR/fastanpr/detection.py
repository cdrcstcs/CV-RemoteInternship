import numpy as np
from pathlib import Path
from ultralytics import YOLO
from pydantic import BaseModel
from typing import Union, List

class Detection(BaseModel):
    image: np.ndarray
    box: List[int]
    conf: float

    class Config:
        frozen = True
        arbitrary_types_allowed = True


class Detector:
    def __init__(self, detection_model: Union[str, Path], device: str):
        """
        Initializes the detector with the YOLO model.
        
        :param detection_model: Path to the YOLO model or model name (e.g., "yolov8s").
        :param device: Device to run the model on ('cpu' or 'cuda').
        """
        print(f"Initializing detector with model: {detection_model} on device: {device}")
        self.device = device
        try:
            # Load the YOLO model
            self.model = YOLO(model=detection_model)
            print(f"Model {detection_model} loaded successfully.")
        except Exception as e:
            print(f"Failed to load model {detection_model}: {e}")
            raise

    def run(self, images: List[np.ndarray]) -> List[List[Detection]]:
        """
        Runs detection on the list of images.
        
        :param images: List of images (numpy arrays) to run detection on.
        :return: List of detections for each image.
        """
        print(f"Running detection on {len(images)} image(s)...")
        try:
            predictions = self.model.predict(images, device=self.device, verbose=False)
        except Exception as e:
            print(f"Error during inference: {e}")
            raise
        
        results = []
        for idx, (image, detection) in enumerate(zip(images, predictions)):
            image_detections = []
            print(f"Processing image {idx + 1}...")

            if detection.boxes:
                det_boxes = detection.boxes.cpu().data.numpy().astype(int).tolist()
                det_confs = detection.boxes.cpu().conf.numpy().tolist()
                print(f"Found {len(det_boxes)} detections in image {idx + 1}.")

                for det_box, det_conf in zip(det_boxes, det_confs):
                    x_min, x_max, y_min, y_max = det_box[0], det_box[2], det_box[1], det_box[3]
                    print(f"Detection box: {det_box}, confidence: {det_conf:.4f}")
                    
                    # Crop the image to the detection box
                    cropped_image = image[y_min:y_max, x_min:x_max, :]
                    image_detections.append(
                        Detection(image=cropped_image, box=det_box[:4], conf=det_conf)
                    )
            else:
                print(f"No detections found in image {idx + 1}.")
            
            results.append(image_detections)
        
        print("Detection completed for all images.")
        return results
