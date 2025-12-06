'use client';

/**
 * Dashboard Page
 * Main patient dashboard with health overview
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Activity,
  Calendar,
  FileText,
  Pill,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  CheckCircle2,
  Heart,
  Thermometer,
  Droplet,
  User,
  Stethoscope,
  X,
  ChevronRight,
} from 'lucide-react';

const healthQuestions = [
  {
    id: 1,
    question: "How would you rate your overall health?",
    options: ["Excellent", "Good", "Fair", "Poor"]
  },
  {
    id: 2,
    question: "How many hours do you sleep per night?",
    options: ["Less than 5", "5-6 hours", "7-8 hours", "More than 8"]
  },
  {
    id: 3,
    question: "How often do you exercise?",
    options: ["Daily", "3-4 times a week", "1-2 times a week", "Rarely"]
  },
  {
    id: 4,
    question: "How stressed do you feel?",
    options: ["Not stressed", "Mildly stressed", "Moderately stressed", "Very stressed"]
  },
  {
    id: 5,
    question: "How would you describe your diet?",
    options: ["Very healthy", "Mostly healthy", "Average", "Unhealthy"]
  },
  {
    id: 6,
    question: "Do you have any chronic health conditions?",
    options: ["No", "Yes, managed well", "Yes, needs attention", "Yes, unmanaged"]
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
  const [showHealthTest, setShowHealthTest] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsChecking(false);
    };
    initAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Only redirect after auth check is complete
    if (!isChecking && !isAuthenticated) {
      router.push('/login');
    }
  }, [isChecking, isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);
    
    if (currentQuestion < healthQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateHealthScore = () => {
    // Calculate score based on answers (0-3 for each question)
    const totalScore = answers.reduce((sum, answer) => sum + (3 - answer), 0);
    const maxScore = healthQuestions.length * 3;
    return Math.round((totalScore / maxScore) * 100);
  };

  const getHealthFeedback = (score: number) => {
    if (score >= 80) {
      return {
        title: "Excellent Health!",
        message: "You're doing great! Keep up the healthy lifestyle.",
        color: "green",
        icon: "😊"
      };
    } else if (score >= 60) {
      return {
        title: "Good Health",
        message: "You're on the right track. A few improvements could boost your health.",
        color: "blue",
        icon: "🙂"
      };
    } else if (score >= 40) {
      return {
        title: "Fair Health",
        message: "Consider making some lifestyle changes to improve your health.",
        color: "yellow",
        icon: "😐"
      };
    } else {
      return {
        title: "Needs Attention",
        message: "We recommend consulting with a healthcare professional.",
        color: "red",
        icon: "😟"
      };
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setShowHealthTest(false);
  };

  // Show loading while checking authentication
  if (isChecking || !user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user.firstName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's your health overview for today
        </p>
      </div>

      {/* Test Me Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowHealthTest(true)}
          className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-semibold"
        >
          <Stethoscope className="w-5 h-5" />
          Test Me - Quick Health Assessment
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">+2 this week</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">3</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Appointments</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Pill className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">5 active</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">12</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Medications</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">2 pending</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">8</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Lab Results</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Activity className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">Normal</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">98%</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Health Score</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { icon: Calendar, title: 'Appointment Scheduled', desc: 'Dr. Smith - Cardiology', time: '2 hours ago', color: 'blue' },
                { icon: FileText, title: 'Lab Results Available', desc: 'Blood Test - Complete Panel', time: '1 day ago', color: 'green' },
                { icon: Pill, title: 'Medication Reminder', desc: 'Take Aspirin 100mg', time: '2 days ago', color: 'purple' },
                { icon: User, title: 'Profile Updated', desc: 'Emergency contact information', time: '3 days ago', color: 'gray' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition">
                  <div className={`p-2 bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-lg`}>
                    <item.icon className={`w-5 h-5 text-${item.color}-600 dark:text-${item.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{item.time}</span>
                </div>
              ))}
            </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => router.push('/dashboard/doctors')}
              className="w-full flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition text-left"
            >
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-gray-900 dark:text-white">Book Appointment</span>
            </button>
            <button 
              onClick={() => router.push('/dashboard/lab-results')}
              className="w-full flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition text-left"
            >
              <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="font-medium text-gray-900 dark:text-white">View Lab Results</span>
            </button>
            <button 
              onClick={() => router.push('/dashboard/prescriptions')}
              className="w-full flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition text-left"
            >
              <Pill className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="font-medium text-gray-900 dark:text-white">Manage Medications</span>
            </button>
            <button 
              onClick={() => router.push('/dashboard/profile')}
              className="w-full flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-left"
            >
              <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">Update Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Health Test Modal */}
      {showHealthTest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full p-8 relative">
            <button
              onClick={resetTest}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            {!showResults ? (
              <>
                {/* Question Screen */}
                <div className="text-center mb-8">
                  {/* Professional Animated Human Figure */}
                  <div className="mb-6 flex justify-center">
                    <div className="relative w-40 h-40">
                      {/* Multi-layer Pulse Background */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute w-full h-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                        <div className="absolute w-4/5 h-4/5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full animate-pulse" />
                      </div>
                      
                      {/* Detailed Human SVG */}
                      <svg className="w-full h-full relative z-10" viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" className="stop-blue-500" style={{ stopColor: '#3b82f6' }} />
                            <stop offset="100%" className="stop-blue-600" style={{ stopColor: '#2563eb' }} />
                          </linearGradient>
                          <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                            <feMerge>
                              <feMergeNode in="coloredBlur"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                        </defs>
                        
                        {/* Head with details */}
                        <g className="animate-pulse" style={{ transformOrigin: '50px 25px' }}>
                          <circle cx="50" cy="25" r="14" fill="url(#bodyGradient)" filter="url(#glow)" />
                          {/* Eyes */}
                          <circle cx="45" cy="23" r="1.5" fill="white" />
                          <circle cx="55" cy="23" r="1.5" fill="white" />
                          {/* Smile */}
                          <path d="M 45 28 Q 50 30 55 28" stroke="white" strokeWidth="1" fill="none" strokeLinecap="round" />
                        </g>
                        
                        {/* Neck */}
                        <rect x="47" y="38" width="6" height="8" rx="3" fill="url(#bodyGradient)" opacity="0.9" />
                        
                        {/* Torso */}
                        <ellipse cx="50" cy="65" rx="18" ry="22" fill="url(#bodyGradient)" filter="url(#glow)" />
                        
                        {/* Arms - Animated breathing */}
                        <g className="origin-center" style={{ animation: 'breathe 2s ease-in-out infinite' }}>
                          {/* Left Arm */}
                          <path d="M 32 55 Q 28 65 30 75" stroke="url(#bodyGradient)" strokeWidth="7" strokeLinecap="round" fill="none" />
                          <circle cx="30" cy="76" r="4" fill="url(#bodyGradient)" />
                          
                          {/* Right Arm */}
                          <path d="M 68 55 Q 72 65 70 75" stroke="url(#bodyGradient)" strokeWidth="7" strokeLinecap="round" fill="none" />
                          <circle cx="70" cy="76" r="4" fill="url(#bodyGradient)" />
                        </g>
                        
                        {/* Legs */}
                        <g>
                          {/* Left Leg */}
                          <path d="M 42 85 L 38 110 L 38 125" stroke="url(#bodyGradient)" strokeWidth="8" strokeLinecap="round" fill="none" />
                          <ellipse cx="38" cy="128" rx="5" ry="3" fill="url(#bodyGradient)" />
                          
                          {/* Right Leg */}
                          <path d="M 58 85 L 62 110 L 62 125" stroke="url(#bodyGradient)" strokeWidth="8" strokeLinecap="round" fill="none" />
                          <ellipse cx="62" cy="128" rx="5" ry="3" fill="url(#bodyGradient)" />
                        </g>
                        
                        {/* Animated Heart Beat */}
                        <g className="origin-center" style={{ animation: 'heartbeat 1.5s ease-in-out infinite', transformOrigin: '50px 65px' }}>
                          <path d="M 50 60 L 45 55 Q 42 52 42 58 Q 42 62 50 68 Q 58 62 58 58 Q 58 52 55 55 Z" fill="#ef4444" opacity="0.9" filter="url(#glow)" />
                        </g>
                        
                        {/* Health Plus Icon */}
                        <g className="animate-pulse">
                          <circle cx="75" cy="30" r="8" fill="#10b981" opacity="0.9" />
                          <path d="M 75 26 L 75 34 M 71 30 L 79 30" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </g>
                      </svg>
                      
                      {/* Breathing particle effect */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDuration: '1.5s' }} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Add custom keyframes */}
                  <style jsx>{`
                    @keyframes breathe {
                      0%, 100% { transform: translateY(0) scale(1); }
                      50% { transform: translateY(-3px) scale(1.02); }
                    }
                    @keyframes heartbeat {
                      0%, 100% { transform: scale(1); }
                      25% { transform: scale(1.1); }
                      50% { transform: scale(1); }
                      75% { transform: scale(1.15); }
                    }
                  `}</style>
                  
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Health Assessment
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Question {currentQuestion + 1} of {healthQuestions.length}
                  </p>
                </div>

                <div className="mb-8">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
                    <div
                      className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / healthQuestions.length) * 100}%` }}
                    />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                    {healthQuestions[currentQuestion].question}
                  </h3>

                  <div className="space-y-3">
                    {healthQuestions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        className="w-full p-4 text-left border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 group-hover:border-blue-500 dark:group-hover:border-blue-400 transition" />
                          <span className="text-gray-900 dark:text-white font-medium">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Results Screen */}
                <div className="text-center">
                  {/* Professional Celebration Human */}
                  <div className="mb-6 flex justify-center">
                    <div className="relative w-40 h-40">
                      {/* Victory Aura */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute w-full h-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full animate-ping" style={{ animationDuration: '1.5s' }} />
                        <div className="absolute w-4/5 h-4/5 bg-gradient-to-r from-yellow-500/10 to-green-500/10 rounded-full animate-pulse" />
                      </div>
                      
                      {/* Celebrating Human SVG */}
                      <svg className="w-full h-full relative z-10" viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="successGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#10b981' }} />
                            <stop offset="100%" style={{ stopColor: '#059669' }} />
                          </linearGradient>
                        </defs>
                        
                        {/* Happy Head */}
                        <g className="animate-bounce" style={{ transformOrigin: '50px 25px', animationDuration: '0.8s' }}>
                          <circle cx="50" cy="25" r="15" fill="url(#successGradient)" filter="url(#glow)" />
                          {/* Happy Eyes */}
                          <path d="M 43 22 Q 45 20 47 22" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
                          <path d="M 53 22 Q 55 20 57 22" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
                          {/* Big Smile */}
                          <path d="M 42 28 Q 50 33 58 28" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
                        </g>
                        
                        {/* Neck */}
                        <rect x="47" y="39" width="6" height="8" rx="3" fill="url(#successGradient)" />
                        
                        {/* Torso */}
                        <ellipse cx="50" cy="65" rx="18" ry="22" fill="url(#successGradient)" filter="url(#glow)" />
                        
                        {/* Arms Raised - Victory Pose */}
                        <g className="origin-center" style={{ animation: 'celebrate 1s ease-in-out infinite' }}>
                          {/* Left Arm Up */}
                          <path d="M 32 55 Q 25 45 22 35" stroke="url(#successGradient)" strokeWidth="7" strokeLinecap="round" fill="none" />
                          <circle cx="22" cy="33" r="4" fill="url(#successGradient)" />
                          
                          {/* Right Arm Up */}
                          <path d="M 68 55 Q 75 45 78 35" stroke="url(#successGradient)" strokeWidth="7" strokeLinecap="round" fill="none" />
                          <circle cx="78" cy="33" r="4" fill="url(#successGradient)" />
                        </g>
                        
                        {/* Legs */}
                        <g>
                          <path d="M 42 85 L 38 110 L 38 125" stroke="url(#successGradient)" strokeWidth="8" strokeLinecap="round" />
                          <ellipse cx="38" cy="128" rx="5" ry="3" fill="url(#successGradient)" />
                          <path d="M 58 85 L 62 110 L 62 125" stroke="url(#successGradient)" strokeWidth="8" strokeLinecap="round" />
                          <ellipse cx="62" cy="128" rx="5" ry="3" fill="url(#successGradient)" />
                        </g>
                        
                        {/* Trophy */}
                        <g className="animate-bounce" style={{ transformOrigin: '50px 65px', animationDuration: '1.2s' }}>
                          <path d="M 45 62 L 48 55 L 52 55 L 55 62 L 53 68 L 47 68 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
                          <rect x="48" y="68" width="4" height="4" fill="#f59e0b" />
                          <ellipse cx="50" cy="73" rx="4" ry="2" fill="#f59e0b" />
                          <circle cx="50" cy="58" r="1.5" fill="#fef3c7" />
                        </g>
                        
                        {/* Confetti */}
                        <g className="animate-pulse">
                          <circle cx="30" cy="40" r="2" fill="#ef4444" />
                          <circle cx="70" cy="45" r="2" fill="#3b82f6" />
                          <circle cx="35" cy="60" r="1.5" fill="#fbbf24" />
                          <circle cx="65" cy="55" r="1.5" fill="#10b981" />
                        </g>
                        
                        {/* Stars */}
                        <g className="animate-spin" style={{ transformOrigin: '20px 20px', animationDuration: '3s' }}>
                          <path d="M 20 15 L 21 18 L 24 18 L 21.5 20 L 22.5 23 L 20 21 L 17.5 23 L 18.5 20 L 16 18 L 19 18 Z" fill="#fbbf24" />
                        </g>
                        <g className="animate-spin" style={{ transformOrigin: '80px 25px', animationDuration: '2.5s', animationDirection: 'reverse' }}>
                          <path d="M 80 20 L 81 23 L 84 23 L 81.5 25 L 82.5 28 L 80 26 L 77.5 28 L 78.5 25 L 76 23 L 79 23 Z" fill="#fbbf24" />
                        </g>
                      </svg>
                    </div>
                  </div>
                  
                  <style jsx>{`
                    @keyframes celebrate {
                      0%, 100% { transform: rotate(-5deg); }
                      50% { transform: rotate(5deg); }
                    }
                  `}</style>
                  
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {getHealthFeedback(calculateHealthScore()).title}
                  </h2>
                  
                  <div className="mb-6">
                    <div className="text-6xl font-bold mb-2">
                      <span className={`text-${getHealthFeedback(calculateHealthScore()).color}-600`}>
                        {calculateHealthScore()}%
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Health Score</p>
                  </div>

                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                    {getHealthFeedback(calculateHealthScore()).message}
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 Recommendations:</h4>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
                        <li>• Schedule regular checkups with your doctor</li>
                        <li>• Maintain a balanced diet and exercise routine</li>
                        <li>• Monitor your vital signs regularly</li>
                        <li>• Stay hydrated and get adequate sleep</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={resetTest}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setCurrentQuestion(0);
                        setAnswers([]);
                        setShowResults(false);
                      }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition"
                    >
                      Retake Test
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
