import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EvaluationStackParamList } from '../types/navigation.types';
import { EvaluationSetupScreen } from '../screens/evaluation/EvaluationSetupScreen';
import { EvaluationQuizScreen } from '../screens/evaluation/EvaluationQuizScreen';
import { EvaluationResultScreen } from '../screens/evaluation/EvaluationResultScreen';
import { EvaluationHistoryScreen } from '../screens/evaluation/EvaluationHistoryScreen';

const Stack = createNativeStackNavigator<EvaluationStackParamList>();

export const EvaluationStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="EvaluationSetup"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="EvaluationSetup" component={EvaluationSetupScreen} />
      <Stack.Screen name="EvaluationQuiz" component={EvaluationQuizScreen} />
      <Stack.Screen name="EvaluationResult" component={EvaluationResultScreen} />
      <Stack.Screen name="EvaluationHistory" component={EvaluationHistoryScreen} />
    </Stack.Navigator>
  );
};
