import React from 'react';
import { Modal, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import { Button } from './Button';

interface ModalDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const Overlay = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.modalOverlay};
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const DialogContainer = styled.View`
  width: 100%;
  max-width: 360px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.xl}px;
  padding: ${({ theme }) => theme.spacing.xl}px;
  ${({ theme }) => theme.shadows.lg}
`;

const DialogTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.lg}px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const DialogMessage = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const ActionRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const ButtonWrapper = styled.View`
  flex: 1;
`;

export const ModalDialog: React.FC<ModalDialogProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <Overlay>
          <TouchableWithoutFeedback>
            <DialogContainer>
              <DialogTitle>{title}</DialogTitle>
              <DialogMessage>{message}</DialogMessage>
              <ActionRow>
                <ButtonWrapper>
                  <Button
                    title={cancelText}
                    variant="outline"
                    size="sm"
                    onPress={onCancel}
                    disabled={isLoading}
                  />
                </ButtonWrapper>
                <ButtonWrapper>
                  <Button
                    title={confirmText}
                    variant={isDanger ? 'danger' : 'primary'}
                    size="sm"
                    onPress={onConfirm}
                    isLoading={isLoading}
                  />
                </ButtonWrapper>
              </ActionRow>
            </DialogContainer>
          </TouchableWithoutFeedback>
        </Overlay>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
