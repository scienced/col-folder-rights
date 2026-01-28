import { useState, useEffect } from 'react';
import { ChevronLeft, AlertTriangle, Trash2, Upload } from 'lucide-react';
import { Drawer } from '../ui/Drawer';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AccessManagement } from '../access/AccessManagement';
import { Folder, AccessRule } from '../../types';

interface EditFolderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  folder: Folder | null;
  onSave: (updates: Partial<Folder>) => void;
  onDelete?: () => void;
  fileCount?: number;
}

export function EditFolderDrawer({
  isOpen,
  onClose,
  folder,
  onSave,
  onDelete,
  fileCount = 0,
}: EditFolderDrawerProps) {
  const [name, setName] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [accessRules, setAccessRules] = useState<AccessRule[]>([]);
  const [originalAccessRules, setOriginalAccessRules] = useState<AccessRule[]>([]);
  const [showAddRule, setShowAddRule] = useState(false);
  const [showFirstRuleWarning, setShowFirstRuleWarning] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingRule, setPendingRule] = useState<AccessRule | null>(null);

  useEffect(() => {
    if (folder) {
      setName(folder.name);
      setThumbnailUrl(folder.thumbnailUrl);
      setAccessRules(folder.accessRules);
      setOriginalAccessRules(folder.accessRules);
    }
  }, [folder]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleThumbnailUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && file.type.startsWith('image/')) {
        const base64 = await fileToBase64(file);
        setThumbnailUrl(base64);
      }
    };
    input.click();
  };

  const handleSave = () => {
    onSave({
      name: name.trim(),
      thumbnailUrl,
      accessRules,
    });
    onClose();
  };

  const handleAddRule = (rule: AccessRule) => {
    // Check if this is the first rule being added (folder had no rules before)
    if (originalAccessRules.length === 0 && accessRules.length === 0) {
      // Show warning before adding first rule
      setPendingRule(rule);
      setShowFirstRuleWarning(true);
      setShowAddRule(false);
    } else {
      // Not the first rule, add directly
      setAccessRules([...accessRules, rule]);
      setShowAddRule(false);
    }
  };

  const handleConfirmFirstRule = () => {
    if (pendingRule) {
      setAccessRules([...accessRules, pendingRule]);
      setPendingRule(null);
    }
    setShowFirstRuleWarning(false);
  };

  const handleCancelFirstRule = () => {
    setPendingRule(null);
    setShowFirstRuleWarning(false);
  };

  const handleEditRule = (ruleId: string, updatedRule: AccessRule) => {
    setAccessRules(
      accessRules.map((r) => (r.id === ruleId ? updatedRule : r))
    );
  };

  const handleDeleteRule = (ruleId: string) => {
    setAccessRules(accessRules.filter((r) => r.id !== ruleId));
  };

  const handleDeleteFolder = () => {
    if (onDelete) {
      onDelete();
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  if (!folder) return null;

  return (
    <>
      <Drawer isOpen={isOpen} onClose={onClose}>
        <div className="min-h-full bg-white">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                icon={ChevronLeft}
                onClick={onClose}
              >
                Back to folder
              </Button>

              <h1 className="text-lg font-semibold text-gray-900">
                Edit folder
              </h1>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row gap-8 p-6 max-w-5xl mx-auto">
            {/* Left side - Thumbnail */}
            <div className="lg:w-1/2">
              <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[2/1] shadow-sm group">
                <img
                  src={thumbnailUrl}
                  alt={folder.name}
                  className="w-full h-full object-cover"
                />
                {/* Overlay for changing thumbnail */}
                <button
                  type="button"
                  onClick={handleThumbnailUpload}
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center"
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center text-white">
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Change thumbnail</span>
                  </div>
                </button>
                {onDelete && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(true);
                    }}
                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors z-10"
                    title="Delete folder"
                  >
                    <Trash2 className="w-5 h-5 text-gray-600 hover:text-red-500" />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Hover and click to change thumbnail
              </p>
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                  />
                </div>
              </section>

              <hr className="border-gray-200" />

              {/* Access Management */}
              <section>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Access Management
                </h3>

                {/* Info message when rules are configured */}
                {accessRules.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-900">
                          Folder access is active
                        </p>
                        <p className="text-sm text-amber-700 mt-1">
                          All {fileCount > 0 ? `${fileCount} ` : ''}files in this folder inherit these access rules. Individual file permissions are inactive.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <AccessManagement
                  rules={accessRules}
                  onAddRule={handleAddRule}
                  onEditRule={handleEditRule}
                  onDeleteRule={handleDeleteRule}
                  showAddRuleModal={showAddRule}
                  setShowAddRuleModal={setShowAddRule}
                  hideHeader
                />
              </section>
            </div>
          </div>
        </div>
      </Drawer>

      {/* First Rule Warning Modal */}
      <Modal
        isOpen={showFirstRuleWarning}
        onClose={handleCancelFirstRule}
        title="Enable folder access control?"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={handleCancelFirstRule}>
              Cancel
            </Button>
            <Button onClick={handleConfirmFirstRule}>
              Yes, enable folder access
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 mb-3">
                Adding access rules to this folder will:
              </p>
              <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                <li>Apply these rules to <strong>all files</strong> inside this folder</li>
                <li><strong>Temporarily ignore</strong> any existing file-level permissions</li>
                <li>Automatically apply to <strong>new uploads</strong> and moved files</li>
              </ul>
              <p className="mt-4 text-sm text-gray-500">
                File permissions will be restored if you remove all folder access rules.
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Folder Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete folder?"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteFolder} className="bg-red-600 hover:bg-red-700">
              Delete folder
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              Are you sure you want to delete <strong>"{folder.name}"</strong>?
            </p>
            {fileCount > 0 && (
              <p className="text-sm text-red-600 mt-2">
                This folder contains {fileCount} file{fileCount !== 1 ? 's' : ''} that will also be deleted.
              </p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
