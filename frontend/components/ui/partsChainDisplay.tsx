import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PartsChainDisplay = ({ stagedPartsChainList, BC }) => {
  const [selectedParts, setSelectedParts] = useState({});
  const [activeGroup, setActiveGroup] = useState(0);

  useEffect(() => {
    initializeSelectedParts();
  }, [stagedPartsChainList]);

  const initializeSelectedParts = () => {
    if (stagedPartsChainList.length > 0) {
      const initialSelectedParts = {};
      stagedPartsChainList[0].forEach((stage, stageIndex) => {
        const partId = stage[0].partId.toString();
        initialSelectedParts[stageIndex] = partId;
      });
      setSelectedParts(initialSelectedParts);
      setActiveGroup(0);
    }
  };

  const handleValueChange = (stageIndex, selectedPartId) => {
    const newSelectedParts = { ...selectedParts, [stageIndex]: selectedPartId };
    const selectedGroupIndex = stagedPartsChainList.findIndex((group) =>
      group[stageIndex].some(
        (part) => part.partId.toString() === selectedPartId
      )
    );

    if (selectedGroupIndex !== -1) {
      for (let i = stageIndex + 1; i < stagedPartsChainList[0].length; i++) {
        const nextPartId =
          stagedPartsChainList[selectedGroupIndex][i][0].partId.toString();
        newSelectedParts[i] = nextPartId;
      }
      // Also update previous stages if necessary
      for (let i = stageIndex - 1; i >= 0; i--) {
        const prevPartId =
          stagedPartsChainList[selectedGroupIndex][i][0].partId.toString();
        newSelectedParts[i] = prevPartId;
      }
    }

    setSelectedParts(newSelectedParts);
    setActiveGroup(selectedGroupIndex);
  };

  const getPartDetails = (stageIndex, selectedPartId) => {
    const group = stagedPartsChainList[activeGroup];
    return group[stageIndex].find(
      (part) => part.partId.toString() === selectedPartId
    );
  };

  const getPartName = (partId) => {
    for (const group of stagedPartsChainList) {
      for (const stage of group) {
        const part = stage.find((part) => part.partId.toString() === partId);
        if (part) {
          return part.partName;
        }
      }
    }
    return `Part ${partId}`;
  };

  const calculateTotalCost = () => {
    return Object.values(selectedParts).reduce((total, partId) => {
      const part = getPartDetails(
        Object.keys(selectedParts).find((key) => selectedParts[key] === partId),
        partId
      );
      return total + (part ? part.partCost : 0);
    }, 0);
  };

  const calculateAverageReputation = () => {
    const totalReputation = Object.values(selectedParts).reduce(
      (total, partId) => {
        const part = getPartDetails(
          Object.keys(selectedParts).find(
            (key) => selectedParts[key] === partId
          ),
          partId
        );
        return total + (part ? part.partReputation : 0);
      },
      0
    );
    return totalReputation / Object.keys(selectedParts).length;
  };

  const totalCost = useMemo(calculateTotalCost, [selectedParts]);
  const averageReputation = useMemo(calculateAverageReputation, [
    selectedParts,
  ]);

  if (stagedPartsChainList.length === 0) {
    return <div></div>;
  }

  return (
    <div>
      <Card className='mt-6 relative bg-white shadow-lg sm:rounded-3xl p-6 bg-clip-padding bg-opacity-80 border border-gray-100'>
        <CardHeader>
          <CardTitle className='pb-2 text-2xl border-b border-slate-400'>
            {BC ? 'Solution with Backward Compatibility' : 'Solution'}
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-wrap gap-y-4'>
          {stagedPartsChainList[0].map((_, stageIndex) => (
            <div className='flex gap-x-5 w-full items-center' key={stageIndex}>
              <h2 className='font-semibold w-24 text-lg'>
                Stage {stageIndex + 1}
              </h2>
              <div className='flex flex-wrap gap-y-3 gap-x-5 border-2 border-purple-300 px-4 py-3 rounded w-full justify-between'>
                <div
                  className='border-2 border-purple-400 px-3 py-2 rounded'
                  key={stageIndex}
                >
                  <div className='flex flex-wrap flex-col px-2 py-1 gap-y-1.5'>
                    <Select
                      onValueChange={(value) =>
                        handleValueChange(stageIndex, value)
                      }
                      value={selectedParts[stageIndex]}
                      defaultValue={selectedParts[stageIndex]}
                    >
                      <SelectTrigger className='w-[570px] text-lg'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(
                          new Set(
                            stagedPartsChainList.flatMap((group) =>
                              group[stageIndex].map((part) =>
                                part.partId.toString()
                              )
                            )
                          )
                        ).map((partId) => {
                          const partName = getPartName(partId);
                          return (
                            <SelectItem key={partId} value={partId}>
                              {partName}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {selectedParts[stageIndex] && (
                      <div className='flex gap-x-3 font-medium text-sm ml-1 mt-0.5'>
                        <span>
                          Cost: $
                          {
                            getPartDetails(
                              stageIndex,
                              selectedParts[stageIndex]
                            )?.partCost
                          }
                        </span>
                        <span>
                          Reputation Points:{' '}
                          {
                            getPartDetails(
                              stageIndex,
                              selectedParts[stageIndex]
                            )?.partReputation
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className='mt-4 w-full flex gap-x-6 font-semibold text-lg'>
            <span>Total Cost: ${totalCost}</span>
            <span>Average Reputation: {averageReputation.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartsChainDisplay;
