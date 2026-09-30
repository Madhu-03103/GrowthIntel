import clsx from 'clsx';
import { getScoreBgColor } from '../utils/helpers';

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  height?: 'sm' | 'md' | 'lg';
  color?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  height = 'md',
  color,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const bgColor = color || getScoreBgColor(value);

  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={clsx('flex-1 bg-gray-200 rounded-full overflow-hidden', heightClasses[height])}>
        <div
          className={clsx('h-full rounded-full transition-all duration-300', bgColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-gray-900 min-w-[3rem] text-right">
          {value.toFixed(0)}
        </span>
      )}
    </div>
  );
}
