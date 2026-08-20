import { apiService } from './apiService';
import { Evaluation, CreateEvaluationInput } from '../types/evaluation.types';
import { getEvaluationHistory } from '../graphql/queries';
import { createEvaluation } from '../graphql/mutations';

export const evaluationService = {
  async getEvaluationHistory(userId: string): Promise<Evaluation[]> {
    try {
      const data = await apiService.executeGraphQL<{
        getEvaluationHistory: Evaluation[];
      }>(getEvaluationHistory, { userId });
      if (data?.getEvaluationHistory) {
        return data.getEvaluationHistory;
      }
    } catch {
      // Fallback
    }
    return apiService.getEvaluationHistory(userId);
  },

  async createEvaluation(userId: string, input: CreateEvaluationInput): Promise<Evaluation> {
    try {
      const data = await apiService.executeGraphQL<{
        createEvaluation: Evaluation;
      }>(createEvaluation, { input });
      if (data?.createEvaluation) {
        return data.createEvaluation;
      }
    } catch {
      // Fallback
    }
    return apiService.createEvaluation(userId, input);
  },
};
