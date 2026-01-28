import { FolderLock, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { AccessRule } from '../../types';
import { AccessRuleCard } from './AccessRuleCard';

interface InheritedAccessDisplayProps {
  folderName: string;
  folderRules: AccessRule[];
  fileRules: AccessRule[];
}

export function InheritedAccessDisplay({
  folderName,
  folderRules,
  fileRules,
}: InheritedAccessDisplayProps) {
  const [showFileRules, setShowFileRules] = useState(false);

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Access Management
      </h3>

      {/* Inherited from folder notice */}
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
              This file's access is controlled by "{folderName}". To change access, edit the folder settings.
            </p>
          </div>
        </div>
      </div>

      {/* Active folder rules (read-only display) */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
          Active Rules (from folder)
        </p>
        <div className="space-y-3">
          {folderRules.map((rule, index) => (
            <div key={rule.id}>
              <AccessRuleCard
                rule={rule}
                readOnly
              />
              {index < folderRules.length - 1 && (
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

      {/* File's own rules (inactive, collapsible) */}
      {fileRules.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <button
            onClick={() => setShowFileRules(!showFileRules)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showFileRules ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            <span>
              {fileRules.length} file-level rule{fileRules.length !== 1 ? 's' : ''} (inactive)
            </span>
          </button>

          {showFileRules && (
            <div className="mt-3 opacity-50">
              <p className="text-xs text-gray-400 mb-3">
                These rules will become active again if folder access is removed.
              </p>
              <div className="space-y-3 pointer-events-none">
                {fileRules.map((rule, index) => (
                  <div key={rule.id}>
                    <AccessRuleCard
                      rule={rule}
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                    {index < fileRules.length - 1 && (
                      <div className="flex items-center justify-center my-2">
                        <span className="px-3 py-1 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-400">
                          AND
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
