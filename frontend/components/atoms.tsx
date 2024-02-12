import { atom } from 'jotai';

type StrategyChoices = ['dp', 'bf', 'cp'];

export const strategyChoiceAtom = atom<StrategyChoices[number]>('dp');
