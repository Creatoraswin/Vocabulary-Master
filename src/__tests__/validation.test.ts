import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateRequired,
  validateWordInput,
} from '../utils/validation';
import { Word } from '../types/word.types';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com').isValid).toBe(true);
      expect(validateEmail('user.name@domain.co.uk').isValid).toBe(true);
    });

    it('should reject empty or invalid email addresses', () => {
      expect(validateEmail('').isValid).toBe(false);
      expect(validateEmail('invalid-email').isValid).toBe(false);
      expect(validateEmail('user@').isValid).toBe(false);
      expect(validateEmail('@domain.com').isValid).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate passwords of length >= 6', () => {
      expect(validatePassword('123456').isValid).toBe(true);
      expect(validatePassword('securePassword123').isValid).toBe(true);
    });

    it('should reject short or empty passwords', () => {
      expect(validatePassword('').isValid).toBe(false);
      expect(validatePassword('12345').isValid).toBe(false);
    });
  });

  describe('validatePasswordMatch', () => {
    it('should validate matching passwords', () => {
      expect(validatePasswordMatch('password123', 'password123').isValid).toBe(true);
    });

    it('should reject mismatched passwords', () => {
      expect(validatePasswordMatch('password123', 'differentPassword').isValid).toBe(false);
    });
  });

  describe('validateWordInput', () => {
    const existingWords: Word[] = [
      {
        id: '1',
        word: 'Ephemeral',
        meaning: 'Short-lived',
        example: 'Example',
        category: 'Academic',
        difficulty: 'Hard',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    ];

    it('should validate correct word inputs', () => {
      const res = validateWordInput('Eloquent', 'Fluent speaker', 'Literature', 'Medium', existingWords);
      expect(res.isValid).toBe(true);
      expect(Object.keys(res.errors).length).toBe(0);
    });

    it('should reject missing required fields', () => {
      const res = validateWordInput('', '', '', '', existingWords);
      expect(res.isValid).toBe(false);
      expect(res.errors.word).toBeDefined();
      expect(res.errors.meaning).toBeDefined();
      expect(res.errors.category).toBeDefined();
      expect(res.errors.difficulty).toBeDefined();
    });

    it('should reject duplicate words in collection', () => {
      const res = validateWordInput('Ephemeral', 'Another meaning', 'General', 'Easy', existingWords);
      expect(res.isValid).toBe(false);
      expect(res.errors.word).toContain('already exists');
    });

    it('should allow editing an existing word without triggering duplicate error on itself', () => {
      const res = validateWordInput('Ephemeral', 'Updated meaning', 'Academic', 'Hard', existingWords, '1');
      expect(res.isValid).toBe(true);
    });
  });
});
