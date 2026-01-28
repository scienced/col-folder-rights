import { Pencil, X } from 'lucide-react';
import { AccessRule } from '../../types';

interface AccessRuleCardProps {
  rule: AccessRule;
  onEdit?: () => void;
  onDelete?: () => void;
  readOnly?: boolean;
}

const criteriaLabels: Record<string, string> = {
  user_collection_access: 'Collection',
  user_role: 'Usertype',
};

const operatorLabels: Record<string, string> = {
  is_any_of: 'allow only',
  is_none_of: 'block',
};

export function AccessRuleCard({ rule, onEdit, readOnly = false }: AccessRuleCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-900">
            <span className="font-medium">{criteriaLabels[rule.criteria]}</span>{' '}
            <span className="text-gray-600">{operatorLabels[rule.operator]}:</span>
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {rule.values.map((value, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-3 py-1 text-sm rounded-md ${
                  readOnly
                    ? 'bg-gray-200 text-gray-700'
                    : 'bg-gray-900 text-white gap-1'
                }`}
              >
                {value}
                {!readOnly && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Would remove this specific value
                    }}
                    className="hover:text-gray-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
        {!readOnly && onEdit && (
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
