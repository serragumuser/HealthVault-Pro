'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useTheme } from '@/lib/context/theme-context';
import { Bell, Lock, Shield, Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    appointments: true,
    medications: true,
    labResults: true,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account preferences</p>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark mode theme</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Appointment Reminders</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about upcoming appointments</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.appointments}
                  onChange={(e) => setNotifications({...notifications, appointments: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer" 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Medication Reminders</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Daily medication notifications</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.medications}
                  onChange={(e) => setNotifications({...notifications, medications: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer" 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Lab Results</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Notify when new results are available</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.labResults}
                  onChange={(e) => setNotifications({...notifications, labResults: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer" 
                />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h3>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => alert('Change Password - This will open a password change form.')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Change Password</span>
                </div>
                <span className="text-blue-600 dark:text-blue-400">→</span>
              </button>
              <button 
                onClick={() => alert('Two-Factor Authentication setup - Enable 2FA for enhanced security.')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</span>
                </div>
                <span className="text-blue-600 dark:text-blue-400">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
