'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message on client side only
  useEffect(() => {
    setMessages([{
      id: '1',
      type: 'assistant',
      content: 'Hello! 👋 I\'m your AI Health Assistant for HealthVault Pro. I can help you with:\n\n• Understanding your health records\n• Medication information\n• Booking appointments\n• General health advice\n• Vital signs interpretation\n\nHow can I assist you today?',
      timestamp: new Date(),
    }]);
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateSmartResponse(userMessage.content);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1200); // Realistic response time
  };

  // Comprehensive smart response system
  const generateSmartResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Headaches & Pain
    if (input.includes('headache') || input.includes('head') && input.includes('hurt')) {
      return '🤕 **Headaches** can be caused by:\n• Stress or tension\n• Dehydration\n• Lack of sleep\n• Eye strain\n\n**Quick tips:**\n• Drink plenty of water\n• Rest in a quiet, dark room\n• Apply a cold compress\n• Try deep breathing exercises\n\nIf pain persists for more than 2 days or is severe, please consult your doctor.';
    }
    
    if (input.includes('back pain') || input.includes('backache')) {
      return '💪 **Back pain** management:\n• Apply heat or cold therapy\n• Maintain good posture\n• Gentle stretching exercises\n• Avoid heavy lifting\n\nFor chronic or severe pain, consider physical therapy or consult an orthopedic specialist.';
    }
    
    // Fever & Cold
    if (input.includes('fever') || input.includes('temperature')) {
      return '🌡️ **Fever** care:\n• Rest and stay hydrated\n• Monitor temperature regularly\n• Take acetaminophen if needed\n• Dress in light clothing\n\n⚠️ **See a doctor if:**\n• Fever above 103°F (39.4°C)\n• Lasts more than 3 days\n• Accompanied by severe symptoms';
    }
    
    if (input.includes('cold') || input.includes('cough') || input.includes('flu')) {
      return '🤧 **Cold & Flu** care:\n• Get plenty of rest\n• Stay hydrated (water, warm tea)\n• Use throat lozenges for sore throat\n• Gargle with warm salt water\n• Humidifier can help with congestion\n\nUsually improves in 7-10 days. Contact your doctor if symptoms worsen or persist.';
    }
    
    // Medications
    if (input.includes('medication') || input.includes('medicine') || input.includes('prescription') || input.includes('drug')) {
      return '💊 **About your medications:**\n\n📋 Check your **Prescriptions** section for:\n• Active medications\n• Dosage instructions\n• Refill dates\n• Side effects to watch for\n\n**Important reminders:**\n• Take as prescribed by your doctor\n• Don\'t stop suddenly without consulting\n• Report any side effects immediately\n• Keep a medication schedule';
    }
    
    // Appointments
    if (input.includes('appointment') || input.includes('book') || input.includes('doctor')) {
      return '📅 **Booking an appointment:**\n\n1. Go to **Doctors** section\n2. Browse specialists or search by name\n3. View available time slots\n4. Select your preferred date/time\n5. Confirm booking\n\n✅ You\'ll receive:\n• Email confirmation\n• SMS reminder (24 hours before)\n• Video call link (if applicable)\n\nNeed help finding the right specialist?';
    }
    
    // Lab Results
    if (input.includes('test') || input.includes('lab') || input.includes('result') || input.includes('blood work')) {
      return '🧪 **Lab Results:**\n\nView your test results in the **Lab Results** section:\n• Blood tests\n• Urine analysis\n• X-rays and imaging\n• Biopsy reports\n\n📊 **Understanding results:**\n• Green: Normal range\n• Yellow: Borderline\n• Red: Abnormal (requires attention)\n\nAlways discuss abnormal results with your doctor for proper interpretation and next steps.';
    }
    
    // Blood Pressure
    if (input.includes('blood pressure') || input.includes('hypertension') || input.includes('bp')) {
      return '🩺 **Blood Pressure:**\n\n**Normal ranges:**\n• Systolic: < 120 mmHg\n• Diastolic: < 80 mmHg\n\n**Tips to manage:**\n• Reduce salt intake\n• Exercise regularly (30 min/day)\n• Maintain healthy weight\n• Limit alcohol\n• Manage stress\n• Take medication as prescribed\n\nLog your readings in **Vital Signs** section to track trends.';
    }
    
    // Diabetes & Blood Sugar
    if (input.includes('diabetes') || input.includes('sugar') || input.includes('glucose')) {
      return '🍬 **Blood Sugar Management:**\n\n**Target levels (fasting):**\n• Normal: 70-100 mg/dL\n• Prediabetes: 100-125 mg/dL\n• Diabetes: 126+ mg/dL\n\n**Management tips:**\n• Monitor regularly\n• Balanced diet (low carbs)\n• Regular exercise\n• Take medications on time\n• Annual eye and foot exams\n\nConsult your endocrinologist for personalized targets.';
    }
    
    // Weight & Diet
    if (input.includes('weight') || input.includes('diet') || input.includes('nutrition') || input.includes('lose')) {
      return '🥗 **Healthy Weight Management:**\n\n**Balanced approach:**\n• Eat whole, unprocessed foods\n• Portion control\n• Regular physical activity\n• Stay hydrated (8 glasses/day)\n• Get 7-9 hours sleep\n\n**Track your progress:**\n• Log weight in Vital Signs\n• Set realistic goals (1-2 lbs/week)\n• Consider consulting a nutritionist\n\nRemember: Sustainable lifestyle changes, not quick fixes!';
    }
    
    // Exercise
    if (input.includes('exercise') || input.includes('workout') || input.includes('fitness')) {
      return '🏃 **Exercise Guidelines:**\n\n**Recommended:**\n• 150 min moderate activity/week\n• Or 75 min vigorous activity/week\n• Strength training 2x/week\n\n**Types:**\n• Cardio: Walking, swimming, cycling\n• Strength: Weight training, resistance bands\n• Flexibility: Yoga, stretching\n\n**Important:**\n• Start slowly and build up\n• Warm up and cool down\n• Listen to your body\n• Consult doctor before starting intense programs';
    }
    
    // Sleep
    if (input.includes('sleep') || input.includes('insomnia') || input.includes('tired')) {
      return '😴 **Better Sleep:**\n\n**Sleep hygiene tips:**\n• Keep consistent schedule\n• 7-9 hours nightly\n• Dark, cool, quiet room\n• No screens 1 hour before bed\n• Avoid caffeine after 2pm\n• Regular exercise (not before bed)\n\n**Still struggling?**\nConsider sleep study or consult with a sleep specialist. Chronic insomnia needs medical attention.';
    }
    
    // Mental Health
    if (input.includes('stress') || input.includes('anxiety') || input.includes('depress') || input.includes('mental')) {
      return '🧠 **Mental Health Support:**\n\n**Stress management:**\n• Deep breathing exercises\n• Meditation or mindfulness\n• Regular physical activity\n• Talk to someone you trust\n• Professional counseling\n\n**When to seek help:**\n• Persistent sadness (2+ weeks)\n• Affecting daily activities\n• Thoughts of self-harm\n\n📞 **Crisis:** National Suicide Prevention Lifeline: 988\n\nYour mental health matters. Consider booking with a psychiatrist or therapist.';
    }
    
    // Vaccination
    if (input.includes('vaccin') || input.includes('shot') || input.includes('immuniz')) {
      return '💉 **Vaccinations:**\n\n**Stay up-to-date with:**\n• Annual flu vaccine\n• COVID-19 boosters\n• Tetanus (every 10 years)\n• Pneumonia (if indicated)\n• Shingles (age 50+)\n\nCheck your immunization records in Medical Records section. Schedule vaccines through Appointments.';
    }
    
    // Emergency
    if (input.includes('emergency') || input.includes('urgent') || input.includes('911')) {
      return '🚨 **Emergency Situations:**\n\n**Call 911 immediately if:**\n• Chest pain or pressure\n• Difficulty breathing\n• Severe bleeding\n• Loss of consciousness\n• Stroke symptoms (FAST)\n• Severe allergic reaction\n\n**For urgent (non-emergency):**\n• Use Urgent Care\n• Telemedicine consultation\n• Call your doctor\'s office\n\nDon\'t hesitate - when in doubt, call 911!';
    }
    
    // Symptoms Checker
    if (input.includes('symptom') || input.includes('what do i have') || input.includes('diagnose')) {
      return '🔍 **Symptom Information:**\n\nWhile I can provide general health information, I cannot diagnose conditions. Symptoms can have multiple causes.\n\n**Next steps:**\n1. Note all your symptoms\n2. Track when they started\n3. Monitor severity and changes\n4. Book appointment with doctor\n\n⚠️ **Remember:** Self-diagnosis can be misleading. Always consult a healthcare professional for accurate diagnosis and treatment.';
    }
    
    // Greetings
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return '👋 Hello! I\'m here to help with your health questions. You can ask me about:\n• Symptoms and general health\n• Medications and prescriptions\n• Booking appointments\n• Understanding test results\n• Healthy lifestyle tips\n\nWhat would you like to know?';
    }
    
    if (input.includes('thank') || input.includes('thanks')) {
      return '😊 You\'re welcome! I\'m always here to help. Take care of your health, and don\'t hesitate to reach out if you have more questions!\n\n💙 Remember: Your health is your wealth!';
    }
    
    // Default response
    return '🤔 I understand you have a health question. While I can provide general health information, for specific medical advice, diagnosis, or treatment, please:\n\n1. **Book an appointment** with your doctor\n2. **Check your medical records** for history\n3. **Review prescriptions** for medication info\n4. **View lab results** for test outcomes\n\nIs there something specific I can help you with from our platform features?';
  };

  const frequentQuestions = [
    "What should I do if I have a headache?",
    "How can I book an appointment?",
    "What are normal blood pressure values?",
    "How do I manage my medications?",
    "What do my lab results mean?",
    "Tips for better sleep?",
    "How to manage stress and anxiety?",
    "Exercise recommendations for beginners",
    "Healthy diet tips for weight loss",
    "When should I get vaccinated?",
  ];

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  // Format message content with proper line breaks and styling
  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => (
      <div key={index} className={index > 0 ? 'mt-2' : ''}>
        {line.startsWith('•') ? (
          <div className="flex gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span>{line.substring(1).trim()}</span>
          </div>
        ) : line.startsWith('**') && line.endsWith('**') ? (
          <strong className="font-semibold text-gray-900 dark:text-white">
            {line.replace(/\*\*/g, '')}
          </strong>
        ) : line.includes('**') ? (
          <span>
            {line.split('**').map((part, i) => 
              i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
            )}
          </span>
        ) : (
          <span>{line}</span>
        )}
      </div>
    ));
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-200px)]">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Health Assistant</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Get instant answers to your health questions</p>
        </div>

        {/* Frequent Questions - At top */}
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Quick Questions:</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {frequentQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(question)}
                className="flex-shrink-0 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors text-xs text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 whitespace-nowrap"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.type === 'assistant' && (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className={`max-w-[70%] px-4 py-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}>
                  <div className="text-sm">
                    {message.type === 'assistant' ? formatMessage(message.content) : message.content}
                  </div>
                  <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {typeof window !== 'undefined' && message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder="Type your health question..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
