import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageService = {
  async getItem<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return JSON.parse(value) as T;
      }
      return defaultValue;
    } catch (error) {
      console.warn(`[storageService] Failed to get item for key "${key}":`, error);
      return defaultValue;
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`[storageService] Failed to set item for key "${key}":`, error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.warn(`[storageService] Failed to remove item for key "${key}":`, error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.warn('[storageService] Failed to clear storage:', error);
    }
  },
};
