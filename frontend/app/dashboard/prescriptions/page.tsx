'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Pill, Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'pending';
  refillsRemaining: number;
  instructions: string;
}

const prescriptions: Prescription[] = [
  {
    id: '1',
    medication: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    prescribedBy: 'Dr. Sarah Johnson',
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    status: 'active',
    refillsRemaining: 3,
    instructions: 'Take in the morning with food',
  },
  {
    id: '2',
    medication: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    prescribedBy: 'Dr. Sarah Johnson',
    startDate: '2024-03-20',
    endDate: '2024-12-20',
    status: 'active',
    refillsRemaining: 2,
    instructions: 'Take with meals',
  },
  {
    id: '3',
    medication: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily',
    prescribedBy: 'Dr. Michael Chen',
    startDate: '2024-02-10',
    endDate: '2024-11-10',
    status: 'completed',
    refillsRemaining: 0,
    instructions: 'Take at bedtime',
  },
];

export default function PrescriptionsPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'completed':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const activeCount = prescriptions.filter(p => p.status === 'active').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Prescriptions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your medications</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeCount}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Medications</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Due Today</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Refill Needed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex-shrink-0">
                    <Pill className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {prescription.medication}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                        {prescription.status}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {prescription.dosage} • {prescription.frequency}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">{prescription.instructions}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Prescribed by <span className="font-medium">{prescription.prescribedBy}</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Valid until {new Date(prescription.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {prescription.refillsRemaining} refills remaining
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
