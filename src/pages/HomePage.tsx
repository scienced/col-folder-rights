import { Link } from 'react-router-dom';
import { Download, BarChart3 } from 'lucide-react';

const modules = [
  {
    name: 'Download Management',
    description: 'Provides a centralized interface to monitor, pause, resume, and organize your ongoing and completed downloads.',
    path: '/download-management',
    icon: Download,
  },
  {
    name: 'Analytics',
    description: 'Provides insights through dashboards and reports, helping teams track performance and make data-driven decisions.',
    path: '/analytics',
    icon: BarChart3,
  },
];

export function HomePage() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
        {modules.map((module) => (
          <Link
            key={module.path}
            to={module.path}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group"
          >
            {/* Icon */}
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <module.icon className="w-6 h-6 text-primary" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {module.name}
            </h2>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed">
              {module.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
