import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { Button } from '../components/ui/Button';
import { FolderGrid } from '../components/folders/FolderGrid';
import { CreateFolderDrawer } from '../components/folders/CreateFolderDrawer';
import { useApp } from '../context/AppContext';

export function FolderListPage() {
  const { folders, addFolder } = useApp();
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

  // Get root folders (parentId is null)
  const rootFolders = folders.filter((f) => f.parentId === null);

  const handleCreateFolder = (name: string, thumbnailBase64?: string) => {
    addFolder(name, thumbnailBase64);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Breadcrumb
          items={[
            { id: 'dm', name: 'Download Management', path: '/download-management' },
          ]}
        />
        <Button icon={Plus} onClick={() => setIsCreateDrawerOpen(true)}>
          Create new folder
        </Button>
      </div>

      {/* Folder Grid */}
      <FolderGrid folders={rootFolders} />

      {/* Create Folder Drawer */}
      <CreateFolderDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onCreate={handleCreateFolder}
      />
    </div>
  );
}
