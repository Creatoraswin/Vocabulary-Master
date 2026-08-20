import React from 'react';
import styled from 'styled-components/native';

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  count?: number;
}

const ChipWrapper = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs + 2}px;
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  margin-right: ${({ theme }) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  border-width: 1.5px;
  border-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primary[600] : theme.colors.border.light};
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primary[50] : theme.colors.background.secondary};
`;

const ChipText = styled.Text<{ isSelected: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  font-weight: ${({ isSelected, theme }) =>
    isSelected ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium};
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primary[700] : theme.colors.text.secondary};
`;

const CountBadge = styled.View<{ isSelected: boolean }>`
  margin-left: ${({ theme }) => theme.spacing.xs}px;
  padding-horizontal: 6px;
  padding-vertical: 1px;
  border-radius: ${({ theme }) => theme.borderRadius.full}px;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primary[600] : theme.colors.neutral[200]};
`;

const CountText = styled.Text<{ isSelected: boolean }>`
  font-size: 10px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.text.inverse : theme.colors.text.secondary};
`;

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  isSelected,
  onPress,
  count,
}) => {
  return (
    <ChipWrapper
      isSelected={isSelected}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isSelected }}
      accessibilityLabel={`Filter by ${label}`}
    >
      <ChipText isSelected={isSelected}>{label}</ChipText>
      {count !== undefined && (
        <CountBadge isSelected={isSelected}>
          <CountText isSelected={isSelected}>{count}</CountText>
        </CountBadge>
      )}
    </ChipWrapper>
  );
};
