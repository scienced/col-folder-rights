import { useState } from 'react';
import { Settings, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface Scenario {
  id: string;
  name: string;
  description: string;
  available: boolean;
}

const scenarios: Scenario[] = [
  {
    id: 'scenario-1',
    name: 'Scenario 1: Folder rules override',
    description: 'Folder access rules override file-level permissions. When a folder has rules, all files inherit them and file-level rules become inactive.',
    available: true,
  },
  {
    id: 'scenario-2',
    name: 'Scenario 2: Inherit and customize',
    description: 'Files copy folder rules at the moment of upload, then can be edited independently. Flexible (like Google Drive), but risky if users accidentally grant wider access to individual files.',
    available: false,
  },
  {
    id: 'scenario-3',
    name: 'Scenario 3: Layered security',
    description: 'Access requires passing BOTH folder AND file rules. Designed for enterprise security needs (funnel logic), but users may be confused when folder access alone doesn\'t grant file access.',
    available: false,
  },
  {
    id: 'scenario-4',
    name: 'Scenario 4: Folder-only access',
    description: 'Only folder-level access rights exist. File-level access rights are fully removed, regardless of the folder.',
    available: false,
  },
  {
    id: 'scenario-5',
    name: 'Scenario 5: Additive access',
    description: 'Folder rules provide baseline access, file rules can grant additional access but cannot restrict. If folder allows "Sales" and file adds "Marketing", both teams can access.',
    available: false,
  },
];

interface ScenarioSelectorProps {
  currentScenario: string;
  onScenarioChange: (scenarioId: string) => void;
}

export function ScenarioSelector({ currentScenario, onScenarioChange }: ScenarioSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario?.available) {
      onScenarioChange(scenarioId);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        title="Mockup settings"
      >
        <Settings className="w-4 h-4" />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Mockup Configuration"
        size="md"
        footer={
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">
            Rights Management Scenario
          </p>

          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleSelect(scenario.id)}
              disabled={!scenario.available}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                currentScenario === scenario.id
                  ? 'border-primary bg-primary/5'
                  : scenario.available
                  ? 'border-gray-200 hover:border-gray-300'
                  : 'border-gray-100 bg-gray-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    scenario.available ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {scenario.name}
                    {!scenario.available && (
                      <span className="ml-2 text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded">
                        Coming soon
                      </span>
                    )}
                  </p>
                  <p className={`text-xs mt-1 ${
                    scenario.available ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {scenario.description}
                  </p>
                </div>
                {currentScenario === scenario.id && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 ml-3">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </button>
          ))}

          <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
            This selector is for demo purposes only. It allows you to experience different rights management approaches.
          </p>
        </div>
      </Modal>
    </>
  );
}
