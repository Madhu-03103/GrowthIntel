/**
 * Helper utilities for Employee Growth Intelligence
 */

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

export const getScoreBgColor = (score: number): string => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-blue-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const getGrowthLevelLabel = (level: string): string => {
  return level.replace(/_/g, ' ');
};

export const getRiskLevelColor = (level: string): string => {
  const colors: Record<string, string> = {
    LOW: 'text-green-700 bg-green-50 border-green-200',
    MEDIUM: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    HIGH: 'text-orange-700 bg-orange-50 border-orange-200',
    CRITICAL: 'text-red-700 bg-red-50 border-red-200',
  };
  return colors[level] || 'text-gray-700 bg-gray-50 border-gray-200';
};

export const getGrowthLevelColor = (level: string): string => {
  const colors: Record<string, string> = {
    HIGH_GROWTH: 'text-green-700 bg-green-50 border-green-200',
    STABLE_GROWTH: 'text-blue-700 bg-blue-50 border-blue-200',
    SLOW_GROWTH: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    DECLINING: 'text-red-700 bg-red-50 border-red-200',
  };
  return colors[level] || 'text-gray-700 bg-gray-50 border-gray-200';
};

export const getReadinessCategory = (score: number): string => {
  if (score >= 75) return 'READY';
  if (score >= 60) return 'NEAR READY';
  if (score >= 40) return 'DEVELOPING';
  return 'HIGH RISK';
};

export const getReadinessCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    READY: 'text-green-700 bg-green-50',
    'NEAR READY': 'text-blue-700 bg-blue-50',
    NEAR_READY: 'text-blue-700 bg-blue-50',
    DEVELOPING: 'text-yellow-700 bg-yellow-50',
    'HIGH RISK': 'text-red-700 bg-red-50',
    HIGH_RISK: 'text-red-700 bg-red-50',
  };
  return colors[category] || 'text-gray-700 bg-gray-50';
};

export const calculateYearsMonths = (years: number): string => {
  const y = Math.floor(years);
  const m = Math.round((years - y) * 12);
  if (y === 0) return `${m} months`;
  if (m === 0) return `${y} years`;
  return `${y} years ${m} months`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const downloadCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => JSON.stringify(row[header] ?? '')).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};
