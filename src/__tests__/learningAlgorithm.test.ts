import { selectWordsForSession } from '../utils/learningAlgorithm';
import { Word } from '../types/word.types';
import { LearningProgress } from '../types/learning.types';

describe('Learning Spaced-Repetition Algorithm', () => {
  const words: Word[] = [
    {
      id: 'w1',
      word: 'Word1',
      meaning: 'Meaning1',
      example: '',
      category: 'General',
      difficulty: 'Easy',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
    {
      id: 'w2',
      word: 'Word2',
      meaning: 'Meaning2',
      example: '',
      category: 'Technology',
      difficulty: 'Medium',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
    {
      id: 'w3',
      word: 'Word3',
      meaning: 'Meaning3',
      example: '',
      category: 'Academic',
      difficulty: 'Hard',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
    {
      id: 'w4',
      word: 'Word4',
      meaning: 'Meaning4',
      example: '',
      category: 'General',
      difficulty: 'Easy',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    },
  ];

  const progress: LearningProgress[] = [
    {
      id: 'lp1',
      userId: 'u1',
      wordId: 'w2',
      status: 'REVIEW',
      attempts: 2,
      correctCount: 0,
      incorrectCount: 2,
      lastReviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'lp2',
      userId: 'u1',
      wordId: 'w3',
      status: 'REMEMBERED',
      attempts: 3,
      correctCount: 3,
      incorrectCount: 0,
      lastReviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  it('should prioritize words with REVIEW status first', () => {
    const selected = selectWordsForSession(words, progress, 10);
    expect(selected.length).toBe(4);
    // w2 has REVIEW status so it should be first in the session
    expect(selected[0].id).toBe('w2');
  });

  it('should filter words by category when specified', () => {
    const selected = selectWordsForSession(words, progress, 10, 'General');
    expect(selected.length).toBe(2);
    expect(selected.every(w => w.category === 'General')).toBe(true);
  });

  it('should filter words by difficulty when specified', () => {
    const selected = selectWordsForSession(words, progress, 10, undefined, 'Hard');
    expect(selected.length).toBe(1);
    expect(selected[0].difficulty).toBe('Hard');
  });

  it('should respect maximum session size', () => {
    const selected = selectWordsForSession(words, progress, 2);
    expect(selected.length).toBe(2);
  });
});
