import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Upload, Trash2, Info, FolderLock, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { DatePicker } from '../components/ui/DatePicker';
import { AccessManagement } from '../components/access/AccessManagement';
import { AccessRuleCard } from '../components/access/AccessRuleCard';
import { useApp } from '../context/AppContext';
import { UsageChannel, AccessRule } from '../types';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
}

const channelOptions: { id: UsageChannel; label: string }[] = [
  { id: 'in-store', label: 'In-store' },
  { id: 'ecommerce', label: 'Ecommerce' },
  { id: 'print', label: 'Print' },
  { id: 'social', label: 'Social' },
  { id: 'website', label: 'Website' },
  { id: 'newsletter', label: 'Newsletter' },
  { id: 'marketplaces', label: 'Market Places' },
];

export function UploadPage() {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  const { getFolderById } = useApp();

  const folder = folderId ? getFolderById(folderId) : undefined;
  const folderHasAccess = folder ? folder.accessRules.length > 0 : false;

  // Upload state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Settings state
  const [channels, setChannels] = useState<UsageChannel[]>([
    'in-store', 'ecommerce', 'print', 'social', 'website', 'newsletter', 'marketplaces'
  ]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [accessRules, setAccessRules] = useState<AccessRule[]>([]);
  const [showAddRule, setShowAddRule] = useState(false);

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

  const handleBack = () => {
    navigate(`/folders/${folderId}/files`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*,.pdf,.csv,.doc,.docx,.xls,.xlsx';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        addFiles(files);
      }
    };
    input.click();
  };

  const addFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      progress: 100, // Simulating instant upload for mockup
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter((f) => f.id !== fileId));
  };

  const toggleChannel = (channelId: UsageChannel) => {
    if (channels.includes(channelId)) {
      setChannels(channels.filter((c) => c !== channelId));
    } else {
      setChannels([...channels, channelId]);
    }
  };

  const handleAddRule = (rule: AccessRule) => {
    setAccessRules([...accessRules, rule]);
    setShowAddRule(false);
  };

  const handleEditRule = (ruleId: string, updatedRule: AccessRule) => {
    setAccessRules(accessRules.map((r) => (r.id === ruleId ? updatedRule : r)));
  };

  const handleDeleteRule = (ruleId: string) => {
    setAccessRules(accessRules.filter((r) => r.id !== ruleId));
  };

  const handlePublish = () => {
    // In a real app, this would upload files to the backend
    console.log('Publishing files:', uploadedFiles);
    console.log('Settings:', { channels, startDate, endDate, accessRules });
    navigate(`/folders/${folderId}/files`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
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

          <Button
            onClick={handlePublish}
            disabled={uploadedFiles.length === 0}
            className={uploadedFiles.length === 0 ? 'opacity-50' : ''}
          >
            Publish ({uploadedFiles.length})
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex p-6 gap-8">
        {/* Left side - Drop zone and uploaded files */}
        <div className="flex-1">
          <div
            className={`border-2 border-dashed rounded-lg transition-colors min-h-[500px] flex flex-col ${
              isDragOver
                ? 'border-primary bg-primary/5'
                : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Drop zone area */}
            <div
              className="flex-1 flex flex-col items-center justify-center cursor-pointer py-12"
              onClick={handleFileSelect}
            >
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600">
                <span className="text-gray-900 font-medium">Click to upload</span> or drag and drop
              </p>
            </div>

            {/* Uploaded files grid */}
            {uploadedFiles.length > 0 && (
              <div className="border-t border-gray-200 p-4">
                <div className="grid grid-cols-4 gap-4">
                  {uploadedFiles.map((uploadedFile) => (
                    <div key={uploadedFile.id} className="relative">
                      {/* Thumbnail */}
                      <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-2">
                        {uploadedFile.preview ? (
                          <img
                            src={uploadedFile.preview}
                            alt={uploadedFile.file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-xs font-medium">
                              {uploadedFile.file.name.split('.').pop()?.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* File info */}
                      <p className="text-xs text-gray-900 truncate" title={uploadedFile.file.name}>
                        {uploadedFile.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(uploadedFile.file.size)}
                      </p>

                      {/* Progress bar and delete */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${uploadedFile.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{uploadedFile.progress}%</span>
                        <button
                          onClick={() => removeFile(uploadedFile.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Settings panel */}
        <div className="w-80 space-y-6">
          {/* Usage Channels */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Usage Channels
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {channelOptions.map((channel) => (
                <Checkbox
                  key={channel.id}
                  label={channel.label}
                  checked={channels.includes(channel.id)}
                  onChange={() => toggleChannel(channel.id)}
                />
              ))}
            </div>
          </section>

          {/* Availability */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Availability
            </h3>
            <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm">When no date is selected, it remains available.</p>
            </div>
            <div className="flex gap-3">
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
              />
            </div>
          </section>

          {/* Access Management */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Access Management
            </h3>

            {folderHasAccess ? (
              // Folder has access configured - show inherited warning and rules
              <div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FolderLock className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-amber-900">
                        Access inherited from folder
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        Uploaded files will automatically inherit access rules from "{folder.name}".
                      </p>
                    </div>
                  </div>
                </div>

                {/* Display folder rules (read-only) */}
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Active Rules (from folder)
                </p>
                <div className="space-y-3">
                  {folder.accessRules.map((rule, index) => (
                    <div key={rule.id}>
                      <AccessRuleCard rule={rule} readOnly />
                      {index < folder.accessRules.length - 1 && (
                        <div className="flex items-center justify-center my-2">
                          <span className="px-3 py-1 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-600">
                            AND
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // No folder access - allow setting file access
              <>
                <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    No access rules defined yet. By default, everyone has access.
                  </p>
                </div>

                {accessRules.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {/* Display rules here if any are added */}
                  </div>
                )}

                <button
                  onClick={() => setShowAddRule(true)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add rule
                </button>

                {/* Hidden AccessManagement for the modal */}
                {showAddRule && (
                  <AccessManagement
                    rules={accessRules}
                    onAddRule={handleAddRule}
                    onEditRule={handleEditRule}
                    onDeleteRule={handleDeleteRule}
                    showAddRuleModal={showAddRule}
                    setShowAddRuleModal={setShowAddRule}
                  />
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
