import { generateEvaluationQuestions } from '../utils/evaluationAlgorithm';
import { Word } from '../types/word.types';

describe('Evaluation Question Generator', () => {
  const words: Word[] = [
    {
      id: '1',
      word: 'Ephemeral',
      meaning: 'Short-lived',
      example: '',
      category: 'Academic',
      difficulty: 'Hard',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
    {
      id: '2',
      word: 'Eloquent',
      meaning: 'Fluent speaker',
      example: '',
      category: 'Literature',
      difficulty: 'Medium',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
    {
      id: '3',
      word: 'Resilient',
      meaning: 'Quick to recover',
      example: '',
      category: 'General',
      difficulty: 'Easy',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
    {
      id: '4',
      word: 'Pragmatic',
      meaning: 'Practical approach',
      example: '',
      category: 'Business',
      difficulty: 'Medium',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
  ];

  it('should generate requested number of questions', () => {
    const questions = generateEvaluationQuestions(words, {
      questionCount: 3,
      difficulty: 'ALL',
      category: 'ALL',
    });

    expect(questions.length).toBe(3);
  });

  it('should include correct answer in option choices', () => {
    const questions = generateEvaluationQuestions(words, {
      questionCount: 4,
      difficulty: 'ALL',
      category: 'ALL',
    });

    questions.forEach(q => {
      expect(q.options).toContain(q.correctAnswer);
      expect(q.options.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('should generate balanced question types (Word->Meaning and Meaning->Word)', () => {
    const questions = generateEvaluationQuestions(words, {
      questionCount: 4,
      difficulty: 'ALL',
      category: 'ALL',
    });

    const hasWordToMeaning = questions.some(q => q.questionType === 'WORD_TO_MEANING');
    const hasMeaningToWord = questions.some(q => q.questionType === 'MEANING_TO_WORD');

    expect(hasWordToMeaning).toBe(true);
    expect(hasMeaningToWord).toBe(true);
  });
});
