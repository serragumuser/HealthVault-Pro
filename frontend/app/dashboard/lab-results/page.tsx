'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { FlaskConical, TrendingUp, TrendingDown, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

// Real PDF generation for lab results
const generateLabResultPDF = (lab: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('HEALTHVAULT PRO', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Laboratory Results', 105, 30, { align: 'center' });
  
  // Test Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.text('Test Information', 20, 55);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Test Name:', 20, 70);
  doc.setFont('helvetica', 'normal');
  doc.text(lab.test, 50, 70);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', 20, 80);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(lab.date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }), 50, 80);
  
  // Results Table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Test Results', 20, 100);
  
  // Table header
  doc.setFillColor(240, 240, 240);
  doc.rect(20, 105, 170, 10, 'F');
  doc.setFontSize(10);
  doc.text('Test Name', 25, 112);
  doc.text('Value', 90, 112);
  doc.text('Range', 125, 112);
  doc.text('Status', 160, 112);
  
  // Table rows
  let yPos = 122;
  doc.setFont('helvetica', 'normal');
  
  lab.results.forEach((result: any, index: number) => {
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(20, yPos - 7, 170, 10, 'F');
    }
    
    doc.setTextColor(0, 0, 0);
    doc.text(result.name, 25, yPos);
    doc.text(`${result.value} ${result.unit}`, 90, yPos);
    doc.text(result.range, 125, yPos);
    
    // Status with color
    if (result.status === 'normal') {
      doc.setTextColor(34, 197, 94); // Green
      doc.text('NORMAL', 160, yPos);
    } else {
      doc.setTextColor(239, 68, 68); // Red
      doc.text(result.status.toUpperCase(), 160, yPos);
    }
    
    yPos += 10;
  });
  
  // Note
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  yPos += 10;
  const noteText = 'NOTE: This is a demonstration document. In production, this would include official laboratory letterhead, physician review, and complete quality control data.';
  const splitNote = doc.splitTextToSize(noteText, 170);
  doc.text(splitNote, 20, yPos);
  
  // Footer
  doc.setFillColor(240, 240, 240);
  doc.rect(0, 270, 210, 27, 'F');
  doc.setTextColor(100, 100, 100);
  doc.text('© 2025 HealthVault Pro - All Rights Reserved', 105, 285, { align: 'center' });
  
  doc.save(`${lab.test.replace(/\s+/g, '_')}_${lab.date}.pdf`);
};

const labResults = [
  {
    id: '1',
    test: 'Complete Blood Count',
    date: '2025-01-10',
    results: [
      { name: 'White Blood Cells', value: '7.2', unit: 'K/uL', range: '4.5-11.0', status: 'normal' },
      { name: 'Red Blood Cells', value: '4.8', unit: 'M/uL', range: '4.5-5.5', status: 'normal' },
      { name: 'Hemoglobin', value: '14.5', unit: 'g/dL', range: '13.5-17.5', status: 'normal' },
    ],
  },
  {
    id: '2',
    test: 'Lipid Panel',
    date: '2024-12-28',
    results: [
      { name: 'Total Cholesterol', value: '195', unit: 'mg/dL', range: '<200', status: 'normal' },
      { name: 'LDL Cholesterol', value: '115', unit: 'mg/dL', range: '<100', status: 'high' },
      { name: 'HDL Cholesterol', value: '58', unit: 'mg/dL', range: '>40', status: 'normal' },
      { name: 'Triglycerides', value: '110', unit: 'mg/dL', range: '<150', status: 'normal' },
    ],
  },
];

export default function LabResultsPage() {
  const getStatusIcon = (status: string) => {
    if (status === 'high' || status === 'low') {
      return status === 'high' ? 
        <TrendingUp className="w-4 h-4 text-red-500" /> : 
        <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-600 dark:text-green-400';
      case 'high':
      case 'low':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lab Results</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View your test results and trends</p>
        </div>

        <div className="space-y-6">
          {labResults.map((lab) => (
            <div key={lab.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FlaskConical className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{lab.test}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(lab.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => generateLabResultPDF(lab)}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                  title="Download report"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Test</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Result</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Reference Range</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lab.results.map((result, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{result.name}</td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                          {result.value} {result.unit}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{result.range}</td>
                        <td className="py-3 px-4">
                          <div className={`flex items-center gap-2 ${getStatusColor(result.status)}`}>
                            {getStatusIcon(result.status)}
                            <span className="text-sm font-medium capitalize">{result.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
