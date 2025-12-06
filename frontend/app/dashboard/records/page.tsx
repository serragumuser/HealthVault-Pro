'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { FileText, Download, Eye, Calendar, User, Filter } from 'lucide-react';
import { useState } from 'react';
import { jsPDF } from 'jspdf';

// Real PDF generation function using jsPDF
const generateMockPDF = (record: MedicalRecord) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(37, 99, 235); // Blue
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('HEALTHVAULT PRO', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Medical Record Document', 105, 30, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Document Info
  doc.setFontSize(16);
  doc.text('Document Information', 20, 55);
  
  doc.setFontSize(11);
  let yPos = 70;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Title:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.title, 50, yPos);
  
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Type:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.type, 50, yPos);
  
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(record.date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }), 50, yPos);
  
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Physician:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.doctor, 50, yPos);
  
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Category:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.category.toUpperCase(), 50, yPos);
  
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('File Size:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.size, 50, yPos);
  
  // Separator line
  yPos += 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, 190, yPos);
  
  // Document Details
  yPos += 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Document Details', 20, yPos);
  
  yPos += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('This is an official medical record from HealthVault Pro.', 20, yPos);
  
  yPos += 10;
  doc.text('Record ID: ' + record.id, 20, yPos);
  yPos += 7;
  doc.text('Document Status: Active', 20, yPos);
  yPos += 7;
  doc.text('Storage Location: Secure Cloud Storage', 20, yPos);
  
  yPos += 15;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  const noteText = 'NOTE: This is a demonstration document. In a production environment, this would contain complete medical information, official letterhead, and physician signatures.';
  const splitNote = doc.splitTextToSize(noteText, 170);
  doc.text(splitNote, 20, yPos);
  
  // Footer
  doc.setFillColor(240, 240, 240);
  doc.rect(0, 270, 210, 27, 'F');
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.text('© 2025 HealthVault Pro - All Rights Reserved', 105, 285, { align: 'center' });
  
  // Save the PDF
  doc.save(`${record.title.replace(/\s+/g, '_')}.pdf`);
};

interface MedicalRecord {
  id: string;
  title: string;
  type: string;
  date: string;
  doctor: string;
  size: string;
  category: 'report' | 'imaging' | 'prescription' | 'other';
}

const records: MedicalRecord[] = [
  {
    id: '1',
    title: 'Annual Physical Examination',
    type: 'PDF',
    date: '2025-01-15',
    doctor: 'Dr. Sarah Johnson',
    size: '2.4 MB',
    category: 'report',
  },
  {
    id: '2',
    title: 'Blood Test Results - Complete Panel',
    type: 'PDF',
    date: '2025-01-08',
    doctor: 'Dr. Michael Chen',
    size: '856 KB',
    category: 'report',
  },
  {
    id: '3',
    title: 'Chest X-Ray',
    type: 'DICOM',
    date: '2024-12-20',
    doctor: 'Dr. Emily Rodriguez',
    size: '12.3 MB',
    category: 'imaging',
  },
  {
    id: '4',
    title: 'Prescription - Lisinopril 10mg',
    type: 'PDF',
    date: '2024-12-15',
    doctor: 'Dr. Sarah Johnson',
    size: '145 KB',
    category: 'prescription',
  },
];

export default function MedicalRecordsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredRecords = selectedCategory === 'all' 
    ? records 
    : records.filter(r => r.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'report':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'imaging':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'prescription':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Medical Records</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Access your complete medical history</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'report', 'imaging', 'prescription', 'other'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Records Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(record.category)}`}>
                  {record.category}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {record.title}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(record.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <User className="w-4 h-4" />
                  <span>{record.doctor}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">{record.size}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => alert(`Viewing: ${record.title}`)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="View document"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => generateMockPDF(record)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Download document"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
