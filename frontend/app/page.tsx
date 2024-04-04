'use client';

import { useEffect, useState } from 'react';
import Select from 'react-select';
import { Select as Selectcn } from '@/components/ui/select';

import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

export default function Home() {
  const [parameterList, setParameterList] = useState([]);
  const [initialParameters, setInitialParameters] = useState('');
  const [goalParameters, setGoalParameters] = useState('');
  const [parameterChain, setParameterChain] = useState([]);
  const [partsChain, setPartsChain] = useState([]);
  const [noSolution, setNoSolution] = useState(false);
  const [partsOptions, setPartsOptions] = useState([]);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [servicesChain, setServicesChain] = useState([]);
  const [initialParamValuesList, setInitialParamValuesList] = useState([]);
  const [goalParamValuesList, setGoalParamValuesList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    goalParameters.length > 0 && initialParameters.length > 0
      ? setSubmitDisabled(false)
      : setSubmitDisabled(true);
  }, [goalParameters, initialParameters]);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/parameters/');
      const jsonData = await response.json();
      const convertedList = jsonData.map((item) => ({
        value: item.parameterid,
        label: item.parametername,
      }));
      setParameterList(convertedList);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const submitSelection = () => {
    // setPartsChain([]);
    // handleFindParameterChain();
    handleFindPartsChain();
    // handleFindServicesChain();
  };

  const handleFindParameterChain = async () => {
    setParameterChain([]);
    setNoSolution(false);
    try {
      const response = await fetch(
        'http://localhost:8000/api/generate-parameters/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            initialParameters,
            goalParameters,
          }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.text(); // Get the response text
        throw new Error(errorResponse);
      }

      const jsonData = await response.json();
      console.log('Submission response: ', jsonData.parameterChain);
      setParameterChain(jsonData.parameterChain);
    } catch (error) {
      console.error('Error submitting selection: ', error);
      if (
        error.message.includes('No path found from initial to goal parameter.')
      ) {
        console.log(
          'Specific Error: No path found from initial to goal parameter.'
        );
        setNoSolution(true);
      }
    }
  };

  const handleFindPartsChain = async () => {
    setServicesChain([]);
    // setNoSolution(false);
    const initialParam = initialParamValuesList[0];
    const goalParam = goalParamValuesList[0];
    try {
      const response = await fetch(
        'http://localhost:8000/api/find-webservices/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            initialParameter: initialParam,
            goalParameter: goalParam,
          }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.text(); // Get the response text
        throw new Error(errorResponse);
      }

      const jsonData = await response.json();
      console.log('Submission response: ', jsonData.webServiceChain);
      setPartsChain(jsonData.webServiceChain);
    } catch (error) {
      console.error('Error submitting selection: ', error);
      // if (
      //   error.message.includes('No path found from initial to goal parameter.')
      // ) {
      //   console.log(
      //     'Specific Error: No path found from initial to goal parameter.'
      //   );
      //   setNoSolution(true);
      // }
    }
  };

  const handleFindServicesChain = async () => {
    // setPartsChain([]);
    // setNoSolution(false);
    try {
      const response = await fetch(
        'http://localhost:8000/api/find-webservices-paths/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            initialParameters: initialParamValuesList,
            goalParameters: goalParamValuesList,
          }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.text(); // Get the response text
        throw new Error(errorResponse);
      }

      const jsonData = await response.json();
      console.log('Submission response: ', jsonData.webServiceChain);
      // setPartsChain(jsonData.webServiceChain);
    } catch (error) {
      console.error('Error submitting selection: ', error);
      // if (
      //   error.message.includes('No path found from initial to goal parameter.')
      // ) {
      //   console.log(
      //     'Specific Error: No path found from initial to goal parameter.'
      //   );
      //   setNoSolution(true);
      // }
    }
  };

  const handleChangeInputParameters = (selectedOptions) => {
    setInitialParameters(selectedOptions);
    const listInitial = selectedOptions.map((item) => item.value);
    setInitialParamValuesList(listInitial);
  };

  const handleChangeGoalParameters = (selectedOptions) => {
    setGoalParameters(selectedOptions);
    const listGoal = selectedOptions.map((item) => item.value);
    setGoalParamValuesList(listGoal);
  };

  return (
    <main className='mt-2'>
      <h1 className='text-3xl font-semibold text-white pb-4'>
        Interactive Configuration Tool
      </h1>
      <div className='w-full'>
        <Card className='relative bg-white shadow-lg sm:rounded-3xl p-6 bg-clip-padding bg-opacity-80 border border-gray-100'>
          <CardHeader>
            <CardTitle className='text-2xl border-b border-slate-400'>
              Select Interfaces
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-5'>
            <div>
              {/* <p className='mb-0.5'>Select Initial Parameters</p> */}
              <Select
                // defaultValue={[colourOptions[2], colourOptions[3]]}
                isMulti
                name='inputParameter'
                options={parameterList}
                className='basic-multi-select'
                classNamePrefix='select'
                placeholder='Select Input Parameters...'
                onChange={handleChangeInputParameters}
              />
            </div>
            <div>
              {/* <p className='mb-0.5'>Select Goal Parameters</p> */}
              <Select
                // defaultValue={[colourOptions[2], colourOptions[3]]}
                isMulti
                name='inputParameter'
                options={parameterList}
                className='basic-multi-select'
                classNamePrefix='select'
                placeholder='Select Goal Parameters...'
                onChange={handleChangeGoalParameters}
              />
            </div>
            {/* <Select onValueChange={setInitialParameters}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select Initial Parameter' />
              </SelectTrigger>
              <SelectContent>
                {parameterList.map((parameter, index) => (
                  <SelectItem key={index} value={parameter.parameterid}>
                    {parameter.parametername}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setGoalParameters}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select Goal Parameter' />
              </SelectTrigger>
              <SelectContent>
                {parameterList.map((parameter, index) => (
                  <SelectItem key={index} value={parameter.parameterid}>
                    {parameter.parametername}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}

            <div className='w-full flex gap-6'>
              {/* <Button
                variant='outline'
                className='w-60 bg-gray-50'
                onClick={submitSelection}
              >
                + Add Intermediate Parameter
              </Button> */}
              <Button
                variant='outline'
                className='w-60 disabled:bg-opacity-20 text-md'
                onClick={submitSelection}
                disabled={submitDisabled}
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className='mt-6 relative bg-white shadow-lg sm:rounded-3xl p-6 bg-clip-padding bg-opacity-80 border border-gray-100'>
          <CardHeader>
            <CardTitle className='pb-2 text-2xl border-b border-slate-400'>
              Solution
            </CardTitle>
          </CardHeader>
          {parameterChain?.length > 0 && (
            <CardContent className='flex flex-col'>
              <h2 className='font-medium text-xl w-full'>
                Parameters Solution
              </h2>
              <div className='flex gap-4 mt-4 items-center'>
                {parameterChain.map((parameter, index) => (
                  <>
                    {index > 0 && <>-&gt;</>}
                    <p className='p-3 w-20 border text-center rounded'>
                      {parameter}
                    </p>
                  </>
                ))}
              </div>
            </CardContent>
          )}
          {partsChain?.length > 0 && (
            <CardContent className='flex flex-col gap-4 w-full'>
              <h2 className='font-medium text-xl w-full'>Parts Solution</h2>
              <div className='flex items-center gap-4'>
                {partsChain.map((part, index) => (
                  <>
                    {index > 0 && <>-&gt;</>}
                    <Selectcn>
                      <SelectTrigger className='w-60 h-20 flex gap-x-2 justify-center items-center hover:border-2'>
                        <SelectValue placeholder={part} />
                      </SelectTrigger>
                      <SelectContent>
                        {partsOptions.map((options, index) => (
                          <SelectItem key={index} value={options}>
                            {part}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Selectcn>
                  </>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {noSolution && (
        <>
          <Alert className=' mt-6 bg-red-50'>
            <AlertTitle className=''>Solution Not Found</AlertTitle>
            <AlertDescription>
              We are not able to find any solution for this input and goal
              parameter
            </AlertDescription>
          </Alert>
        </>
      )}
    </main>
  );
}
