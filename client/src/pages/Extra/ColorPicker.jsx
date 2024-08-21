import React from 'react';

const ColorPicker = ({ selectedColor, setSelectedColor, colorOptions }) => {
  return (
    <div className='flex gap-3'>
      {colorOptions.map((color, index) => (
        <div
          key={index}
          onClick={() => setSelectedColor(color)}
          className={`w-8 h-8 rounded-full cursor-pointer ${
            selectedColor === color
              ? 'ring-4 ring-offset-2 ring-fuchsia-400'
              : ''
          }`}
          style={{ backgroundColor: getColor(color) }} // getColor should be a utility function that returns the actual color code.
        />
      ))}
    </div>
  );
};

// Utility function to get color code
const getColor = (colorIndex) => {
  const colors = [
    '#F28B82',
    '#F7BD02',
    '#FBF476',
    '#CCFF90',
    '#A7FFEB',
    '#CBF0F8',
    '#AECBFA',
    '#D7AEFB',
    '#FBCFE8',
    '#E6C9A8',
  ];
  return colors[colorIndex] || '#FFFFFF';
};

export default ColorPicker;
