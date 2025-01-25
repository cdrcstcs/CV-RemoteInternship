import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import useLicensePlateStore from '../../stores/useLicensePlateStore';

const LicensePlateCapturePage = () => {
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);  // Add a reference to the canvas

  const { licensePlates, isLoading, processLicensePlate } = useLicensePlateStore(state => ({
    licensePlates: state.licensePlates,
    isLoading: state.isLoading,
    processLicensePlate: state.processLicensePlate,
  }));
  console.log(licensePlates)

  // Function to capture a single image and process it
  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    processLicensePlate(imageSrc);  // Send the image to the backend for license plate detection
  };

  // UseEffect to update bounding boxes once the license plates are processed
  useEffect(() => {
    if (licensePlates.length > 0) {
      const boxes = licensePlates.map(plate => plate.bounding_box);
      setBoundingBoxes(boxes);  // Update the bounding boxes after processing
    }
  }, [licensePlates]);
// Function to draw bounding boxes on the canvas (overlay on webcam)
const drawBoundingBoxes = (ctx) => {
  if (boundingBoxes.length > 0) {
    boundingBoxes.forEach(bounding_box => {
      // Ensure bounding_box is an object with x, y, w, h properties
      if (bounding_box && typeof bounding_box === 'object' && bounding_box.hasOwnProperty('x') && bounding_box.hasOwnProperty('y') && bounding_box.hasOwnProperty('w') && bounding_box.hasOwnProperty('h')) {
        const { x, y, w, h } = bounding_box;

        // Check if the coordinates and dimensions are valid numbers
        if (typeof x === 'number' && typeof y === 'number' && typeof w === 'number' && typeof h === 'number') {
          const x1 = x;
          const y1 = y;
          const x2 = x + w;  // Calculate the bottom-right x coordinate
          const y2 = y + h;  // Calculate the bottom-right y coordinate

          ctx.strokeStyle = 'red'; // Color of the bounding box
          ctx.lineWidth = 2;
          ctx.strokeRect(x1, y1, x2 - x1, y2 - y1); // Draw the bounding box
        }
      } else {
        console.error('Invalid bounding box data:', bounding_box);
      }
    });
  }
};


  // Function to update canvas with webcam stream and bounding boxes
  const drawCanvas = () => {
    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Draw the video frame onto the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Draw the bounding boxes on top of the video
    drawBoundingBoxes(ctx);
  };

  // UseEffect to keep updating the canvas every frame
  useEffect(() => {
    const interval = setInterval(() => {
      if (canvasRef.current && webcamRef.current) {
        drawCanvas();
      }
    }, 100); // Redraw every 100ms (10 FPS)
    
    return () => clearInterval(interval); // Cleanup on unmount
  }, [boundingBoxes]);

  return (
    <div className="w-full flex justify-center items-center mt-4">

      {/* Webcam container */}
      <div className="relative" style={{ width: '60%', height: 'auto' }}>
        {/* Webcam component */}
        <Webcam
          audio={false}
          screenshotFormat="image/jpeg"
          width="100%"
          height="100%" // Maintain aspect ratio with the container
          ref={webcamRef}
          videoConstraints={{
            facingMode: 'environment',
          }}
        />
        
        {/* Canvas to overlay the bounding boxes on webcam feed */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      {/* Capture button */}
      <button 
        onClick={handleCapture} 
        disabled={isLoading} 
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        {isLoading ? 'Processing...' : 'Capture License Plate'}
      </button>

      {/* Show loading text */}
      {isLoading && <p className="mt-2 text-white">Processing...</p>}

      {/* Detected license plates */}
      <div className="mt-4 text-white">
        {licensePlates.length > 0 ? (
          <div>
            <h2>Detected License Plates:</h2>
            <ul>
              {licensePlates.map((plate, index) => (
                <li key={index}>License Plate: {plate.license_plate}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No license plates detected</p>
        )}
      </div>
    </div>
  );
};

export default LicensePlateCapturePage;
