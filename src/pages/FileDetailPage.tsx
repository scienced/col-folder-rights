import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { FileDetailView } from '../components/files/FileDetailView';
import { useApp } from '../context/AppContext';

export function FileDetailPage() {
  const { folderId, fileId } = useParams<{ folderId: string; fileId: string }>();
  const navigate = useNavigate();
  const { getFolderById, getFileById, updateFile, deleteFile } = useApp();

  const folder = folderId ? getFolderById(folderId) : undefined;
  const file = fileId ? getFileById(fileId) : undefined;

  if (!folder || !file) {
    return (
      <div className="p-6">
        <p className="text-gray-500">File not found.</p>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    );
  }

  const handleBack = () => {
    navigate(`/folders/${folderId}/files`);
  };

  const handleUpdate = (updates: Partial<typeof file>) => {
    updateFile(file.id, updates);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this file?')) {
      deleteFile(file.id);
      navigate(`/folders/${folderId}/files`);
    }
  };

  const handleSave = () => {
    // In a real app, this would save changes to the backend
    console.log('Saving changes...');
  };

  return (
    <div className="min-h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            icon={ChevronLeft}
            onClick={handleBack}
          >
            Back to folder
          </Button>

          <h1 className="text-lg font-semibold text-gray-900">
            Folder: {folder.name}
          </h1>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              icon={Trash2}
              onClick={handleDelete}
            >
              Delete File
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <FileDetailView
          file={file}
          folderAccessRules={folder.accessRules}
          folderName={folder.name}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}
