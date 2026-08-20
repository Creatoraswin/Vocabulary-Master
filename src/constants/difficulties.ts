import { Difficulty } from '../types/word.types';

export const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export const DIFFICULTY_CONFIG = {
  Easy: {
    label: 'Easy',
    color: '#10B981',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  Medium: {
    label: 'Medium',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  Hard: {
    label: 'Hard',
    color: '#EF4444',
    bgColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
};
