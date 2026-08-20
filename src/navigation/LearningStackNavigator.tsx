import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LearningStackParamList } from '../types/navigation.types';
import { LearningSessionScreen } from '../screens/learning/LearningSessionScreen';
import { LearningSummaryScreen } from '../screens/learning/LearningSummaryScreen';

const Stack = createNativeStackNavigator<LearningStackParamList>();

export const LearningStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="LearningSession"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="LearningSession" component={LearningSessionScreen} />
      <Stack.Screen name="LearningSummary" component={LearningSummaryScreen} />
    </Stack.Navigator>
  );
};
