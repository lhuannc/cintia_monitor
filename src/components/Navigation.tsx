import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Monitor, Bed, Users, Layout } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { path: '/devices', label: 'Devices', icon: Monitor },
  { path: '/beds', label: 'Beds', icon: Bed },
  { path: '/patients', label: 'Patients', icon: Users },
  { path: '/panels', label: 'Panels', icon: Layout },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-8 h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            HealthMonitor
          </Link>
          <div className="flex space-x-4">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={clsx(
                  'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium',
                  location.pathname === path
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}