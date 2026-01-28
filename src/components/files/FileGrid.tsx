import { FileCard } from './FileCard';
import { FileItem } from '../../types';

interface FileGridProps {
  files: FileItem[];
  onFileClick?: (file: FileItem) => void;
}

export function FileGrid({ files, onFileClick }: FileGridProps) {
  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No files in this folder yet. Upload files to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((file) => (
        <FileCard key={file.id} file={file} onClick={onFileClick} />
      ))}
    </div>
  );
}
