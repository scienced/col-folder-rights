import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { DropZone } from '../ui/DropZone';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, thumbnail?: File) => void;
}

export function CreateFolderModal({
  isOpen,
  onClose,
  onCreate,
}: CreateFolderModalProps) {
  const [name, setName] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name.trim(), thumbnail || undefined);
      setName('');
      setThumbnail(null);
      onClose();
    }
  };

  const handleFileDrop = (files: FileList) => {
    if (files.length > 0) {
      setThumbnail(files[0]);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create a folder"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            Create
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <Input
          placeholder="Give it a name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Folder Thumbnail
          </label>
          <DropZone
            onFileDrop={handleFileDrop}
            accept="image/*"
          />
          {thumbnail && (
            <p className="text-sm text-gray-600 mt-2">
              Selected: {thumbnail.name}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
