'use client';

import MainButton from '@/components/mainButton';
import { strategyChoiceAtom } from '@/components/atoms';
import { useAtom } from 'jotai';
import { StrategyChoices } from '@/components/atoms';
import DesignConfig from '@/components/designConfig';

export function Home() {
  const [strategyChoice, setStrategyChoice] = useAtom(strategyChoiceAtom);
  return (
    <main className='flex w-full flex-wrap'>
      <div className='flex flex-col w-full justify-center'>
        <p className='w-full flex justify-center text-lg pb-3'>
          Choose Strategy
        </p>
        <div className='w-full flex justify-center gap-x-10'>
          <MainButton
            buttonName='Dynamic Programming'
            value='dp'
            selected={strategyChoice === 'dp' && true}
          />
          <MainButton
            buttonName='Brute Force'
            value='bf'
            selected={strategyChoice === 'bf' && true}
          />
          <MainButton
            buttonName='Compare'
            value='cp'
            selected={strategyChoice === 'cp' && true}
          />
        </div>
      </div>
      <DesignConfig />
    </main>
  );
}

export default Home;
