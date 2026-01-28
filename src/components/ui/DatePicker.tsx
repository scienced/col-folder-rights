import { Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DatePickerProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = 'Select date',
  className,
}: DatePickerProps) {
  return (
    <div className={cn('flex-1', className)}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Calendar className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-gray-700"
        />
      </div>
      <span className="text-xs text-gray-500 mt-1 block">{label}</span>
    </div>
  );
}
