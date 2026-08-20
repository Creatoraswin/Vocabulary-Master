import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './theme';
import { AuthProvider } from './hooks/useAuth';
import { AppNavigator } from './navigation/AppNavigator';
import { configureAmplify } from './services/amplifyConfig';

// Initialize AWS Amplify
configureAmplify();

export const App: React.FC = () => {
  useEffect(() => {
    // Application bootstrap
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
