'use client';

/**
 * Header Component
 * Top navigation with search, notifications, theme toggle, and user menu
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { useTheme } from '@/lib/context/theme-context';
import {
  Bell,
  Search,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Calendar,
  FileText,
  Pill,
  Activity,
  Users,
  Bot,
  FlaskConical,
} from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [userAvatar, setUserAvatar] = useState('https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop&crop=faces');

  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      setUserAvatar(savedAvatar);
    }
  }, []);

  const notifications = [
    { id: '1', type: 'appointment', title: 'Upcoming Appointment', message: 'Dr. Sarah Johnson - Tomorrow at 10:00 AM', time: '2 hours ago', unread: true },
    { id: '2', type: 'lab', title: 'Lab Results Ready', message: 'Your blood test results are now available', time: '1 day ago', unread: true },
    { id: '3', type: 'medication', title: 'Medication Reminder', message: 'Time to take your medication', time: '2 days ago', unread: false },
    { id: '4', type: 'general', title: 'Profile Updated', message: 'Your profile information has been updated', time: '3 days ago', unread: false },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const quickLinks = [
    { icon: Calendar, label: 'Appointments', path: '/dashboard/appointments' },
    { icon: FileText, label: 'Medical Records', path: '/dashboard/records' },
    { icon: Pill, label: 'Prescriptions', path: '/dashboard/prescriptions' },
    { icon: FlaskConical, label: 'Lab Results', path: '/dashboard/lab-results' },
    { icon: Activity, label: 'Vital Signs', path: '/dashboard/vitals' },
    { icon: Users, label: 'Doctors', path: '/dashboard/doctors' },
    { icon: Bot, label: 'AI Assistant', path: '/dashboard/ai-assistant' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
  ];

  const handleNavigate = (path: string) => {
    router.push(path);
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder="Search patients, appointments, records..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
              />
            </div>

            {/* Search Dropdown */}
            {showSearchDropdown && (
              <>
                {/* Backdrop to close */}
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setShowSearchDropdown(false)}
                />
                
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-40 animate-in slide-in-from-top-2 duration-200">
                  <div className="p-2">
                    <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Quick Navigation
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {quickLinks.map((link, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleNavigate(link.path)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                        >
                          <link.icon className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                            {link.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-40 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        <button 
                          onClick={() => setShowNotifications(false)}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Mark all as read
                        </button>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer ${
                            notification.unread ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                          }`}
                          onClick={() => {
                            setShowNotifications(false);
                            // Navigate based on notification type
                            if (notification.type === 'appointment') router.push('/dashboard/appointments');
                            if (notification.type === 'lab') router.push('/dashboard/lab-results');
                            if (notification.type === 'medication') router.push('/dashboard/prescriptions');
                          }}
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0">
                              {notification.type === 'appointment' && (
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                              )}
                              {notification.type === 'lab' && (
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                              )}
                              {notification.type === 'medication' && (
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                  <Pill className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                              )}
                              {notification.type === 'general' && (
                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {notification.title}
                                </p>
                                {notification.unread && (
                                  <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                      <button 
                        onClick={() => {
                          setShowNotifications(false);
                          router.push('/dashboard/notifications');
                        }}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <img
                  src={userAvatar}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                  
                  <button
                    onClick={() => router.push('/dashboard/profile')}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  
                  <button
                    onClick={() => router.push('/dashboard/settings')}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
