import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

const SafeContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const KeyboardContainer = styled(KeyboardAvoidingView)`
  flex: 1;
`;

const ContentContainer = styled.View`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
  testID,
}) => {
  return (
    <SafeContainer testID={testID}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <KeyboardContainer behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scrollable ? (
          <ScrollView
            style={[{ flex: 1 }, style]}
            contentContainerStyle={[
              { padding: 16, paddingBottom: 32, flexGrow: 1 },
              contentContainerStyle,
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <ContentContainer style={[style, contentContainerStyle]}>
            {children}
          </ContentContainer>
        )}
      </KeyboardContainer>
    </SafeContainer>
  );
};
