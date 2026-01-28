import { NavLink } from 'react-router-dom';
import { Download, BarChart3 } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  {
    name: 'Download Management',
    path: '/',
    icon: Download,
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: BarChart3,
  },
];

export function Sidebar() {
  return (
    <aside className="w-52 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="font-bold text-gray-900 tracking-tight">ADMIN PANEL</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
