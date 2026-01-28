import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { FolderListPage } from './pages/FolderListPage';
import { FolderContentsPage } from './pages/FolderContentsPage';
import { FileDetailPage } from './pages/FileDetailPage';
import { UploadPage } from './pages/UploadPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            {/* Root folder view */}
            <Route path="/" element={<FolderListPage />} />

            {/* Folder contents (files) */}
            <Route path="/folders/:folderId/files" element={<FolderContentsPage />} />

            {/* Upload page */}
            <Route path="/folders/:folderId/upload" element={<UploadPage />} />

            {/* File detail view */}
            <Route path="/folders/:folderId/files/:fileId" element={<FileDetailPage />} />

            {/* Analytics placeholder */}
            <Route
              path="/analytics"
              element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                  <p className="text-gray-500 mt-2">Analytics page coming soon.</p>
                </div>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
