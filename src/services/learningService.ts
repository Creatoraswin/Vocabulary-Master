import { apiService } from './apiService';
import { LearningProgress, SaveLearningProgressInput } from '../types/learning.types';
import { getUserProgress } from '../graphql/queries';
import { saveLearningProgress } from '../graphql/mutations';

export const learningService = {
  async getLearningProgress(userId: string): Promise<LearningProgress[]> {
    try {
      const data = await apiService.executeGraphQL<{ getUserProgress: LearningProgress[] }>(
        getUserProgress,
        { userId }
      );
      if (data?.getUserProgress) {
        return data.getUserProgress;
      }
    } catch {
      // Fallback
    }
    return apiService.getUserLearningProgress(userId);
  },

  async saveLearningProgress(
    userId: string,
    input: SaveLearningProgressInput
  ): Promise<LearningProgress> {
    try {
      const data = await apiService.executeGraphQL<{
        saveLearningProgress: LearningProgress;
      }>(saveLearningProgress, { input });
      if (data?.saveLearningProgress) {
        return data.saveLearningProgress;
      }
    } catch {
      // Fallback
    }
    return apiService.saveLearningProgress(userId, input);
  },
};
