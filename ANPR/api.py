import io
import base64
import uvicorn
import fastanpr
import numpy as np

from PIL import Image
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="FastANPR",
    description="A web server for FastANPR hosted using FastAPI",
    version=fastanpr.__version__
)
fast_anpr = fastanpr.FastANPR()


class FastANPRRequest(BaseModel):
    image: str


class FastANPRResponse(BaseModel):
    number_plates: list[fastanpr.NumberPlate] = None


def base64_image_to_ndarray(base64_image_str: str) -> np.ndarray:
    print("Converting base64 image to ndarray.")
    try:
        image_data = base64.b64decode(base64_image_str)
        image = Image.open(io.BytesIO(image_data))
        print("Image successfully decoded and converted to ndarray.")
        return np.array(image, dtype=np.uint8)
    except Exception as e:
        print(f"Error decoding base64 image: {str(e)}")
        raise


@app.post("/recognise", response_model=FastANPRResponse)
async def recognise(request: FastANPRRequest):
    print(f"Received a request to process a license plate image with base64 data.")
    
    try:
        # Print the size of the base64 image string
        print(f"Base64 image length: {len(request.image)} characters")
        
        image = base64_image_to_ndarray(request.image)
        print("Image converted to ndarray, passing to FastANPR.")
        
        # Run the ANPR model
        number_plates = (await fast_anpr.run(image))[0]
        print(f"FastANPR processing complete. Found {len(number_plates)} license plate(s).")
        print(number_plates)
        return FastANPRResponse(
            number_plates=[fastanpr.NumberPlate.parse_obj(number_plate.__dict__) for number_plate in number_plates]
        )
    
    except Exception as e:
        print(f"Error processing the license plate image: {str(e)}")
        return {"success": False, "message": f"Error: {str(e)}"}


if __name__ == "__main__":
    print("Starting FastAPI server with FastANPR.")
    uvicorn.run(app, host="0.0.0.0", port=5000, log_level="debug")
