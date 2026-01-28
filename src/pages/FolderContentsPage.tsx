import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, FolderLock, Settings, ChevronLeft, Trash2 } from 'lucide-react';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { Button } from '../components/ui/Button';
import { Drawer } from '../components/ui/Drawer';
import { FileGrid } from '../components/files/FileGrid';
import { FileDetailView } from '../components/files/FileDetailView';
import { EditFolderDrawer } from '../components/folders/EditFolderDrawer';
import { useApp } from '../context/AppContext';
import { FileItem } from '../types';

export function FolderContentsPage() {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  const { getFolderById, getFilesByFolderId, updateFolder, updateFile, deleteFile } = useApp();

  const [isEditFolderModalOpen, setIsEditFolderModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isFileDrawerOpen, setIsFileDrawerOpen] = useState(false);

  const folder = folderId ? getFolderById(folderId) : undefined;
  const files = folderId ? getFilesByFolderId(folderId) : [];

  // Check if folder has access configured
  const folderHasAccess = folder ? folder.accessRules.length > 0 : false;

  if (!folder) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Folder not found.</p>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Back to folders
        </Button>
      </div>
    );
  }

  const handleUploadClick = () => {
    navigate(`/folders/${folderId}/upload`);
  };

  const handleSaveFolder = (updates: Partial<typeof folder>) => {
    updateFolder(folder.id, updates);
  };

  const handleFileClick = (file: FileItem) => {
    setSelectedFile(file);
    setIsFileDrawerOpen(true);
  };

  const handleCloseFileDrawer = () => {
    setIsFileDrawerOpen(false);
    // Delay clearing selectedFile to allow drawer close animation
    setTimeout(() => setSelectedFile(null), 300);
  };

  const handleUpdateFile = (updates: Partial<FileItem>) => {
    if (selectedFile) {
      updateFile(selectedFile.id, updates);
      // Update local state to reflect changes
      setSelectedFile({ ...selectedFile, ...updates });
    }
  };

  const handleDeleteFile = () => {
    if (selectedFile && confirm('Are you sure you want to delete this file?')) {
      deleteFile(selectedFile.id);
      handleCloseFileDrawer();
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Breadcrumb
          items={[
            { id: 'dm', name: 'Download Management', path: '/' },
            { id: folder.id, name: folder.name, path: `/folders/${folder.id}/files` },
          ]}
        />
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setIsEditFolderModalOpen(true)}
          >
            Edit folder
          </Button>
          <Button
            icon={Upload}
            onClick={handleUploadClick}
          >
            Upload
          </Button>
        </div>
      </div>

      {/* Folder Access Banner */}
      {folderHasAccess && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <FolderLock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-900">
                  Folder access control is active
                </p>
                <p className="text-sm text-amber-700">
                  All {files.length} file{files.length !== 1 ? 's' : ''} in this folder inherit folder-level access rules. Individual file permissions are inactive.
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={Settings}
              onClick={() => setIsEditFolderModalOpen(true)}
            >
              Manage
            </Button>
          </div>
        </div>
      )}

      {/* File Grid */}
      <FileGrid files={files} onFileClick={handleFileClick} />

      {/* Edit Folder Drawer */}
      <EditFolderDrawer
        isOpen={isEditFolderModalOpen}
        onClose={() => setIsEditFolderModalOpen(false)}
        folder={folder}
        onSave={handleSaveFolder}
        fileCount={files.length}
      />

      {/* File Detail Drawer */}
      <Drawer isOpen={isFileDrawerOpen} onClose={handleCloseFileDrawer}>
        {selectedFile && (
          <div className="min-h-full bg-white">
            {/* Drawer Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="secondary"
                  icon={ChevronLeft}
                  onClick={handleCloseFileDrawer}
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
                    onClick={handleDeleteFile}
                  >
                    Delete File
                  </Button>
                  <Button onClick={handleCloseFileDrawer}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="p-6">
              <FileDetailView
                file={selectedFile}
                folderAccessRules={folder.accessRules}
                folderName={folder.name}
                onUpdate={handleUpdateFile}
              />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
