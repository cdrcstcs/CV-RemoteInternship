import numpy as np
from pathlib import Path
from typing import Union, List
from .detection import Detector
from .recognition import Recogniser
from .numberplate import NumberPlate
from ultralytics import YOLO

class FastANPR:
    def __init__(
            self,
            detection_model: Union[str, Path] = "yolov8s",  # Default to YOLOv8 small model
            device: str = "cpu"
    ):
        """
        Initializes the FastANPR model with detection and recognition components.
        """
        try:
            # Print the start of the initialization process
            print("Initializing FastANPR model...")
            
            # Load the detector with a pre-trained model from Ultralytics repository
            print(f"Loading detector model: {detection_model}")
            self.detector = Detector(detection_model=detection_model, device=device)
            
            # Initialize the recogniser
            print(f"Initializing recognizer on device: {device}")
            self.recogniser = Recogniser(device=device)
            self.device = device
            print("FastANPR model initialized successfully.")
        except Exception as e:
            print(f"Failed to initialize FastANPR model: {e}")
            raise

    async def run(self, images: Union[np.ndarray, List[np.ndarray]]) -> List[List[NumberPlate]]:
        """
        Runs ANPR on a list of images and returns a list of detected number plates.
        """
        print(f"Starting ANPR processing for {len(images)} image(s)...")
        
        # Handle input image type (ndarray or List[ndarray])
        if isinstance(images, np.ndarray):
            print("Processing a single image.")
            if len(images.shape) == 3:
                images = [images]
            elif len(images.shape) == 4:
                images = [image for image in images]
            else:
                print(f"Unexpected image dimensions: {images.shape}")
                raise ValueError(f"Expected ndarray images of dimension 3 or 4, but {len(images.shape)} received.")
        elif isinstance(images, List):
            print(f"Processing {len(images)} images.")
        else:
            print(f"Unexpected image type: {type(images).__name__}")
            raise ValueError(f"Expected images of type ndarray or List[ndarray], but {type(images).__name__} received.")
        
        # Detect number plates
        try:
            print("Running detection on images...")
            detections = self.detector.run(images)
            print(f"Detection completed. Found {sum(len(d) for d in detections)} detections across all images.")
        except Exception as e:
            print(f"Error during detection: {e}")
            raise

        # OCR on detected number plates
        results = []
        for idx, image_detections in enumerate(detections):
            image_results = []
            print(f"Processing detections for image {idx + 1}...")
            if image_detections:
                print(f"Found {len(image_detections)} detections in image {idx + 1}.")
                for detection in image_detections:
                    try:
                        # Run OCR recognition on the detected plate
                        print(f"Recognizing number plate in detection box {detection.box}...")
                        recognition = self.recogniser.run(detection.image)
                        
                        if recognition:
                            print(f"Recognition successful: {recognition.text}")
                            # Offset the OCR polygon to match the detection box
                            offset_recog_poly = self._offset_recognition_poly(detection.box, recognition.poly)
                            image_results.append(
                                NumberPlate(
                                    det_box=detection.box,
                                    det_conf=detection.conf,
                                    rec_poly=offset_recog_poly,
                                    rec_text=recognition.text,
                                    rec_conf=recognition.conf
                                )
                            )
                        else:
                            print(f"Recognition failed for detection box {detection.box}.")
                            image_results.append(NumberPlate(det_box=detection.box, det_conf=detection.conf))
                    except Exception as e:
                        print(f"Error during recognition: {e}")
                        image_results.append(NumberPlate(det_box=detection.box, det_conf=detection.conf))
            else:
                print(f"No detections found for image {idx + 1}.")
            
            results.append(image_results)

        print("ANPR processing completed.")
        return results

    @staticmethod
    def _offset_recognition_poly(detection_box: List[int], recognition_poly: List[List[int]]) -> List[List[int]]:
        """
        Offsets the OCR recognition polygon based on the detection box.
        """
        return [[point[0] + detection_box[0], point[1] + detection_box[1]] for point in recognition_poly]
