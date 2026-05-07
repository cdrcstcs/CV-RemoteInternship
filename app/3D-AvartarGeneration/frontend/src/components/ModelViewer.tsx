import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

interface ModelViewerProps {
  modelUrl: string;
}

const Model: React.FC<{ modelUrl: string }> = ({ modelUrl }) => {
  const { scene } = useGLTF(modelUrl); // Load the model using useGLTF hook

  return <primitive object={scene} scale={1} position={[0, 0, 0]} />;
};

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  return (
    <div className="w-full h-96">
      <Canvas
        camera={{ position: [0, 0, 2], fov: 30 }} // Move the camera closer and adjust FOV for zoom effect
        style={{ backgroundColor: 'white' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Model modelUrl={modelUrl} />
        <OrbitControls /> {/* This allows user to interact with the model */}
      </Canvas>
    </div>
  );
};

export default ModelViewer;
