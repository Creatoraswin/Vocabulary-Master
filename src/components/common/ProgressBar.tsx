import React from 'react';
import styled from 'styled-components/native';

interface ProgressBarProps {
  progress: number; // 0 to 1
  label?: string;
  showPercentage?: boolean;
  color?: string;
  trackColor?: string;
  height?: number;
}

const Container = styled.View`
  width: 100%;
  margin-vertical: ${({ theme }) => theme.spacing.xs}px;
`;

const LabelRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxs}px;
`;

const LabelText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const PercentageText = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const Track = styled.View<{ height: number; trackColor?: string }>`
  height: ${({ height }) => height}px;
  background-color: ${({ trackColor, theme }) => trackColor || theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  overflow: hidden;
  width: 100%;
`;

const Fill = styled.View<{ progressPercent: number; color?: string }>`
  height: 100%;
  width: ${({ progressPercent }) => progressPercent}%;
  background-color: ${({ color, theme }) => color || theme.colors.primary[500]};
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
`;

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  color,
  trackColor,
  height = 8,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const percentage = Math.round(clampedProgress * 100);

  return (
    <Container
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: percentage }}
    >
      {(label || showPercentage) && (
        <LabelRow>
          {label ? <LabelText>{label}</LabelText> : <ViewPlaceholder />}
          {showPercentage && <PercentageText>{percentage}%</PercentageText>}
        </LabelRow>
      )}
      <Track height={height} trackColor={trackColor}>
        <Fill progressPercent={percentage} color={color} />
      </Track>
    </Container>
  );
};

const ViewPlaceholder = styled.View``;
