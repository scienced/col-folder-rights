import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { DropZone } from '../ui/DropZone';

interface CreateFolderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, thumbnail?: File) => void;
}

export function CreateFolderDrawer({
  isOpen,
  onClose,
  onCreate,
}: CreateFolderDrawerProps) {
  const [name, setName] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name.trim(), thumbnail || undefined);
      setName('');
      setThumbnail(null);
      setThumbnailPreview(null);
      onClose();
    }
  };

  const handleFileDrop = (files: FileList) => {
    if (files.length > 0) {
      const file = files[0];
      setThumbnail(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  };

  const handleClose = () => {
    setName('');
    setThumbnail(null);
    setThumbnailPreview(null);
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose}>
      <div className="min-h-full bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              icon={ChevronLeft}
              onClick={handleClose}
            >
              Back
            </Button>

            <h1 className="text-lg font-semibold text-gray-900">
              Create a folder
            </h1>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!name.trim()}>
                Create
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-8 p-6 max-w-5xl mx-auto">
          {/* Left side - Thumbnail */}
          <div className="lg:w-1/2">
            {thumbnailPreview ? (
              <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[2/1] shadow-sm">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setThumbnail(null);
                    setThumbnailPreview(null);
                  }}
                  className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-600 text-lg">✕</span>
                </button>
              </div>
            ) : (
              <div className="aspect-[2/1]">
                <DropZone
                  onFileDrop={handleFileDrop}
                  accept="image/*"
                  className="h-full rounded-xl"
                />
              </div>
            )}
          </div>

          {/* Right side - Settings */}
          <div className="lg:w-1/2 space-y-6">
            {/* Folder Name */}
            <section>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Folder Details
              </h3>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Give it a name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                />
              </div>
            </section>

            <hr className="border-gray-200" />

            {/* Info message */}
            <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm">
                You can configure access rules after creating the folder.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
