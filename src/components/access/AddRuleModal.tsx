import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AccessRule, RuleCriteria, RuleOperator } from '../../types';
import { mockUserCollections, mockUserRoles } from '../../data/mockAccessOptions';
import { cn } from '../../lib/utils';

interface AddRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: AccessRule) => void;
  editingRule?: AccessRule | null;
}

export function AddRuleModal({
  isOpen,
  onClose,
  onSave,
  editingRule,
}: AddRuleModalProps) {
  const [criteria, setCriteria] = useState<RuleCriteria>(
    editingRule?.criteria || 'user_collection_access'
  );
  const [operator, setOperator] = useState<RuleOperator>(
    editingRule?.operator || 'is_any_of'
  );
  const [selectedValues, setSelectedValues] = useState<string[]>(
    editingRule?.values || []
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Get available values based on criteria
  const availableValues =
    criteria === 'user_collection_access'
      ? mockUserCollections.map((c) => c.name)
      : mockUserRoles.map((r) => r.name);

  // Filter by search query
  const filteredValues = availableValues.filter((v) =>
    v.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const handleSave = () => {
    const rule: AccessRule = {
      id: editingRule?.id || `rule-${Date.now()}`,
      criteria,
      operator,
      values: selectedValues,
    };
    onSave(rule);
    handleClearAndClose();
  };

  const handleClearAll = () => {
    setSelectedValues([]);
  };

  const handleClearAndClose = () => {
    setCriteria('user_collection_access');
    setOperator('is_any_of');
    setSelectedValues([]);
    setSearchQuery('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClearAndClose}
      title="Add Rule"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={handleClearAll}>
            Clear All
          </Button>
          <Button onClick={handleSave} disabled={selectedValues.length === 0}>
            Save Condition
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Criteria */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-1">
            Criteria
            <span className="text-gray-400">▼</span>
          </h4>
          <div className="flex gap-2">
            <button
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                criteria === 'user_collection_access'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
              onClick={() => {
                setCriteria('user_collection_access');
                setSelectedValues([]);
              }}
            >
              User Collection Access
            </button>
            <button
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                criteria === 'user_role'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
              onClick={() => {
                setCriteria('user_role');
                setSelectedValues([]);
              }}
            >
              User Role
            </button>
          </div>
        </div>

        {/* Operator */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-1">
            Operator
            <span className="text-gray-400">▼</span>
          </h4>
          <div className="flex gap-2">
            <button
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                operator === 'is_any_of'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
              onClick={() => setOperator('is_any_of')}
            >
              Allow only
            </button>
            <button
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                operator === 'is_none_of'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
              onClick={() => setOperator('is_none_of')}
            >
              Block
            </button>
          </div>
        </div>

        {/* Value */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-1">
            Value
            <span className="text-gray-400">▼</span>
          </h4>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for value"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Value chips */}
          <div className="flex flex-wrap gap-2 max-h-48 overflow-auto">
            {filteredValues.map((value) => {
              const isSelected = selectedValues.includes(value);
              return (
                <button
                  key={value}
                  onClick={() => toggleValue(value)}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isSelected
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>

          {/* Selected values summary */}
          {selectedValues.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                Selected ({selectedValues.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedValues.map((value) => (
                  <span
                    key={value}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-900 text-white text-sm rounded-md"
                  >
                    {value}
                    <button
                      onClick={() => toggleValue(value)}
                      className="hover:text-gray-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
