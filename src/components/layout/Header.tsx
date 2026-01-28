import { User, ChevronRight } from 'lucide-react';
import { ScenarioSelector } from './ScenarioSelector';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  companyName?: string;
  userEmail?: string;
}

export function Header({
  companyName = 'Apptitude BV',
  userEmail = 'michiel@colect.io',
}: HeaderProps) {
  const { currentScenario, setCurrentScenario } = useApp();

  return (
    <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      {/* Company Name */}
      <div className="text-gray-900 font-medium">{companyName}</div>

      {/* Right side controls */}
      <div className="flex items-center gap-4">
        {/* Scenario Selector - tucked away */}
        <ScenarioSelector
          currentScenario={currentScenario}
          onScenarioChange={setCurrentScenario}
        />

        {/* User Info */}
        <div className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-500" />
          </div>
          <span>{userEmail}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
