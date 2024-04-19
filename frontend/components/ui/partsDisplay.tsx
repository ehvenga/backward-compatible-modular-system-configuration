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
  const [selectedParts, setSelectedParts] = useState({});

  useEffect(() => {
    if (Object.keys(groupedPartsChainList).length) {
      const initialSelectedParts = {};
      Object.entries(groupedPartsChainList).forEach(([stage, groups]) => {
        groups.forEach((group, index) => {
          const key = `${stage}-${index}`;
          initialSelectedParts[key] = group.parts[0].partId.toString();
        });
      });
      setSelectedParts(initialSelectedParts);
    }
  }, [groupedPartsChainList]);

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

  const getPartCost = (parts, selectedPartId) => {
    const part = parts.find(
      (part) => part.partId.toString() === selectedPartId
    );
    return part ? part.partCost : '0';
  };

  const getPartReputation = (parts, selectedPartId) => {
    const part = parts.find(
      (part) => part.partId.toString() === selectedPartId
    );
    return part ? part.partReputation : '0';
  };

  const calculateTotalCost = () => {
    return Object.entries(selectedParts).reduce((total, [key, partId]) => {
      const [stage, index] = key.split('-');
      const group = groupedPartsChainList[stage][index];
      const part = group.parts.find(
        (part) => part.partId.toString() === partId
      );
      return total + (part ? parseFloat(part.partCost) : 0);
    }, 0);
  };

  const calculateTotalReputation = () => {
    return Object.entries(selectedParts).reduce((total, [key, partId]) => {
      const [stage, index] = key.split('-');
      const group = groupedPartsChainList[stage][index];
      const part = group.parts.find(
        (part) => part.partId.toString() === partId
      );
      return total + (part ? parseFloat(part.partReputation) : 0);
    }, 0);
  };

  if (Object.keys(groupedPartsChainList).length === 0) {
    return <div></div>;
  }

  const totalCost = calculateTotalCost();
  const totalReputation = calculateTotalReputation();

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
              <h2 className='font-semibold w-24 text-lg'>
                Stage {Number(stage) + 1}
              </h2>

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
                          defaultValue={group.parts[0].partId.toString()}
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
                        {totalCost ? (
                          <span className='font-medium text-sm pl-1'>
                            Cost: $
                            {getPartCost(group.parts, selectedParts[key])}
                          </span>
                        ) : totalReputation ? (
                          <span className='font-medium text-sm pl-1'>
                            Reputation Points:{' '}
                            {getPartReputation(group.parts, selectedParts[key])}
                          </span>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {totalCost ? (
            <div className='mt-4 pl-28 font-semibold'>
              <span>Total Cost: ${totalCost.toFixed(2)}</span>
            </div>
          ) : totalReputation ? (
            <div className='mt-4 pl-28 font-semibold'>
              <span>Total Reputation Points: {totalReputation.toFixed()}</span>
            </div>
          ) : (
            <></>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PartsDisplay;
