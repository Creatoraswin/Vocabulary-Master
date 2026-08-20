import { Word } from '../types/word.types';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }
  return { isValid: true };
};

export const validatePasswordMatch = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  return { isValid: true };
};

export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
};

export const validateWordInput = (
  word: string,
  meaning: string,
  category: string,
  difficulty: string,
  existingWords: Word[] = [],
  currentWordId?: string
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!word || word.trim() === '') {
    errors.word = 'Word is required';
  } else {
    const trimmedWord = word.trim().toLowerCase();
    const isDuplicate = existingWords.some(
      w => w.word.toLowerCase() === trimmedWord && w.id !== currentWordId
    );
    if (isDuplicate) {
      errors.word = 'This word already exists in your vocabulary';
    }
  }

  if (!meaning || meaning.trim() === '') {
    errors.meaning = 'Meaning is required';
  }

  if (!category || category.trim() === '') {
    errors.category = 'Please select a category';
  }

  if (!difficulty || difficulty.trim() === '') {
    errors.difficulty = 'Please select a difficulty';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
