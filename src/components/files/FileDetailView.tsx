import { useState, useEffect } from 'react';
import { Trash2, Info } from 'lucide-react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Checkbox } from '../ui/Checkbox';
import { DatePicker } from '../ui/DatePicker';
import { AccessManagement } from '../access/AccessManagement';
import { InheritedAccessDisplay } from '../access/InheritedAccessDisplay';
import { FileItem, UsageChannel, AccessRule } from '../../types';

interface FileDetailViewProps {
  file: FileItem;
  folderAccessRules?: AccessRule[];
  folderName?: string;
  onUpdate: (updates: Partial<FileItem>) => void;
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

export function FileDetailView({
  file,
  folderAccessRules = [],
  folderName,
  onUpdate,
}: FileDetailViewProps) {
  const [name, setName] = useState(file.name);
  const [description, setDescription] = useState(file.description);
  const [channels, setChannels] = useState<UsageChannel[]>(file.channels);
  const [startDate, setStartDate] = useState(file.availabilityStart || '');
  const [endDate, setEndDate] = useState(file.availabilityEnd || '');
  const [accessRules, setAccessRules] = useState<AccessRule[]>(file.accessRules);
  const [showAddRule, setShowAddRule] = useState(false);

  // Determine if folder has access configured (folder is source of truth)
  const folderHasAccess = folderAccessRules.length > 0;

  useEffect(() => {
    setName(file.name);
    setDescription(file.description);
    setChannels(file.channels);
    setStartDate(file.availabilityStart || '');
    setEndDate(file.availabilityEnd || '');
    setAccessRules(file.accessRules);
  }, [file]);

  const toggleChannel = (channelId: UsageChannel) => {
    const newChannels = channels.includes(channelId)
      ? channels.filter((c) => c !== channelId)
      : [...channels, channelId];
    setChannels(newChannels);
    onUpdate({ channels: newChannels });
  };

  const handleAddRule = (rule: AccessRule) => {
    const newRules = [...accessRules, rule];
    setAccessRules(newRules);
    onUpdate({ accessRules: newRules });
    setShowAddRule(false);
  };

  const handleEditRule = (ruleId: string, updatedRule: AccessRule) => {
    const newRules = accessRules.map((r) => (r.id === ruleId ? updatedRule : r));
    setAccessRules(newRules);
    onUpdate({ accessRules: newRules });
  };

  const handleDeleteRule = (ruleId: string) => {
    const newRules = accessRules.filter((r) => r.id !== ruleId);
    setAccessRules(newRules);
    onUpdate({ accessRules: newRules });
  };

  // Check if it's a document type
  const isDocument = ['CSV', 'PDF', 'DOCX', 'XLS'].includes(file.type);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Image Preview */}
      <div className="lg:w-1/2">
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {isDocument ? (
            <div className="w-full h-full flex items-center justify-center">
              <div
                className={`text-8xl font-bold ${
                  file.type === 'CSV'
                    ? 'text-green-500'
                    : file.type === 'PDF'
                    ? 'text-red-500'
                    : 'text-blue-500'
                }`}
              >
                {file.type}
              </div>
            </div>
          ) : (
            <img
              src={file.thumbnailUrl}
              alt={file.name}
              className="w-full h-full object-contain"
            />
          )}
          {/* Delete button on image */}
          <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Trash2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* File Information Panel */}
      <div className="lg:w-1/2 space-y-6">
        {/* FILE INFORMATION */}
        <section>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            File Information
          </h3>
          <div className="space-y-4">
            <Input
              label="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                onUpdate({ name: e.target.value });
              }}
            />
            <Textarea
              label="Description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                onUpdate({ description: e.target.value });
              }}
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500">Type</span>
                <p className="text-sm text-gray-900">image/{file.type.toLowerCase()}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Uploaded at</span>
                <p className="text-sm text-gray-900">{file.uploadedAt}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Size</span>
                <p className="text-sm text-gray-900">{file.size}</p>
              </div>
              {file.resolution && (
                <div>
                  <span className="text-xs text-gray-500">Resolution</span>
                  <p className="text-sm text-gray-900">{file.resolution}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Divider */}
        <hr className="border-gray-200" />

        {/* USAGE CHANNELS */}
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

        {/* Divider */}
        <hr className="border-gray-200" />

        {/* AVAILABILITY */}
        <section>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Availability
          </h3>
          <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm">When no date is selected, it remains available.</p>
          </div>
          <div className="flex gap-4">
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(value) => {
                setStartDate(value);
                onUpdate({ availabilityStart: value });
              }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(value) => {
                setEndDate(value);
                onUpdate({ availabilityEnd: value });
              }}
            />
          </div>
        </section>

        {/* Divider */}
        <hr className="border-gray-200" />

        {/* ACCESS MANAGEMENT */}
        <section>
          {folderHasAccess ? (
            // Folder has access configured - show inherited state
            <InheritedAccessDisplay
              folderName={folderName || 'folder'}
              folderRules={folderAccessRules}
              fileRules={accessRules}
            />
          ) : (
            // No folder access - file controls its own access
            <AccessManagement
              rules={accessRules}
              onAddRule={handleAddRule}
              onEditRule={handleEditRule}
              onDeleteRule={handleDeleteRule}
              showAddRuleModal={showAddRule}
              setShowAddRuleModal={setShowAddRule}
            />
          )}
        </section>
      </div>
    </div>
  );
}
