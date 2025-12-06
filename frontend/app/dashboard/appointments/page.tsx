'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Calendar, Clock, MapPin, Video, Phone, Plus, Filter, Search, Loader2, X, Star, Award, Users, Briefcase } from 'lucide-react';
import { appointmentsService, Appointment } from '@/lib/services/appointments.service';

const doctorPhotos: Record<string, string> = {
  'Dr. Sarah Johnson': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=faces',
  'Dr. Michael Chen': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=faces',
  'Dr. Emily Rodriguez': 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=faces',
};

const mockAppointments: Appointment[] = [
  {
    id: '1',
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    date: '2024-11-20',
    time: '10:00 AM',
    type: 'in-person',
    location: 'Medical Center, Building A, Room 205',
    status: 'upcoming',
    reason: 'Annual Checkup',
  },
  {
    id: '2',
    doctorName: 'Dr. Michael Chen',
    specialty: 'Dermatology',
    date: '2024-11-18',
    time: '2:30 PM',
    type: 'video',
    location: 'Video Consultation',
    status: 'upcoming',
    reason: 'Skin Condition Follow-up',
  },
  {
    id: '3',
    doctorName: 'Dr. Emily Rodriguez',
    specialty: 'General Practice',
    date: '2024-11-10',
    time: '9:00 AM',
    type: 'in-person',
    location: 'Wellness Clinic, 2nd Floor',
    status: 'completed',
    reason: 'Flu Symptoms',
  },
];

interface DoctorProfile {
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  experience: string;
  education: string;
  bio: string;
  reviews: Array<{
    id: string;
    patientName: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

const doctorProfiles: Record<string, DoctorProfile> = {
  'Dr. Sarah Johnson': {
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    rating: 4.9,
    reviewCount: 127,
    experience: '15 years',
    education: 'Harvard Medical School, MD',
    bio: 'Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in treating heart conditions. She specializes in preventive cardiology and has helped thousands of patients improve their cardiovascular health.',
    reviews: [
      { id: '1', patientName: 'John D.', rating: 5, comment: 'Excellent doctor! Very thorough and caring.', date: '2024-11-10' },
      { id: '2', patientName: 'Mary S.', rating: 5, comment: 'Dr. Johnson saved my life. Highly recommend!', date: '2024-11-05' },
      { id: '3', patientName: 'Robert K.', rating: 4, comment: 'Very knowledgeable and professional.', date: '2024-10-28' },
    ],
  },
  'Dr. Michael Chen': {
    name: 'Dr. Michael Chen',
    specialty: 'Dermatology',
    rating: 4.8,
    reviewCount: 98,
    experience: '10 years',
    education: 'Stanford University School of Medicine, MD',
    bio: 'Dr. Michael Chen is a skilled dermatologist specializing in both medical and cosmetic dermatology. He is known for his gentle approach and innovative treatment methods.',
    reviews: [
      { id: '1', patientName: 'Lisa M.', rating: 5, comment: 'Amazing results! Very happy with the treatment.', date: '2024-11-08' },
      { id: '2', patientName: 'David P.', rating: 5, comment: 'Professional and friendly. Highly recommended.', date: '2024-10-30' },
      { id: '3', patientName: 'Sarah T.', rating: 4, comment: 'Good experience overall.', date: '2024-10-20' },
    ],
  },
  'Dr. Emily Rodriguez': {
    name: 'Dr. Emily Rodriguez',
    specialty: 'General Practice',
    rating: 4.9,
    reviewCount: 156,
    experience: '12 years',
    education: 'Johns Hopkins University, MD',
    bio: 'Dr. Emily Rodriguez is a compassionate family physician dedicated to providing comprehensive care for patients of all ages. She believes in a holistic approach to healthcare.',
    reviews: [
      { id: '1', patientName: 'James B.', rating: 5, comment: 'Best family doctor we\'ve ever had!', date: '2024-11-12' },
      { id: '2', patientName: 'Patricia W.', rating: 5, comment: 'Very caring and listens to concerns.', date: '2024-11-01' },
      { id: '3', patientName: 'Michael R.', rating: 5, comment: 'Excellent bedside manner.', date: '2024-10-25' },
    ],
  },
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentsService.getAll();
      setAppointments(data);
    } catch (err) {
      console.log('Using mock data - backend not available');
      setAppointments(mockAppointments);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesFilter = filter === 'all' || apt.status === filter;
    const matchesSearch = apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 flex-shrink-0" />;
      case 'phone':
        return <Phone className="w-4 h-4 flex-shrink-0" />;
      default:
        return <MapPin className="w-4 h-4 flex-shrink-0" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Appointments</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your medical appointments</p>
          </div>
          <button 
            onClick={() => alert('Book Appointment feature - Coming soon! This will open a booking form.')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Book Appointment</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by doctor or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Past
            </button>
          </div>
        </div>

        {/* Appointments List */}
        <div className="grid gap-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <img
                      src={doctorPhotos[appointment.doctorName] || `https://ui-avatars.com/api/?name=${encodeURIComponent(appointment.doctorName)}&background=random&size=128&bold=true`}
                      alt={appointment.doctorName}
                      className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
                    />
                    <div className="flex-1">
                      <h3 
                        onClick={() => setSelectedDoctor(doctorProfiles[appointment.doctorName])}
                        className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {appointment.doctorName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.specialty}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{appointment.reason}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm font-medium">{new Date(appointment.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      {getTypeIcon(appointment.type)}
                      <span className="text-sm">{appointment.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 items-start md:items-end md:ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                    {appointment.status === 'upcoming' && (
                      <button 
                        onClick={() => alert(`Appointment Details:\n${appointment.doctorName}\n${appointment.date} at ${appointment.time}\n${appointment.location}`)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No appointments found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>

      {/* Doctor Profile Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full my-8">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-start justify-between">
              <div className="flex items-start gap-4">
                <img
                  src={doctorPhotos[selectedDoctor.name] || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedDoctor.name)}&background=random&size=256&bold=true`}
                  alt={selectedDoctor.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedDoctor.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedDoctor.specialty}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(selectedDoctor.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                      <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">
                        {selectedDoctor.rating}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({selectedDoctor.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Experience</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedDoctor.experience}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Briefcase className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Education</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{selectedDoctor.education}</p>
                  </div>
                </div>
              </div>

              {/* Biography */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {selectedDoctor.bio}
                </p>
              </div>

              {/* Reviews */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Patient Reviews</h3>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedDoctor.reviewCount} total reviews
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  {selectedDoctor.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{review.patientName}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedDoctor(null);
                  alert('Book appointment feature - Coming soon!');
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
