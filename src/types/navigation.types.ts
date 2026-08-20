import { NavigatorScreenParams } from '@react-navigation/native';
import { Word } from './word.types';
import { LearningSessionSummary } from './learning.types';
import { Evaluation, EvaluationSetupOptions } from './evaluation.types';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: { email?: string } | undefined;
  ConfirmSignUp: { email: string };
};

export type WordStackParamList = {
  WordList: undefined;
  WordDetail: { wordId: string };
  CreateWord: undefined;
  EditWord: { word: Word };
};

export type LearningStackParamList = {
  LearningSession: { category?: string; difficulty?: string } | undefined;
  LearningSummary: { summary: LearningSessionSummary };
};

export type EvaluationStackParamList = {
  EvaluationSetup: undefined;
  EvaluationQuiz: { options: EvaluationSetupOptions };
  EvaluationResult: { evaluation: Evaluation };
  EvaluationHistory: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  WordsTab: NavigatorScreenParams<WordStackParamList>;
  LearnTab: NavigatorScreenParams<LearningStackParamList>;
  EvaluationTab: NavigatorScreenParams<EvaluationStackParamList>;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};
