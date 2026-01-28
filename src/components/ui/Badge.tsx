import { cn } from '../../lib/utils';
import { FileType } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'file';
  fileType?: FileType;
  className?: string;
}

const fileTypeColors: Record<FileType, string> = {
  CSV: 'bg-green-500 text-white',
  PNG: 'bg-blue-500 text-white',
  JPG: 'bg-blue-500 text-white',
  PDF: 'bg-red-500 text-white',
  DOCX: 'bg-purple-500 text-white',
  XLS: 'bg-green-600 text-white',
};

export function Badge({ children, variant = 'default', fileType, className }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    file: fileType ? fileTypeColors[fileType] : 'bg-gray-100 text-gray-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 text-xs font-medium rounded',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
