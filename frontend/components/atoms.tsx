import { atom } from 'jotai';

export type StrategyChoices = 'dp' | 'bf' | 'cp';

export const strategyChoiceAtom = atom<StrategyChoices>('dp');
