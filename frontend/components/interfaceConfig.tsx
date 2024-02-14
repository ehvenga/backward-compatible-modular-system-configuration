'use client';

import React, { useState } from 'react';

type Part = {
  partName: string;
  step: string;
};

const InterfaceConfig: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([]);

  const addPart = () => {
    setParts((parts) => [...parts, { partName: '', step: '' }]);
  };

  const handlePartNameChange = (index: number, value: string) => {
    const newParts = [...parts];
    newParts[index].partName = value;
    setParts(newParts);
  };

  const handleStepChange = (index: number, value: string) => {
    const newParts = [...parts];
    newParts[index].step = value;
    setParts(newParts);
  };

  const removePart = (index: number) => {
    setParts((parts) => parts.filter((_, i) => i !== index));
  };

  const clearAllParts = () => {
    setParts([]);
  };

  return (
    <div className='flex flex-col w-full mt-8 gap-y-4'>
      <button
        onClick={addPart}
        className='self-start mb-2 bg-gray-50 px-5 py-1 border border-gray-500 rounded'
      >
        Add Part
      </button>
      {parts.map((part, index) => (
        <div key={index} className='flex w-full gap-x-6 items-center'>
          <div className='flex gap-x-2'>
            <label
              htmlFor={`inputParam-${index}`}
              id={`inputParam-${index}-label`}
              className='w-24'
            >
              {index + 1}. Part Name
            </label>
            <input
              type='text'
              name={`inputParam-${index}`}
              id={`inputParam-${index}`}
              value={part.partName}
              onChange={(e) => handlePartNameChange(index, e.target.value)}
            />
          </div>
          <div className='flex gap-x-2'>
            <label htmlFor={`outputParam-${index}`}>Step</label>
            <input
              type='number'
              name={`outputParam-${index}`}
              id={`outputParam-${index}`}
              value={part.step}
              onChange={(e) => handleStepChange(index, e.target.value)}
            />
          </div>
          <button onClick={() => removePart(index)} className='ml-2'>
            Remove
          </button>
        </div>
      ))}
      {parts.length > 0 && (
        <button onClick={clearAllParts} className='self-start mt-4'>
          Clear All
        </button>
      )}
    </div>
  );
};

export default InterfaceConfig;
