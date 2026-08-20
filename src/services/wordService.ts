import { apiService } from './apiService';
import { Word, CreateWordInput, UpdateWordInput } from '../types/word.types';
import { listWords, getWord } from '../graphql/queries';
import { createWord, updateWord, deleteWord } from '../graphql/mutations';

const normalizeWord = (raw: any): Word => ({
  id: raw.id,
  word: raw.word || '',
  meaning: raw.meaning || '',
  example: raw.example || '',
  category: raw.category || 'General',
  difficulty: raw.difficulty || 'Medium',
  createdAt: raw.createdAt || new Date().toISOString(),
  updatedAt: raw.updatedAt || new Date().toISOString(),
});

export const wordService = {
  async getWords(): Promise<Word[]> {
    try {
      // Try AppSync GraphQL first
      const data = await apiService.executeGraphQL<{ listWords: { items: any[] } }>(listWords);
      if (data?.listWords?.items && data.listWords.items.length > 0) {
        return data.listWords.items.map(normalizeWord);
      }
    } catch {
      // Handled by local DynamoDB engine in apiService
    }
    const local = await apiService.listWords();
    return local.map(normalizeWord);
  },

  async getWordById(id: string): Promise<Word | null> {
    try {
      const data = await apiService.executeGraphQL<{ getWord: any }>(getWord, { id });
      if (data?.getWord) {
        return normalizeWord(data.getWord);
      }
    } catch {
      // Fallback to local DynamoDB
    }
    const word = await apiService.getWord(id);
    return word ? normalizeWord(word) : null;
  },

  async createWord(input: CreateWordInput): Promise<Word> {
    try {
      const data = await apiService.executeGraphQL<{ createWord: any }>(createWord, {
        input: {
          word: input.word,
          meaning: input.meaning,
          example: input.example,
        },
      });
      if (data?.createWord) {
        return normalizeWord({ ...data.createWord, category: input.category, difficulty: input.difficulty });
      }
    } catch {
      // Fallback to local DynamoDB
    }
    return apiService.createWord(input);
  },

  async updateWord(input: UpdateWordInput): Promise<Word> {
    try {
      const data = await apiService.executeGraphQL<{ updateWord: any }>(updateWord, {
        input: {
          id: input.id,
          word: input.word,
          meaning: input.meaning,
          example: input.example,
        },
      });
      if (data?.updateWord) {
        return normalizeWord({ ...data.updateWord, category: input.category, difficulty: input.difficulty });
      }
    } catch {
      // Fallback to local DynamoDB
    }
    return apiService.updateWord(input);
  },

  async deleteWord(id: string): Promise<{ id: string }> {
    try {
      const data = await apiService.executeGraphQL<{ deleteWord: { id: string } }>(deleteWord, {
        input: { id },
      });
      if (data?.deleteWord) {
        return data.deleteWord;
      }
    } catch {
      // Fallback to local DynamoDB
    }
    return apiService.deleteWord(id);
  },
};
