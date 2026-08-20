export const formatDate = (isoString?: string): string => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
};

export const formatDateTime = (isoString?: string): string => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
};

export const getScorePerformanceMessage = (percentage: number): { title: string; subtitle: string; color: string } => {
  if (percentage >= 90) {
    return {
      title: 'Outstanding!',
      subtitle: 'You have demonstrated excellent mastery of these vocabulary words.',
      color: '#10B981',
    };
  }
  if (percentage >= 75) {
    return {
      title: 'Great Job!',
      subtitle: 'Solid understanding. A quick review will make your recall perfect.',
      color: '#6366F1',
    };
  }
  if (percentage >= 50) {
    return {
      title: 'Good Effort!',
      subtitle: 'You are making steady progress. Review the missed words to improve.',
      color: '#F59E0B',
    };
  }
  return {
    title: 'Keep Practicing!',
    subtitle: 'Regular learning sessions will help solidify these word meanings.',
    color: '#EF4444',
  };
};
