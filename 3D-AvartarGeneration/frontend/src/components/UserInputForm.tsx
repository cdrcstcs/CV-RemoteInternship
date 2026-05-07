import React, { useState } from 'react';

interface UserInputFormProps {
  onSubmit: (data: any) => void;
  currentTab: string;
}

const UserInputForm: React.FC<UserInputFormProps> = ({ onSubmit, currentTab }) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imageLeft, setImageLeft] = useState<File | null>(null);
  const [imageRight, setImageRight] = useState<File | null>(null);
  const [imageBack, setImageBack] = useState<File | null>(null);

  const handleSubmit = () => {
    let formData: any = {};

    if (currentTab === 'text') {
      formData = { prompt };
    }

    if (currentTab === 'image') {
      if (image) {
        formData = { image };
      }
    }

    if (currentTab === 'multiview') {
      formData = {
        image,
        imageLeft,
        imageRight,
        imageBack,
      };
      // Remove any null image values from formData
      Object.keys(formData).forEach((key) => {
        if (formData[key] === null) {
          delete formData[key];
        }
      });
    }

    onSubmit(formData);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg w-full max-w-md mx-auto">
      {currentTab === 'text' && (
        <div>
          <input
            type="text"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
      )}

      {currentTab === 'image' && (
        <div>
          <input
            type="file"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </div>
      )}

      {currentTab === 'multiview' && (
        <div>
          <input
            type="file"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
          <input
            type="file"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setImageLeft(e.target.files?.[0] || null)}
          />
          <input
            type="file"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setImageRight(e.target.files?.[0] || null)}
          />
          <input
            type="file"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setImageBack(e.target.files?.[0] || null)}
          />
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white p-3 rounded-lg mt-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </div>
  );
};

export default UserInputForm;