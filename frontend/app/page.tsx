'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import PartsDisplay from '@/components/ui/partsDisplay';

export default function Home() {
  const [parameterList, setParameterList] = useState([]);
  const [toBeSelectedInitialParamList, setToBeSelectedInitialParamList] =
    useState([]);
  const [selectedInitialParameterList, setSelectedInitialParameterList] =
    useState([]);
  const [toBeSelectedGoalFunctionList, setToBeSelectedGoalFunctionList] =
    useState([]);
  const [selectedGoalFunctionList, setSelectedGoalFunctionList] = useState([]);
  const [partsChainList, setPartsChainList] = useState([]);
  const [groupedPartsChainList, setGroupedPartsChainList] = useState([]);
  const [noSolution, setNoSolution] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [leastCost, setLeastCost] = useState(null);
  const [highestRep, setHighestRep] = useState(null);
  const [totalCostsList, setTotalCostsList] = useState(null);
  const [avgRepList, setAvgRepList] = useState(null);

  useEffect(() => {
    fetchParameterList();
    fetchFunctionList();
  }, []);

  useEffect(() => {
    setSubmitDisabled(
      !(
        selectedInitialParameterList.length > 0 &&
        selectedGoalFunctionList.length > 0
      )
    );
  }, [selectedInitialParameterList, selectedGoalFunctionList]);

  const fetchParameterList = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/parameters/');
      const jsonData = await response.json();
      const convertedList = jsonData
        .map((item) => ({
          value: item.parameterId,
          label: item.parameterName,
        }))
        .reduce(
          (acc, item) =>
            acc.some((e) => e.value === item.value) ? acc : [...acc, item],
          []
        )
        .sort((a, b) =>
          ('' + a.value).localeCompare(b.value, undefined, { numeric: true })
        );
      setParameterList(convertedList);
      setToBeSelectedInitialParamList(convertedList);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const fetchFunctionList = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/functions/');
      const jsonData = await response.json();
      const convertedList = jsonData
        .map((item) => ({
          value: item.functionId,
          label: item.functionName,
        }))
        .reduce(
          (acc, item) =>
            acc.some((e) => e.value === item.value) ? acc : [...acc, item],
          []
        )
        .sort((a, b) =>
          ('' + a.value).localeCompare(b.value, undefined, { numeric: true })
        );
      setParameterList(convertedList);
      setToBeSelectedGoalFunctionList(convertedList);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const handleInputParamClicked = (param) => {
    setSelectedInitialParameterList((prevSelected) => [...prevSelected, param]);
    setToBeSelectedInitialParamList((prevParams) =>
      prevParams.filter((item) => item.value !== param.value)
    );
  };

  const handleGoalParamClicked = (param) => {
    setSelectedGoalFunctionList((prevSelected) => [...prevSelected, param]);
    setToBeSelectedGoalFunctionList((prevParams) =>
      prevParams.filter((item) => item.value !== param.value)
    );
  };

  const handleSelectedInputParamClicked = (param) => {
    setToBeSelectedInitialParamList((prevParams) =>
      [...prevParams, param].sort((a, b) =>
        ('' + a.value).localeCompare(b.value, undefined, { numeric: true })
      )
    );
    setSelectedInitialParameterList((prevSelected) =>
      prevSelected.filter((item) => item.value !== param.value)
    );
  };

  const handleClearAllInitialParams = () => {
    setSelectedInitialParameterList([]);
    setToBeSelectedInitialParamList(parameterList);
  };

  const handleMoveAllInitialParams = () => {
    setSelectedInitialParameterList(parameterList);
    setToBeSelectedInitialParamList([]);
  };

  const handleSelectedGoalParamClicked = (param) => {
    setToBeSelectedGoalFunctionList((prevParams) =>
      [...prevParams, param].sort((a, b) =>
        ('' + a.value).localeCompare(b.value, undefined, { numeric: true })
      )
    );
    setSelectedGoalFunctionList((prevSelected) =>
      prevSelected.filter((item) => item.value !== param.value)
    );
  };

  const handleClearAllGoalParams = () => {
    setSelectedGoalFunctionList([]);
    setToBeSelectedGoalFunctionList(parameterList);
  };

  const handleMoveAllGoalParams = () => {
    setSelectedGoalFunctionList(parameterList);
    setToBeSelectedGoalFunctionList([]);
  };

  const handleCompose = () => {
    handleFindServicesChain();
  };

  const handleFindServicesChain = async () => {
    setNoSolution(false);
    const listInitial = selectedInitialParameterList.map((item) => item.value);
    const listGoal = selectedGoalFunctionList.map((item) => item.value);
    try {
      const response = await fetch(
        'http://localhost:8000/api/find-parts-chain/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            initialParameters: listInitial,
            goalParameters: listGoal,
          }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(errorResponse);
      }

      const jsonData = await response.json();
      if (jsonData.paths.length > 0) {
        const groupedList = groupAndStagePaths(jsonData);
        setPartsChainList(jsonData.paths);
        setGroupedPartsChainList(groupedList);
      } else {
        setNoSolution(true);
      }

      const totalCosts = jsonData.paths_with_cost.map((path) => path.totalCost);
      const leastCostPath = jsonData.paths_with_cost.reduce((min, path) =>
        min.totalCost < path.totalCost ? min : path
      );
      setLeastCost(leastCostPath.totalCost);
      setTotalCostsList(totalCosts.sort());

      const avgReps = jsonData.paths_with_rep.map(
        (path) => path.averageReputation
      );
      const highestRepPath = jsonData.paths_with_rep.reduce((max, path) =>
        max.averageReputation > path.averageReputation ? max : path
      );
      setHighestRep(highestRepPath.averageReputation);
      setAvgRepList(avgReps.sort());
    } catch (error) {
      console.error('Error submitting selection: ', error);
      setNoSolution(true);
    }
  };

  const handleFindServicesChainByPrice = async () => {
    setNoSolution(false);
    const listInitial = selectedInitialParameterList.map((item) => item.value);
    const listGoal = selectedGoalFunctionList.map((item) => item.value);
    try {
      const response = await fetch(
        'http://localhost:8000/api/find-parts-chain-by-price/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            initialParameters: listInitial,
            goalParameters: listGoal,
          }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(errorResponse);
      }

      const jsonData = await response.json();
      if (jsonData.paths.length > 0) {
        let groupedList = groupAndStagePaths(jsonData);
        groupedList = sortPartsByCost(groupedList);
        setPartsChainList(jsonData.paths);
        setGroupedPartsChainList(groupedList);
      } else {
        setNoSolution(true);
      }
    } catch (error) {
      console.error('Error submitting selection: ', error);
      setNoSolution(true);
    }
  };

  const handleFindServicesChainByReputation = async () => {
    setNoSolution(false);
    const listInitial = selectedInitialParameterList.map((item) => item.value);
    const listGoal = selectedGoalFunctionList.map((item) => item.value);
    try {
      const response = await fetch(
        'http://localhost:8000/api/find-parts-chain-by-reputation/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            initialParameters: listInitial,
            goalParameters: listGoal,
          }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(errorResponse);
      }

      const jsonData = await response.json();
      if (jsonData.paths.length > 0) {
        let groupedList = groupAndStagePaths(jsonData);
        groupedList = sortPartsByReputation(groupedList);
        setPartsChainList(jsonData.paths);
        setGroupedPartsChainList(groupedList);
      } else {
        setNoSolution(true);
      }
    } catch (error) {
      console.error('Error submitting selection: ', error);
      setNoSolution(true);
    }
  };

  function sortPartsByCost(data) {
    Object.values(data).forEach((groups) => {
      groups.forEach((group) => {
        group.parts.sort((a, b) => a.partCost - b.partCost);
      });
    });
    return data;
  }

  function sortPartsByReputation(data) {
    Object.values(data).forEach((groups) => {
      groups.forEach((group) => {
        group.parts.sort((a, b) => b.partReputation - a.partReputation);
      });
    });
    return data;
  }

  function groupAndStagePaths(data) {
    if (!data || !Array.isArray(data.paths)) {
      throw new Error(
        "Invalid input: data must have a 'paths' array property."
      );
    }

    const grouped = data.paths.reduce((acc, path) => {
      const key = path.parameters.join(',');
      if (!acc[key]) {
        acc[key] = {
          parameters: path.parameters,
          parts: [...path.parts],
          lastParameter: path.parameters[path.parameters.length - 1],
          firstParameter: path.parameters[0],
        };
      } else {
        acc[key].parts.push(...path.parts);
      }
      return acc;
    }, {});

    const groupedArray = Object.values(grouped);
    const stages = {};

    groupedArray.forEach((group) => {
      let stageFound = false;
      for (let stage in stages) {
        stages[stage].some((existingGroup) => {
          if (existingGroup.lastParameter === group.firstParameter) {
            if (!stages[parseInt(stage) + 1]) stages[parseInt(stage) + 1] = [];
            stages[parseInt(stage) + 1].push(group);
            stageFound = true;
            return true;
          }
          return false;
        });
      }

      if (!stageFound) {
        if (!stages[0]) stages[0] = [];
        stages[0].push(group);
      }
    });

    return stages;
  }

  return (
    <main className='mt-2'>
      <h1 className='text-3xl font-semibold text-white pb-4'>
        Interactive Configuration Tool
      </h1>
      <Card className='relative bg-white shadow-lg sm:rounded-3xl p-6 bg-clip-padding bg-opacity-80 border border-gray-100'>
        <CardHeader>
          <CardTitle className='text-2xl border-b border-purple-900'>
            Select Interface Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className='flex gap-3'>
          <div className='w-1/2'>
            <div className='flex justify-between border-b border-purple-800 mb-2 items-end'>
              <h3 className='font-medium'>Parameter List</h3>
              <h4 className='text-sm'>
                {toBeSelectedInitialParamList.length} items
              </h4>
            </div>
            <div className='h-60 overflow-y-auto text-black rounded bg-purple-50'>
              <h3
                onClick={handleMoveAllInitialParams}
                className='bg-purple-100 border-b border-b-purple-300 hover:bg-white hover:font-medium hover:text-green-900 h-8 flex justify-center items-center cursor-pointer px-2'
              >
                Move all &rArr;
              </h3>
              {toBeSelectedInitialParamList.map((param, idx) => (
                <div
                  className='bg-purple-100 hover:bg-purple-50 hover:font-medium hover:text-green-700 h-8 flex items-center cursor-pointer px-2'
                  key={idx}
                  onClick={() => handleInputParamClicked(param)}
                >
                  {param.label}
                </div>
              ))}
            </div>
          </div>
          <div className='w-1/2'>
            <div className='flex justify-between border-b border-purple-800 mb-2 items-end'>
              <h3 className='font-medium'>Initial Parameters</h3>
              <h4 className='text-sm'>
                {selectedInitialParameterList.length} items
              </h4>
            </div>
            <div className='h-60 overflow-y-auto text-black rounded bg-purple-50'>
              <h3
                onClick={handleClearAllInitialParams}
                className='bg-purple-100 border-b border-b-purple-300 hover:bg-white hover:font-medium hover:text-red-800 h-8 flex justify-center items-center cursor-pointer px-2'
              >
                &lArr; Clear all
              </h3>
              {selectedInitialParameterList.map((param, idx) => (
                <div
                  className='bg-purple-100 hover:bg-purple-50 hover:font-medium hover:text-red-500 h-8 flex items-center cursor-pointer px-2'
                  key={idx}
                  onClick={() => handleSelectedInputParamClicked(param)}
                >
                  {param.label}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardContent className='flex gap-3'>
          <div className='w-1/2'>
            <div className='flex justify-between border-b border-purple-800 mb-2 items-end'>
              <h3 className='font-medium'>Goal List</h3>
              <h4 className='text-sm'>
                {toBeSelectedGoalFunctionList.length} items
              </h4>
            </div>
            <div className='h-60 overflow-y-auto text-black rounded bg-purple-50'>
              <h3
                onClick={handleMoveAllGoalParams}
                className='bg-purple-100 border-b border-b-purple-300 hover:bg-white hover:font-medium hover:text-green-900 h-8 flex justify-center items-center cursor-pointer px-2'
              >
                Move all &rArr;
              </h3>
              {toBeSelectedGoalFunctionList.map((param, idx) => (
                <div
                  className='bg-purple-100 hover:bg-purple-50 hover:font-medium hover:text-green-700 h-8 flex items-center cursor-pointer px-2'
                  key={idx}
                  onClick={() => handleGoalParamClicked(param)}
                >
                  {param.label}
                </div>
              ))}
            </div>
          </div>
          <div className='w-1/2'>
            <div className='flex justify-between border-b border-purple-800 mb-2 items-end'>
              <h3 className='font-medium'>Goal Functions</h3>
              <h4 className='text-sm'>
                {selectedGoalFunctionList.length} items
              </h4>
            </div>
            <div className='h-60 overflow-y-auto text-black rounded bg-purple-50'>
              <h3
                onClick={handleClearAllGoalParams}
                className='bg-purple-100 border-b border-b-purple-300 hover:bg-white hover:font-medium hover:text-red-900 h-8 flex justify-center items-center cursor-pointer px-2'
              >
                &lArr; Clear all
              </h3>
              {selectedGoalFunctionList.map((param, idx) => (
                <div
                  className='bg-purple-100 hover:bg-purple-50 hover:font-medium hover:text-red-500 h-8 flex items-center cursor-pointer px-2'
                  key={idx}
                  onClick={() => handleSelectedGoalParamClicked(param)}
                >
                  {param.label}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardContent>
          <div className='w-full flex gap-6'>
            <Button
              variant='outline'
              className='w-80 disabled:bg-opacity-20 text-md'
              onClick={handleCompose}
              disabled={submitDisabled}
            >
              Configure Systems
            </Button>
          </div>
        </CardContent>
      </Card>
      {noSolution ? (
        <Alert className='mt-6 bg-red-50'>
          <AlertTitle>Solution Not Found</AlertTitle>
          <AlertDescription>
            We are not able to find any solution for this input and goal
            parameter.
          </AlertDescription>
        </Alert>
      ) : (
        <PartsDisplay
          groupedPartsChainList={groupedPartsChainList}
          parameterList={parameterList}
          totalCostsList={totalCostsList}
          avgRepList={avgRepList}
        />
      )}
    </main>
  );
}
