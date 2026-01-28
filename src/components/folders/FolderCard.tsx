import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Folder } from '../../types';

interface FolderCardProps {
  folder: Folder;
}

export function FolderCard({ folder }: FolderCardProps) {
  const navigate = useNavigate();
  const hasAccessRules = folder.accessRules.length > 0;

  const handleClick = () => {
    navigate(`/folders/${folder.id}/files`);
  };

  return (
    <div
      className="cursor-pointer group"
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[2/1] rounded-lg overflow-hidden bg-gray-100 mb-3">
        <img
          src={folder.thumbnailUrl}
          alt={folder.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Access indicator */}
        {hasAccessRules && (
          <div className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center">
            <Lock className="w-4 h-4 text-gray-600" />
          </div>
        )}
      </div>

      {/* Folder name */}
      <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
        {folder.name}
      </h3>
    </div>
  );
}
