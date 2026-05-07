import React from 'react';

interface NavigationTabsProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ currentTab, onChangeTab }) => {
  return (
    <div className="flex justify-around mb-4">
      <button
        className={`p-2 ${currentTab === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} rounded-lg`}
        onClick={() => onChangeTab('text')}
      >
        Text to 3D
      </button>
      <button
        className={`p-2 ${currentTab === 'image' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} rounded-lg`}
        onClick={() => onChangeTab('image')}
      >
        Image to 3D
      </button>
      <button
        className={`p-2 ${currentTab === 'multiview' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} rounded-lg`}
        onClick={() => onChangeTab('multiview')}
      >
        Multi-Image to 3D
      </button>
    </div>
  );
};

export default NavigationTabs;