import React, { useState } from 'react';
import NavigationTabs from '../components/NavigationTabs';
import UserInputForm from '../components/UserInputForm';
import ModelViewer from '../components/ModelViewer';

const Home: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('text');
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  const handleSubmit = async (formData: any) => {
    try {
      let response;
      const apiBaseUrl = import.meta.env.VITE_BASE_URL; // Access the VITE_BASE_URL from environment variables

      // Create a new FormData object to handle the multipart form-data request
      const form = new FormData();

      // Append the form fields to the FormData object
      Object.keys(formData).forEach((key) => {
        if (key === 'image' || key === 'imageLeft' || key === 'imageBack' || key === 'imageRight') {
          // If it's an image field, append the file(s) directly
          form.append(key, formData[key]);
        } else {
          // For other fields, append the value as text
          form.append(key, formData[key]);
        }
      });

      // Determine which API endpoint to call based on the current tab
      if (currentTab === 'text') {
        response = await fetch(`${apiBaseUrl}/generate_text_to_model`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Send the content as JSON
          },
          body: JSON.stringify(formData),
        });
      } else if (currentTab === 'image') {
        response = await fetch(`${apiBaseUrl}/generate_image_to_model`, {
          method: 'POST',
          body: form, // Send the FormData object
        });
      } else if (currentTab === 'multiview') {
        response = await fetch(`${apiBaseUrl}/generate_multiview_to_model`, {
          method: 'POST',
          body: form, // Send the FormData object
        });
      }

      // Check if the response is valid and successful
      if (response && response.ok) {
        const result = await response.json();
        if (result.model) {
          setModelUrl(result.model);  // Set the URL for the 3D model
        } else {
          console.error('Error: Model URL not found in response');
        }
      } else {
        // Handle non-2xx responses
        console.error('Failed to generate model, status code:', response?.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 w-full">
      <NavigationTabs currentTab={currentTab} onChangeTab={handleTabChange} />
      <UserInputForm currentTab={currentTab} onSubmit={handleSubmit} />
      {modelUrl && <ModelViewer modelUrl={modelUrl} />}
    </div>
  );
};

export default Home;