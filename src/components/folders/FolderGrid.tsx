import { FolderCard } from './FolderCard';
import { Folder } from '../../types';

interface FolderGridProps {
  folders: Folder[];
}

export function FolderGrid({ folders }: FolderGridProps) {
  if (folders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No folders yet. Create your first folder to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {folders.map((folder) => (
        <FolderCard key={folder.id} folder={folder} />
      ))}
    </div>
  );
}
