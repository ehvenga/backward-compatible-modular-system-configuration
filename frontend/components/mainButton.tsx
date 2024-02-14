'use client';

import { strategyChoiceAtom } from '@/components/atoms';
import { useAtom } from 'jotai';
import { StrategyChoices } from '@/components/atoms';

const MainButton = ({
  buttonName,
  value,
  selected,
}: {
  buttonName: string;
  value: StrategyChoices;
  selected: boolean;
}) => {
  const [strategyChoice, setStrategyChoice] = useAtom(strategyChoiceAtom);

  const handleChangeStrategyChoice = () => {
    setStrategyChoice(value);
  };

  return (
    <button
      onClick={handleChangeStrategyChoice}
      className={`${
        selected ? 'bg-black' : 'bg-gray-500'
      } text-yellow-50 hover:text-yellow-100 border border-black p-2 w-64 rounded-md hover:ring-2 hover:ring-gray-500 hover:ring-offset-4 hover:ring-offset-gray-200`}
    >
      {buttonName}
    </button>
  );
};

export default MainButton;
