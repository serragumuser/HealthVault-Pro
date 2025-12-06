'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth.store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { User, Mail, Phone, Calendar, MapPin, Edit2, X, Check } from 'lucide-react';

const avatarOptions = [
  {
    id: 'male1',
    url: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop&crop=faces',
    label: 'Male Avatar 1'
  },
  {
    id: 'male2',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces',
    label: 'Male Avatar 2'
  },
  {
    id: 'female1',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces',
    label: 'Female Avatar 1'
  },
  {
    id: 'female2',
    url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces',
    label: 'Female Avatar 2'
  },
  {
    id: 'female3',
    url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=faces',
    label: 'Female Avatar 3'
  },
  {
    id: 'male3',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces',
    label: 'Male Avatar 3'
  },
];

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0].url);
  const [displayInfo, setDisplayInfo] = useState({
    phoneNumber: '',
    dateOfBirth: '',
    address: '123 Health St, Medical City, MC 12345',
  });
  const [editForm, setEditForm] = useState({
    phoneNumber: '',
    dateOfBirth: '',
    address: '123 Health St, Medical City, MC 12345',
  });

  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      setSelectedAvatar(savedAvatar);
    }
    
    // Load saved info from localStorage
    const savedPhone = localStorage.getItem('userPhone');
    const savedDOB = localStorage.getItem('userDOB');
    const savedAddress = localStorage.getItem('userAddress');
    
    const loadedInfo = {
      phoneNumber: savedPhone || user?.phoneNumber || '',
      dateOfBirth: savedDOB || (user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''),
      address: savedAddress || '123 Health St, Medical City, MC 12345',
    };
    
    setDisplayInfo(loadedInfo);
    setEditForm(loadedInfo);
  }, [user]);

  const handleSaveInfo = () => {
    // Save to localStorage
    localStorage.setItem('userPhone', editForm.phoneNumber);
    localStorage.setItem('userDOB', editForm.dateOfBirth);
    localStorage.setItem('userAddress', editForm.address);
    
    // Update display
    setDisplayInfo(editForm);
    setShowEditModal(false);
    
    // Success message
    alert('✅ Information updated successfully!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your personal information</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <img
                    src={selectedAvatar}
                    alt="User Avatar"
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100 dark:ring-blue-900/30"
                  />
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                    title="Change avatar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{user?.role}</p>
                <button 
                  onClick={() => setShowAvatarModal(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                  title="Edit information"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                    <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-medium">{displayInfo.phoneNumber || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                    <p className="font-medium">
                      {displayInfo.dateOfBirth ? new Date(displayInfo.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                    <p className="font-medium">{displayInfo.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Emergency Contact</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">Jane Doe</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Relationship</p>
                  <p className="font-medium text-gray-900 dark:text-white">Spouse</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">+1 234 567 8901</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Information Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Information</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editForm.phoneNumber}
                  onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                  placeholder="+1 234 567 8900"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={editForm.dateOfBirth}
                  onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  rows={3}
                  placeholder="123 Health St, Medical City, MC 12345"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInfo}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Choose Your Avatar</h3>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {avatarOptions.map((avatar) => (
                <div
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.url)}
                  className={`relative cursor-pointer rounded-xl overflow-hidden transition-all ${
                    selectedAvatar === avatar.url
                      ? 'ring-4 ring-blue-600 scale-105'
                      : 'ring-2 ring-gray-200 dark:ring-gray-700 hover:ring-blue-400'
                  }`}
                >
                  <img
                    src={avatar.url}
                    alt={avatar.label}
                    className="w-full aspect-square object-cover"
                  />
                  {selectedAvatar === avatar.url && (
                    <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-xs text-white font-medium text-center">{avatar.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAvatarModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  localStorage.setItem('userAvatar', selectedAvatar);
                  setShowAvatarModal(false);
                  window.location.reload(); // Refresh to update header
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Save Avatar
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
