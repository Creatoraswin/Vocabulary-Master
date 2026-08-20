import { Word } from '../types/word.types';
import { LearningProgress, LearningSessionWord } from '../types/learning.types';

/**
 * Selects words for a learning session using deterministic spaced-repetition prioritization:
 * 1. Words marked REVIEW
 * 2. Words not recently reviewed (ordered by lastReviewedAt ascending)
 * 3. NEW words (no progress recorded yet or status is NEW)
 * 4. REMEMBERED words (less frequently)
 */
export const selectWordsForSession = (
  allWords: Word[],
  progressList: LearningProgress[],
  sessionSize: number = 10,
  filterCategory?: string,
  filterDifficulty?: string
): LearningSessionWord[] => {
  // Apply category/difficulty filters if specified
  let availableWords = [...allWords];
  if (filterCategory && filterCategory !== 'ALL') {
    availableWords = availableWords.filter(w => w.category === filterCategory);
  }
  if (filterDifficulty && filterDifficulty !== 'ALL') {
    availableWords = availableWords.filter(w => w.difficulty === filterDifficulty);
  }

  if (availableWords.length === 0) {
    return [];
  }

  // Create progress lookup map
  const progressMap = new Map<string, LearningProgress>();
  progressList.forEach(p => progressMap.set(p.wordId, p));

  // Partition words into buckets
  const reviewWords: LearningSessionWord[] = [];
  const notRecentlyReviewedWords: LearningSessionWord[] = [];
  const newWords: LearningSessionWord[] = [];
  const rememberedWords: LearningSessionWord[] = [];

  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  availableWords.forEach(word => {
    const progress = progressMap.get(word.id);
    const sessionWord: LearningSessionWord = {
      ...word,
      progress,
      sessionStatus: 'unseen',
    };

    if (!progress || progress.status === 'NEW') {
      newWords.push(sessionWord);
    } else if (progress.status === 'REVIEW') {
      reviewWords.push(sessionWord);
    } else if (progress.status === 'LEARNING') {
      const lastReviewedTime = new Date(progress.lastReviewedAt).getTime();
      if (now - lastReviewedTime > ONE_DAY_MS) {
        notRecentlyReviewedWords.push(sessionWord);
      } else {
        reviewWords.push(sessionWord);
      }
    } else if (progress.status === 'REMEMBERED') {
      const lastReviewedTime = new Date(progress.lastReviewedAt).getTime();
      // If remembered word has not been reviewed in more than 3 days, consider for review
      if (now - lastReviewedTime > 3 * ONE_DAY_MS) {
        notRecentlyReviewedWords.push(sessionWord);
      } else {
        rememberedWords.push(sessionWord);
      }
    }
  });

  // Sort not recently reviewed words by lastReviewedAt ascending (oldest first)
  notRecentlyReviewedWords.sort((a, b) => {
    const timeA = a.progress ? new Date(a.progress.lastReviewedAt).getTime() : 0;
    const timeB = b.progress ? new Date(b.progress.lastReviewedAt).getTime() : 0;
    return timeA - timeB;
  });

  // Assemble the session pool in order of priority:
  // 1. Review Words -> 2. Not Recently Reviewed -> 3. New Words -> 4. Remembered Words
  const combinedPool: LearningSessionWord[] = [
    ...reviewWords,
    ...notRecentlyReviewedWords,
    ...newWords,
    ...rememberedWords,
  ];

  // Return up to sessionSize
  return combinedPool.slice(0, sessionSize);
};
