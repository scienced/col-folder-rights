import { Link, useLocation } from 'react-router-dom';
import { Download, BarChart3 } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  {
    name: 'Download Management',
    path: '/download-management',
    icon: Download,
    // Also active for folder routes
    matchPaths: ['/download-management', '/folders'],
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: BarChart3,
    matchPaths: ['/analytics'],
  },
];

export function Sidebar() {
  const location = useLocation();

  const isItemActive = (item: typeof navItems[0]) => {
    return item.matchPaths.some(path => location.pathname.startsWith(path));
  };

  return (
    <aside className="w-52 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      {/* Logo - clickable to home */}
      <Link to="/" className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="font-bold text-gray-900 tracking-tight">ADMIN PANEL</span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              isItemActive(item)
                ? 'text-gray-900 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
