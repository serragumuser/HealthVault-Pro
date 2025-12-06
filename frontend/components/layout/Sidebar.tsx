'use client';

/**
 * Sidebar Navigation Component
 * Professional sidebar with icons and navigation
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Pill,
  FlaskConical,
  User,
  Settings,
  Activity,
  MessageSquare,
  Users,
  Heart,
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: 'Appointments',
    icon: Calendar,
    href: '/dashboard/appointments',
  },
  {
    title: 'Medical Records',
    icon: FileText,
    href: '/dashboard/records',
  },
  {
    title: 'Prescriptions',
    icon: Pill,
    href: '/dashboard/prescriptions',
  },
  {
    title: 'Lab Results',
    icon: FlaskConical,
    href: '/dashboard/lab-results',
  },
  {
    title: 'Vital Signs',
    icon: Heart,
    href: '/dashboard/vitals',
  },
  {
    title: 'Doctors',
    icon: Users,
    href: '/dashboard/doctors',
  },
  {
    title: 'AI Assistant',
    icon: MessageSquare,
    href: '/dashboard/ai-assistant',
  },
  {
    title: 'Profile',
    icon: User,
    href: '/dashboard/profile',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">HealthVault</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pro</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-xs font-medium text-gray-900 dark:text-white">System Status</p>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">All systems operational</p>
        </div>
      </div>
    </aside>
  );
}
