import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { MainTabParamList } from '../types/navigation.types';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { WordStackNavigator } from './WordStackNavigator';
import { LearningStackNavigator } from './LearningStackNavigator';
import { EvaluationStackNavigator } from './EvaluationStackNavigator';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const getTabIcon = (routeName: string, focused: boolean) => {
  let icon = '📖';
  switch (routeName) {
    case 'Home':
      icon = focused ? '🏠' : '🏡';
      break;
    case 'WordsTab':
      icon = focused ? '📚' : '📖';
      break;
    case 'LearnTab':
      icon = focused ? '🧠' : '💡';
      break;
    case 'EvaluationTab':
      icon = focused ? '🎯' : '📝';
      break;
    case 'Profile':
      icon = focused ? '👤' : '👥';
      break;
  }
  return <Text style={{ fontSize: 20 }}>{icon}</Text>;
};

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => getTabIcon(route.name, focused),
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen
        name="WordsTab"
        component={WordStackNavigator}
        options={{ tabBarLabel: 'Words' }}
      />
      <Tab.Screen
        name="LearnTab"
        component={LearningStackNavigator}
        options={{ tabBarLabel: 'Learn' }}
      />
      <Tab.Screen
        name="EvaluationTab"
        component={EvaluationStackNavigator}
        options={{ tabBarLabel: 'Evaluation' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};
