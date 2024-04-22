import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PartsDisplay = ({
  groupedPartsChainList,
  parameterList,
  totalCostsList,
  avgRepList,
}) => {
  const [selectedParts, setSelectedParts] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [totalReputation, setTotalReputation] = useState(0);
  const [averageReputation, setAverageReputation] = useState(0);

  const firstValidValue = useMemo(() => {
    if (!Array.isArray(totalCostsList)) {
      // If totalCostsList is not an array, return null
      return null;
    }
    const validValues = totalCostsList.filter((value) => value > 10);
    return validValues.length > 0 ? Math.min(...validValues) : null;
  }, [totalCostsList]);

  const colorStyle = useMemo(() => {
    if (!firstValidValue || totalCost < firstValidValue) {
      // Keep color black if no valid value or totalCost is below the first valid value
      return { color: 'black' };
    }

    // Adjusting the color components
    const maxCost = Math.max(...totalCostsList);
    const ratio = (totalCost - firstValidValue) / (maxCost - firstValidValue);
    const red = Math.min(255, Math.floor(255 * ratio));
    const green = Math.max(0, Math.floor(255 * (1 - ratio)));
    const blue = 50; // A fixed amount of blue to soften the color

    // Modifying color brightness by adding black
    const adjustBrightness = 0.75; // Reduce overall brightness to 75%
    const darkerRed = Math.floor(red * adjustBrightness);
    const darkerGreen = Math.floor(green * adjustBrightness);

    return { color: `rgb(${darkerRed},${darkerGreen},${blue})` };
  }, [totalCost, totalCostsList, firstValidValue]);

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

  useEffect(() => {
    setTotalCost(calculateTotalCost());
    setTotalReputation(calculateTotalReputation());
    setAverageReputation(calculateAverageReputation());
  }, [selectedParts, groupedPartsChainList]);

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
      if (
        groupedPartsChainList &&
        groupedPartsChainList[stage] &&
        groupedPartsChainList[stage][index]
      ) {
        const group = groupedPartsChainList[stage][index];
        const part = group.parts.find(
          (part) => part.partId.toString() === partId
        );
        return total + (part ? parseFloat(part.partReputation) : 0);
      }
    }, 0);
  };

  const calculateAverageReputation = () => {
    const result = Object.entries(selectedParts).reduce(
      (acc, [key, partId]) => {
        const [stage, index] = key.split('-');
        if (
          groupedPartsChainList &&
          groupedPartsChainList[stage] &&
          groupedPartsChainList[stage][index]
        ) {
          const group = groupedPartsChainList[stage][index];
          const part = group.parts.find(
            (part) => part.partId.toString() === partId
          );

          // If part is found and has a valid reputation, add it to the total
          if (part) {
            const reputation = parseFloat(part.partReputation);
            if (!isNaN(reputation)) {
              acc.total += reputation;
              acc.count += 1;
            }
          }
        }
        return acc;
      },
      { total: 0, count: 0 }
    );

    // Calculate average: check if count is not zero to avoid division by zero
    return result.count > 0 ? result.total / result.count : 0;
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
        <CardContent className='flex flex-wrap gap-y-4'>
          {Object.entries(groupedPartsChainList).map(([stage, groups]) => (
            <div className='flex gap-x-5 w-full items-center' key={stage}>
              <h2 className='font-semibold w-24 text-lg'>
                Stage {Number(stage) + 1}
              </h2>

              <div className='flex flex-wrap gap-y-3 gap-x-5 border-2 border-purple-300 px-4 py-3 rounded w-full justify-between'>
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
                          <SelectTrigger className='w-[570px] text-lg'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem key='none' value='none'>
                              None
                            </SelectItem>
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
                        <div className='flex gap-x-3 font-medium text-sm ml-1 mt-0.5'>
                          <span>
                            Cost: $
                            {getPartCost(group.parts, selectedParts[key])}
                          </span>
                          <span>
                            Reputation Points:{' '}
                            {getPartReputation(group.parts, selectedParts[key])}
                          </span>
                        </div>
                        {/* {totalCost ? (
                        ) : totalReputation ? (
                        ) : (
                          <></>
                        )} */}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div className='mt-4 pl-28 font-semibold flex gap-x-8'>
            <span>
              Total Cost:{' '}
              <span style={colorStyle}> ${totalCost.toFixed(2)}</span>
            </span>
            <span>
              Average Reputation Points: {averageReputation.toFixed(2)}
            </span>
          </div>
          {/* {totalCost ? (
            <div className='mt-4 pl-28 font-semibold'>
            </div>
          ) : totalReputation ? (
            <div className='mt-4 pl-28 font-semibold'>
            </div>
          ) : (
            <></>
          )} */}
        </CardContent>
      </Card>
    </div>
  );
};

export default PartsDisplay;
