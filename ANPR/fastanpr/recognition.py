import easyocr
from pydantic import BaseModel
from typing import List, Optional, Tuple

class Recognition(BaseModel):
    text: str
    poly: List[List[int]]
    conf: float

    class Config:
        frozen = True

class Recogniser:
    def __init__(self, device: str):
        """
        Initializes the Recogniser with EasyOCR.
        
        :param device: Device to run the model on ('cpu' or 'cuda').
        """
        self.device = device
        print(f"Initializing EasyOCR with device: {device}")
        self.reader = easyocr.Reader(['en'], gpu=(device == "cuda"))
        print("EasyOCR model initialized successfully.")

    def run(self, image) -> Optional[Recognition]:
        """
        Runs OCR on the given image.
        
        :param image: The image to run OCR on.
        :return: Recognition object containing recognized text and bounding box.
        """
        print("Running OCR on the image.")
        results = self.reader.readtext(image)

        if results:
            print(f"Found {len(results)} prediction(s). Processing...")

            # Extract polygons, texts, and confidences
            polys = [result[0] for result in results]
            texts = [result[1] for result in results]
            confs = [result[2] for result in results]

            if len(polys) > 1:
                print("Multiple OCR boxes detected. Merging OCR results.")
                clean_poly, clean_text, clean_conf = _clean_ocr(polys, texts, confs)
            else:
                print("Single OCR box detected. Cleaning OCR result.")
                clean_poly = polys[0]
                clean_text = _clean_text(texts[0])
                clean_conf = confs[0]

            # Ensure no None values are passed to Pydantic model
            if clean_text is None:
                clean_text = ""
            if clean_conf is None:
                clean_conf = 0.0
            if clean_poly is None:
                clean_poly = []

            print(f"OCR result: {clean_text}, Confidence: {clean_conf:.4f}")
            return Recognition(text=clean_text, poly=clean_poly, conf=clean_conf)
        else:
            print("No text detected in the image.")
            # Handle empty OCR output gracefully
            return Recognition(text="", poly=[], conf=0.0)


def _clean_ocr(
        polys: List[List[List[int]]], texts: List[str], confidences: List[float]
) -> Tuple[List[List[int]], str, float]:
    """Clean multiple OCR boxes from recognition model."""
    print("Cleaning multiple OCR boxes.")
    polys, texts, confidences = _denoise_ocr_boxes(polys, texts, confidences)

    print("Merging OCR boxes.")
    return _merge_polys(polys), _merge_texts(texts), _merge_confs(confidences)


def _merge_texts(texts: List[str], delimiter: str = "") -> str:
    """Merge multiple texts into one."""
    print(f"Merging texts: {texts}")
    return _clean_text(delimiter.join(texts))


def _denoise_ocr_boxes(
        polys: List[List[List[int]]], texts: List[str], confs: List[float]
) -> Tuple[List[List[List[int]]], List[str], List[float]]:
    """Remove noisy OCR boxes detected by the recognition model."""
    print("Denoising OCR boxes.")
    
    # Get the longest box to filter out smaller ones
    polys_x_points = [[point[0] for point in poly] for poly in polys]
    poly_length = [max(poly_x_points) - min(poly_x_points) for poly_x_points in polys_x_points]
    longest_poly_idx = max(enumerate(poly_length), key=lambda x: x[1])[0]

    # Get the height of the longest box
    longest_poly_y_points = [point[1] for point in polys[longest_poly_idx]]
    longest_poly_height = max(longest_poly_y_points) - min(longest_poly_y_points)

    # Remove boxes smaller than half the height of the longest box
    valid_idx = [
        idx for idx, poly in enumerate(polys) if
        (max(point[1] for point in poly) - min(point[1] for point in poly)) >= longest_poly_height
    ]

    print(f"Valid boxes after denoising: {valid_idx}")
    return [polys[i] for i in valid_idx], [texts[i] for i in valid_idx], [confs[i] for i in valid_idx]


def _merge_confs(confidences: List[float]) -> float:
    """Merge multiple confidences into one."""
    print(f"Merging confidences: {confidences}")
    result = 1.0
    for confidence in confidences:
        result *= confidence
    return result


def _clean_text(text: str) -> str:
    """Clean text by removing non-alphanumerics."""
    print(f"Cleaning text: {text}")
    return "".join([t for t in text if t.isalnum()])
