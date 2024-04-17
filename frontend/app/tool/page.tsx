'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useEffect, useState } from 'react';

export default function ToolPage() {
  const [parameterList, setParameterList] = useState([]);
  const [toBeSelectedInitialParamList, setToBeSelectedInitialParamList] =
    useState([]);
  const [selectedInitialParameterList, setSelectedInitialParameterList] =
    useState([]);
  const [toBeSelectedGoalParamList, setToBeSelectedGoalParamList] = useState(
    []
  );
  const [selectedGoalParameterList, setSelectedGoalParameterList] = useState(
    []
  );
  const [partsChainList, setPartsChainList] = useState([]);
  const [noSolution, setNoSolution] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const [showPartsOptions, setShowPartsOptions] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    selectedInitialParameterList.length > 0 &&
    selectedGoalParameterList.length > 0
      ? setSubmitDisabled(false)
      : setSubmitDisabled(true);
  }, [selectedInitialParameterList, selectedGoalParameterList]);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/parameters/');
      const jsonData = await response.json();
      console.log(jsonData);
      let convertedList = jsonData.map((item) => ({
        value: item.parameterid,
        label: item.parametername,
      }));
      convertedList = convertedList
        .reduce(
          (acc, item) =>
            // @ts-ignore
            acc.some((e) => e.value === item.value) ? acc : [...acc, item],
          []
        )
        .sort((a, b) =>
          // @ts-ignore
          ('' + a.value).localeCompare(b.value, undefined, { numeric: true })
        );
      setParameterList(convertedList);
      setToBeSelectedInitialParamList(convertedList);
      setToBeSelectedGoalParamList(convertedList);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const handleInputParamClicked = (param) => {
    // Add the clicked parameter to the selectedInitialParameterList
    setSelectedInitialParameterList((prevSelected) => [...prevSelected, param]);

    // Remove the clicked parameter from the toBeSelectedInitialParamList
    setToBeSelectedInitialParamList((prevParams) =>
      prevParams.filter((item) => item.value !== param.value)
    );
  };

  const handleGoalParamClicked = (param) => {
    // Add the clicked parameter to the selectedInitialParameterList
    setSelectedGoalParameterList((prevSelected) => [...prevSelected, param]);

    // Remove the clicked parameter from the toBeSelectedInitialParamList
    setToBeSelectedGoalParamList((prevParams) =>
      prevParams.filter((item) => item.value !== param.value)
    );
  };

  const handleSelectedInputParamClicked = (param) => {
    // Add the clicked parameter back to the toBeSelectedInitialParamList
    setToBeSelectedInitialParamList((prevParams) =>
      [...prevParams, param].sort((a, b) =>
        ('' + a.value).localeCompare(b.value, undefined, { numeric: true })
      )
    );

    // Remove the clicked parameter from the selectedInitialParameterList
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
    // Add the clicked parameter back to the toBeSelectedInitialParamList
    setToBeSelectedGoalParamList((prevParams) =>
      [...prevParams, param].sort((a, b) =>
        ('' + a.value).localeCompare(b.value, undefined, { numeric: true })
      )
    );

    // Remove the clicked parameter from the selectedInitialParameterList
    setSelectedGoalParameterList((prevSelected) =>
      prevSelected.filter((item) => item.value !== param.value)
    );
  };

  const handleClearAllGoalParams = () => {
    setSelectedGoalParameterList([]);
    setToBeSelectedGoalParamList(parameterList);
  };

  const handleMoveAllGoalParams = () => {
    setSelectedGoalParameterList(parameterList);
    setToBeSelectedGoalParamList([]);
  };

  const handleCompose = () => {
    handleFindServicesChain();
  };

  const handleFindServicesChain = async () => {
    // setPartsChain([]);
    setNoSolution(false);
    const listInitial = selectedInitialParameterList.map((item) => item.value);
    const listGoal = selectedGoalParameterList.map((item) => item.value);
    try {
      const response = await fetch(
        'http://localhost:8000/api/find-webchains-v3/',
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
        const errorResponse = await response.text(); // Get the response text
        throw new Error(errorResponse);
      }

      const jsonData = await response.json();
      // console.log('Submission response: ', jsonData.webServiceChains);
      // const newArrays = getRandomSubsets(jsonData.stages, 20);
      if (jsonData.stages[0].length > 0) {
        setPartsChainList(jsonData.stages);
      } else {
        setNoSolution(true);
      }
      // setPartsChain(jsonData.webServiceChain);
    } catch (error) {
      console.error('Error submitting selection: ', error);
      setNoSolution(true);
    }
  };

  const handleChooseService = (parts, item) => {
    console.log(parts, item);
    // setShowPartsOptions(true);
  };

  class SeededRandom {
    constructor(seed) {
      this.seed = seed;
    }

    random() {
      // Linear congruential generator parameters
      const a = 1664525;
      const c = 1013904223;
      const m = 2 ** 32;

      // Update the seed and return a normalized value
      this.seed = (a * this.seed + c) % m;
      return this.seed / m;
    }
  }

  // Function to shuffle an array using the seeded random generator
  const shuffleArray = (array, rng) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const getRandomSubsets = (arrays, seed) => {
    const rng = new SeededRandom(seed);

    return arrays.map((arr) => {
      // Determine the new subset size, ranging from 1 to arr.length
      const newSize = Math.floor(rng.random() * arr.length) + 1;

      // Shuffle the array and select the first newSize elements
      const shuffled = shuffleArray(arr, rng);
      return shuffled.slice(0, newSize);
    });
  };

  let productCounter = 0;

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
                // @ts-ignore
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
                // @ts-ignore
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
              <h3 className='font-medium'>Parameter List</h3>
              <h4 className='text-sm'>
                {toBeSelectedGoalParamList.length} items
              </h4>
            </div>
            <div className='h-60 overflow-y-auto text-black rounded bg-purple-50'>
              <h3
                onClick={handleMoveAllGoalParams}
                className='bg-purple-100 border-b border-b-purple-300 hover:bg-white hover:font-medium hover:text-green-900 h-8 flex justify-center items-center cursor-pointer px-2'
              >
                Move all &rArr;
              </h3>
              {toBeSelectedGoalParamList.map((param, idx) => (
                // @ts-ignore
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
              <h3 className='font-medium'>Goal Parameters</h3>
              <h4 className='text-sm'>
                {selectedGoalParameterList.length} items
              </h4>
            </div>
            <div className='h-60 overflow-y-auto text-black rounded bg-purple-50'>
              <h3
                onClick={handleClearAllGoalParams}
                className='bg-purple-100 border-b border-b-purple-300 hover:bg-white hover:font-medium hover:text-red-900 h-8 flex justify-center items-center cursor-pointer px-2'
              >
                &lArr; Clear all
              </h3>
              {selectedGoalParameterList.map((param, idx) => (
                // @ts-ignore
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
              className='w-60 disabled:bg-opacity-20 text-md'
              onClick={handleCompose}
              disabled={submitDisabled}
            >
              Compose
            </Button>
          </div>
        </CardContent>
      </Card>

      {noSolution ? (
        <>
          <Alert className=' mt-6 bg-red-50'>
            <AlertTitle className=''>Solution Not Found</AlertTitle>
            <AlertDescription>
              We are not able to find any solution for this input and goal
              parameter
            </AlertDescription>
          </Alert>
        </>
      ) : (
        <div>
          {partsChainList?.length > 0 && (
            <Card className='mt-6 relative bg-white shadow-lg sm:rounded-3xl p-6 bg-clip-padding bg-opacity-80 border border-gray-100'>
              <CardHeader>
                <CardTitle className='pb-2 text-2xl border-b border-slate-400'>
                  Solution
                </CardTitle>
              </CardHeader>

              {/* <CardContent className='flex flex-col'>
              <h2 className='font-medium text-xl w-full'>
                Parameters Solution
              </h2>
            </CardContent> */}

              {partsChainList?.length > 0 && (
                <CardContent className='flex flex-col gap-4 w-full'>
                  <h2 className='font-medium text-xl w-full'>Parts Solution</h2>
                  <div className='flex items-center gap-4 w-full flex-col'>
                    {partsChainList.map((part, index) => (
                      <div
                        className='flex w-full border border-purple-800 p-4 rounded'
                        key={index}
                      >
                        <p className='mr-10 w-40 font-medium my-5'>
                          Stage {index + 1}
                        </p>
                        <div className='flex flex-wrap gap-y-2 gap-x-2 justify-between'>
                          {part.map((item, idx) => {
                            productCounter += 1; // Increment the counter for each product
                            return (
                              <div
                                className='flex items-center justify-center py-3 px-4 border border-purple-600 rounded hover:cursor-pointer hover:bg-purple-100'
                                key={idx}
                                onClick={() =>
                                  handleChooseService(partsChainList, index)
                                }
                              >
                                <div className='flex items-center justify-center flex-col'>
                                  {/* Use the persistent counter for numbering */}
                                  <p className='font-semibold'>
                                    Product {productCounter}
                                  </p>
                                  <p>{item}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )}
        </div>
      )}
    </main>
  );
}
