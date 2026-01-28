import { useState } from 'react';
import { Plus, Info } from 'lucide-react';
import { AccessRuleCard } from './AccessRuleCard';
import { AddRuleModal } from './AddRuleModal';
import { AccessRule } from '../../types';

interface AccessManagementProps {
  rules: AccessRule[];
  onAddRule: (rule: AccessRule) => void;
  onEditRule: (ruleId: string, rule: AccessRule) => void;
  onDeleteRule: (ruleId: string) => void;
  showAddRuleModal: boolean;
  setShowAddRuleModal: (show: boolean) => void;
  hideHeader?: boolean;
}

export function AccessManagement({
  rules,
  onAddRule,
  onEditRule,
  onDeleteRule,
  showAddRuleModal,
  setShowAddRuleModal,
  hideHeader = false,
}: AccessManagementProps) {
  const [editingRule, setEditingRule] = useState<AccessRule | null>(null);

  const handleEditClick = (rule: AccessRule) => {
    setEditingRule(rule);
    setShowAddRuleModal(true);
  };

  const handleSaveRule = (rule: AccessRule) => {
    if (editingRule) {
      onEditRule(editingRule.id, rule);
      setEditingRule(null);
    } else {
      onAddRule(rule);
    }
    setShowAddRuleModal(false);
  };

  const handleCloseModal = () => {
    setEditingRule(null);
    setShowAddRuleModal(false);
  };

  return (
    <div>
      {!hideHeader && (
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Access Management
        </h3>
      )}

      {rules.length === 0 ? (
        <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-sm">
            No access rules defined yet. By default, everyone has access.
          </p>
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {rules.map((rule, index) => (
            <div key={rule.id}>
              <AccessRuleCard
                rule={rule}
                onEdit={() => handleEditClick(rule)}
                onDelete={() => onDeleteRule(rule.id)}
              />
              {index < rules.length - 1 && (
                <div className="flex items-center justify-center my-2">
                  <span className="px-3 py-1 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-600">
                    AND ▼
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setShowAddRuleModal(true)}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add rule
      </button>

      <AddRuleModal
        isOpen={showAddRuleModal}
        onClose={handleCloseModal}
        onSave={handleSaveRule}
        editingRule={editingRule}
      />
    </div>
  );
}
