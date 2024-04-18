'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PartsDisplay = ({ groupedPartsChainList, parameterList }) => {
  // Initialize the selected parts state to manage each group's selected part
  const [selectedParts, setSelectedParts] = useState({});

  // Set default selected values after groupedPartsChainList is loaded
  useEffect(() => {
    if (Object.keys(groupedPartsChainList).length) {
      const initialSelectedParts = {};
      Object.entries(groupedPartsChainList).forEach(([stage, groups]) => {
        groups.forEach((group, index) => {
          const key = `${stage}-${index}`;
          initialSelectedParts[key] = group.parts[0].partId.toString(); // Set to the first part's partId
        });
      });
      setSelectedParts(initialSelectedParts);
    }
  }, [groupedPartsChainList]);

  // Handle selection changes for individual select components
  const handleValueChange = (key, value) => {
    setSelectedParts((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getLabel = (parameterId) => {
    const item = parameterList.find((item) => item.value === parameterId);
    return item ? item.label : null;
  };

  if (Object.keys(groupedPartsChainList).length === 0) {
    return <div></div>;
  }

  return (
    <div>
      <Card className='mt-6 relative bg-white shadow-lg sm:rounded-3xl p-6 bg-clip-padding bg-opacity-80 border border-gray-100'>
        <CardHeader>
          <CardTitle className='pb-2 text-2xl border-b border-slate-400'>
            Solution
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(groupedPartsChainList).map(([stage, groups]) => (
            <div className='flex gap-x-5 w-full items-center' key={stage}>
              <h2 className='font-semibold w-24'>Stage {Number(stage) + 1}</h2>

              <div className='flex flex-wrap gap-y-3 gap-x-5 border-2 border-purple-300 px-4 py-3 rounded w-full'>
                {groups.map((group, index) => {
                  const key = `${stage}-${index}`;
                  return (
                    <div
                      className='border-2 border-purple-400 px-3 py-2 rounded'
                      key={key}
                    >
                      <div className='flex flex-wrap flex-col px-2 py-1 gap-y-1.5'>
                        <h3 className='text-sm'>
                          {group.parameters
                            .map((id) => getLabel(id))
                            .join(' to ')}
                        </h3>

                        <Select
                          onValueChange={(value) =>
                            handleValueChange(key, value)
                          }
                          value={selectedParts[key]}
                          defaultValue={group.parts[0].partId.toString()} // Ensure default value is set
                        >
                          <SelectTrigger className='w-[520px] text-lg'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {group.parts.map((part) => (
                              <SelectItem
                                key={part.partId}
                                value={part.partId.toString()}
                              >
                                {part.partName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PartsDisplay;
