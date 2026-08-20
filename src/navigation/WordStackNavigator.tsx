import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WordStackParamList } from '../types/navigation.types';
import { WordListScreen } from '../screens/words/WordListScreen';
import { WordDetailScreen } from '../screens/words/WordDetailScreen';
import { CreateWordScreen } from '../screens/words/CreateWordScreen';
import { EditWordScreen } from '../screens/words/EditWordScreen';

const Stack = createNativeStackNavigator<WordStackParamList>();

export const WordStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="WordList"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="WordList" component={WordListScreen} />
      <Stack.Screen name="WordDetail" component={WordDetailScreen} />
      <Stack.Screen name="CreateWord" component={CreateWordScreen} />
      <Stack.Screen name="EditWord" component={EditWordScreen} />
    </Stack.Navigator>
  );
};
