import { createContext, useContext, useState, ReactNode } from 'react';
import { Folder, FileItem } from '../types';
import { mockFolders } from '../data/mockFolders';
import { mockFiles } from '../data/mockFiles';

interface AppContextType {
  // Data
  folders: Folder[];
  files: FileItem[];
  currentScenario: string;

  // Folder actions
  addFolder: (name: string, thumbnailUrl?: string) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  getFolderById: (id: string) => Folder | undefined;
  getSubfolders: (parentId: string | null) => Folder[];

  // File actions
  addFile: (file: FileItem) => void;
  updateFile: (id: string, updates: Partial<FileItem>) => void;
  deleteFile: (id: string) => void;
  getFileById: (id: string) => FileItem | undefined;
  getFilesByFolderId: (folderId: string) => FileItem[];

  // Scenario
  setCurrentScenario: (scenarioId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>(mockFolders);
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [currentScenario, setCurrentScenario] = useState<string>('scenario-1');

  // Folder actions
  const addFolder = (name: string, thumbnailUrl?: string) => {
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name,
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',
      parentId: null,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      fileCount: 0,
      accessRules: [],
    };
    setFolders([...folders, newFolder]);
  };

  const updateFolder = (id: string, updates: Partial<Folder>) => {
    setFolders(
      folders.map((folder) =>
        folder.id === id ? { ...folder, ...updates } : folder
      )
    );
  };

  const deleteFolder = (id: string) => {
    setFolders(folders.filter((folder) => folder.id !== id));
  };

  const getFolderById = (id: string) => {
    return folders.find((folder) => folder.id === id);
  };

  const getSubfolders = (parentId: string | null) => {
    return folders.filter((folder) => folder.parentId === parentId);
  };

  // File actions
  const addFile = (file: FileItem) => {
    setFiles([...files, file]);
  };

  const updateFile = (id: string, updates: Partial<FileItem>) => {
    setFiles(
      files.map((file) =>
        file.id === id ? { ...file, ...updates } : file
      )
    );
  };

  const deleteFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  const getFileById = (id: string) => {
    return files.find((file) => file.id === id);
  };

  const getFilesByFolderId = (folderId: string) => {
    return files.filter((file) => file.folderId === folderId);
  };

  return (
    <AppContext.Provider
      value={{
        folders,
        files,
        currentScenario,
        addFolder,
        updateFolder,
        deleteFolder,
        getFolderById,
        getSubfolders,
        addFile,
        updateFile,
        deleteFile,
        getFileById,
        getFilesByFolderId,
        setCurrentScenario,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
