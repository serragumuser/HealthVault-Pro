'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Users, Star, MapPin, Calendar, X } from 'lucide-react';

const doctorPhotos: Record<string, string> = {
  'Dr. Sarah Johnson': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=faces',
  'Dr. Michael Chen': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=faces',
  'Dr. Emily Rodriguez': 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=faces',
};

const doctors = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    rating: 4.9,
    reviews: 127,
    location: 'Medical Center, Building A',
    nextAvailable: '2025-12-19',
    image: 'SJ',
    bookedDates: ['2025-12-03', '2025-12-05', '2025-12-08', '2025-12-12', '2025-12-15', '2025-12-19', '2025-12-22', '2025-12-26'],
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Dermatology',
    rating: 4.8,
    reviews: 98,
    location: 'Wellness Clinic',
    nextAvailable: '2025-12-17',
    image: 'MC',
    bookedDates: ['2025-12-02', '2025-12-04', '2025-12-09', '2025-12-11', '2025-12-16', '2025-12-18', '2025-12-23', '2025-12-27'],
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'General Practice',
    rating: 4.9,
    reviews: 156,
    location: 'Community Health Center',
    nextAvailable: '2025-12-16',
    image: 'ER',
    bookedDates: ['2025-12-01', '2025-12-06', '2025-12-10', '2025-12-13', '2025-12-17', '2025-12-20', '2025-12-24', '2025-12-30'],
  },
];

// Calendar component
const AppointmentCalendar = ({ doctor, onClose, onBook }: any) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  // Use next month (December 2024 or later)
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  // Show next month's calendar
  const displayYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  const displayMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  
  const getDaysInMonth = () => {
    const firstDay = new Date(displayYear, displayMonth, 1);
    const lastDay = new Date(displayYear, displayMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };
  
  const { daysInMonth, startingDayOfWeek } = getDaysInMonth();
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  const isBooked = (day: number) => {
    const dateStr = `${displayYear}-${String(displayMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return doctor.bookedDates.includes(dateStr);
  };
  
  const isPast = (day: number) => {
    const checkDate = new Date(displayYear, displayMonth, day);
    checkDate.setHours(0, 0, 0, 0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return checkDate < now;
  };
  
  const handleDateClick = (day: number) => {
    if (!isPast(day) && !isBooked(day)) {
      const dateStr = `${displayYear}-${String(displayMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      setSelectedDate(dateStr);
    }
  };
  
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  const handleBooking = () => {
    if (selectedDate) {
      setShowSuccess(true);
      onBook(doctor, selectedDate); // Save booking data
      setTimeout(() => {
        setIsClosing(true);
      }, 1800);
      setTimeout(() => {
        onClose();
      }, 2200);
    }
  };
  
  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-colors duration-300 ${
      isClosing ? 'bg-black/0' : 'bg-black/50'
    }`}>
      <div className={`bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 transition-all duration-300 ${
        isClosing ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{doctor.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Select an appointment date</p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-center mb-4 text-gray-900 dark:text-white">
            {monthNames[displayMonth]} {displayYear}
          </h4>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const booked = isBooked(day);
              const past = isPast(day);
              const isSelected = selectedDate === `2025-01-${String(day).padStart(2, '0')}`;
              
              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  disabled={past || booked}
                  className={`
                    aspect-square p-2 rounded-lg text-sm font-medium transition-all
                    ${isSelected ? 'ring-2 ring-blue-500' : ''}
                    ${past ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed' : ''}
                    ${booked && !past ? 'bg-red-500 text-white cursor-not-allowed' : ''}
                    ${!booked && !past ? 'bg-green-500 text-white hover:bg-green-600' : ''}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="flex gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Booked</span>
          </div>
        </div>
        
        {showSuccess ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4 animate-bounce">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">Appointment Confirmed!</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Completed</p>
          </div>
        ) : selectedDate ? (
          <button
            onClick={handleBooking}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Confirm Booking for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default function DoctorsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  
  const handleBookAppointment = (doctor: any, date: string) => {
    // Appointment booked successfully - no alert needed, animation handles it
  };
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Doctors</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Find and connect with healthcare providers</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <img
                  src={doctorPhotos[doctor.name] || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=random&size=256&bold=true`}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{doctor.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{doctor.specialty}</p>
                
                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{doctor.rating}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">({doctor.reviews})</span>
                </div>

                <div className="w-full space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{doctor.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Next: {new Date(doctor.nextAvailable).toLocaleDateString()}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedDoctor(doctor)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedDoctor && (
        <AppointmentCalendar
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onBook={handleBookAppointment}
        />
      )}
    </DashboardLayout>
  );
}
