import { Badge } from '../ui/Badge';
import { FileItem } from '../../types';

interface FileCardProps {
  file: FileItem;
  onClick?: (file: FileItem) => void;
}

// Map channel IDs to display names
const channelNames: Record<string, string> = {
  'in-store': 'In-store',
  'print': 'Print',
  'website': 'Website',
  'marketplaces': 'Market Places',
  'ecommerce': 'Ecommerce',
  'social': 'Social',
  'newsletter': 'Newsletter',
};

export function FileCard({ file, onClick }: FileCardProps) {
  const handleClick = () => {
    onClick?.(file);
  };

  // Check if it's a document type (show icon instead of thumbnail)
  const isDocument = ['CSV', 'PDF', 'DOCX', 'XLS'].includes(file.type);

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] bg-gray-100">
        {isDocument ? (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className={`text-4xl font-bold ${
                file.type === 'CSV'
                  ? 'text-green-500'
                  : file.type === 'PDF'
                  ? 'text-red-500'
                  : 'text-blue-500'
              }`}
            >
              {file.type}
            </div>
          </div>
        ) : (
          <img
            src={file.thumbnailUrl}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        )}
        {/* File type badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="file" fileType={file.type}>
            {file.type}
          </Badge>
        </div>
      </div>

      {/* File info */}
      <div className="p-3">
        <h4 className="font-medium text-gray-900 text-sm truncate mb-2">
          {file.name}
        </h4>
        {file.channels.length > 0 && (
          <p className="text-xs text-gray-500 line-clamp-2">
            Channels: {file.channels.map((c) => channelNames[c] || c).join(', ')}
          </p>
        )}
      </div>
    </div>
  );
}
