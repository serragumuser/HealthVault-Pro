'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Heart, Thermometer, Droplet, Activity, Plus, X } from 'lucide-react';

const vitals = [
  { icon: Heart, label: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'normal', color: 'red' },
  { icon: Heart, label: 'Heart Rate', value: '72', unit: 'bpm', status: 'normal', color: 'pink' },
  { icon: Thermometer, label: 'Temperature', value: '98.6', unit: '°F', status: 'normal', color: 'orange' },
  { icon: Droplet, label: 'Blood Glucose', value: '95', unit: 'mg/dL', status: 'normal', color: 'blue' },
  { icon: Activity, label: 'Oxygen Level', value: '98', unit: '%', status: 'normal', color: 'green' },
];

const history = [
  { date: '2024-11-15', bp: '122/82', hr: '75', temp: '98.4' },
  { date: '2024-11-10', bp: '118/78', hr: '70', temp: '98.6' },
  { date: '2024-11-05', bp: '120/80', hr: '72', temp: '98.5' },
];

export default function VitalSignsPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    temperature: '',
    bloodGlucose: '',
    oxygenLevel: '',
  });

  const getColorClasses = (color: string) => {
    const colors = {
      red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
      orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Vital signs logged:', formData);
    setShowModal(false);
    // Reset form
    setFormData({
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      heartRate: '',
      temperature: '',
      bloodGlucose: '',
      oxygenLevel: '',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Vital Signs</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track your health metrics</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            <span>Log Vitals</span>
          </button>
        </div>

        {/* Log Vitals Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Log Vital Signs</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Blood Pressure (Systolic)
                    </label>
                    <input
                      type="number"
                      value={formData.bloodPressureSystolic}
                      onChange={(e) => setFormData({...formData, bloodPressureSystolic: e.target.value})}
                      placeholder="120"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Blood Pressure (Diastolic)
                    </label>
                    <input
                      type="number"
                      value={formData.bloodPressureDiastolic}
                      onChange={(e) => setFormData({...formData, bloodPressureDiastolic: e.target.value})}
                      placeholder="80"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    value={formData.heartRate}
                    onChange={(e) => setFormData({...formData, heartRate: e.target.value})}
                    placeholder="72"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Temperature (°F)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                    placeholder="98.6"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Blood Glucose (mg/dL)
                  </label>
                  <input
                    type="number"
                    value={formData.bloodGlucose}
                    onChange={(e) => setFormData({...formData, bloodGlucose: e.target.value})}
                    placeholder="95"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Oxygen Level (%)
                  </label>
                  <input
                    type="number"
                    value={formData.oxygenLevel}
                    onChange={(e) => setFormData({...formData, oxygenLevel: e.target.value})}
                    placeholder="98"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Vitals
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Current Vitals */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vitals.map((vital, idx) => {
            const Icon = vital.icon;
            return (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${getColorClasses(vital.color)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{vital.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {vital.value} <span className="text-sm font-normal text-gray-500">{vital.unit}</span>
                    </p>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Normal</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent History</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Blood Pressure</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Heart Rate</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Temperature</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, idx) => (
                  <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{record.bp} mmHg</td>
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{record.hr} bpm</td>
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{record.temp} °F</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
