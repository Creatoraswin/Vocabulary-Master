import { useCallback, useEffect, useMemo, useState } from 'react';
import { wordService } from '../services/wordService';
import { learningService } from '../services/learningService';
import { useAuth } from './useAuth';
import {
  CreateWordInput,
  Difficulty,
  LearningStatus,
  UpdateWordInput,
  Word,
  WordFilters,
} from '../types/word.types';
import { LearningProgress } from '../types/learning.types';

const INITIAL_FILTERS: WordFilters = {
  searchQuery: '',
  category: null,
  difficulty: null,
  status: null,
  sortBy: 'created-desc',
};

const DIFFICULTY_WEIGHT: Record<Difficulty, number> = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

export const useWords = () => {
  const { user } = useAuth();
  const [words, setWords] = useState<Word[]>([]);
  const [learningProgressList, setLearningProgressList] = useState<LearningProgress[]>([]);
  const [filters, setFilters] = useState<WordFilters>(INITIAL_FILTERS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWords = useCallback(async () => {
    try {
      setError(null);
      const [fetchedWords, fetchedProgress] = await Promise.all([
        wordService.getWords(),
        user?.id ? learningService.getLearningProgress(user.id) : Promise.resolve([]),
      ]);
      setWords(fetchedWords);
      setLearningProgressList(fetchedProgress);
    } catch (err: any) {
      console.error('[useWords] Fetch error:', err);
      setError('Failed to load words. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchWords();
  }, [fetchWords]);

  const progressMap = useMemo(() => {
    const map = new Map<string, LearningProgress>();
    learningProgressList.forEach(p => map.set(p.wordId, p));
    return map;
  }, [learningProgressList]);

  const getWordStatus = useCallback(
    (wordId: string): LearningStatus => {
      const progress = progressMap.get(wordId);
      return progress ? progress.status : 'NEW';
    },
    [progressMap]
  );

  const filteredWords = useMemo(() => {
    let result = [...words];

    // Search filter
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.trim().toLowerCase();
      result = result.filter(
        w =>
          w.word.toLowerCase().includes(query) ||
          w.meaning.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.category) {
      result = result.filter(w => w.category === filters.category);
    }

    // Difficulty filter
    if (filters.difficulty) {
      result = result.filter(w => w.difficulty === filters.difficulty);
    }

    // Status filter
    if (filters.status) {
      result = result.filter(w => getWordStatus(w.id) === filters.status);
    }

    // Sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'word-asc':
          return a.word.localeCompare(b.word);
        case 'word-desc':
          return b.word.localeCompare(a.word);
        case 'created-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'difficulty':
          return DIFFICULTY_WEIGHT[a.difficulty] - DIFFICULTY_WEIGHT[b.difficulty];
        case 'created-desc':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [words, filters, getWordStatus]);

  const handleCreateWord = async (input: CreateWordInput): Promise<Word> => {
    setIsLoading(true);
    try {
      const newWord = await wordService.createWord(input);
      setWords(prev => [newWord, ...prev]);
      return newWord;
    } catch (err: any) {
      const msg = err?.message || 'Failed to create word';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateWord = async (input: UpdateWordInput): Promise<Word> => {
    setIsLoading(true);
    try {
      const updatedWord = await wordService.updateWord(input);
      setWords(prev => prev.map(w => (w.id === updatedWord.id ? updatedWord : w)));
      return updatedWord;
    } catch (err: any) {
      const msg = err?.message || 'Failed to update word';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWord = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      await wordService.deleteWord(id);
      setWords(prev => prev.filter(w => w.id !== id));
      setLearningProgressList(prev => prev.filter(p => p.wordId !== id));
    } catch (err: any) {
      const msg = err?.message || 'Failed to delete word';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  return {
    words,
    filteredWords,
    totalCount: words.length,
    filteredCount: filteredWords.length,
    learningProgressList,
    filters,
    setFilters,
    resetFilters,
    isLoading,
    isRefreshing,
    error,
    refresh: handleRefresh,
    createWord: handleCreateWord,
    updateWord: handleUpdateWord,
    deleteWord: handleDeleteWord,
    getWordStatus,
  };
};
