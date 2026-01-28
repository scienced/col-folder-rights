import { useState } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DropZoneProps {
  onFileDrop?: (files: FileList) => void;
  accept?: string;
  className?: string;
}

export function DropZone({ onFileDrop, accept, className }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && onFileDrop) {
      onFileDrop(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    if (accept) input.accept = accept;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && onFileDrop) {
        onFileDrop(files);
      }
    };
    input.click();
  };

  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
        isDragOver
          ? 'border-primary bg-primary/5'
          : 'border-gray-300 hover:border-gray-400',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
      <p className="text-sm text-gray-600">
        <span className="text-primary font-medium">Click to upload</span> or drag and drop
      </p>
    </div>
  );
}
