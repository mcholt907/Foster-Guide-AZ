import { useState } from 'react';
import {
  ChevronLeft, Search, BookOpen, ChevronDown, ChevronUp, Scale,
  MapPin, AlertCircle, FileText, Home, Users, DollarSign, Briefcase, Info, X, HelpCircle
} from 'lucide-react';

// Import actual data from the web project
import { QUESTIONS, TOPIC_CONFIG } from '../../../web/src/data/questions';
import type { QACategory } from '../../../web/src/data/questions';

// Importing the generated compass avatar
import compassAvatar from '../assets/compass_avatar.png';

interface Props {
  onBack?: () => void;
}

export default function FindAnswersPrototype({ onBack }: Props = {}) {
  const [activeCategory, setActiveCategory] = useState<QACategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  // Helper to toggle accordion
  const toggleAccordion = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
         next.delete(id);
      } else {
         next.add(id);
      }
      return next;
    });
  };

  // Helper for category styling mapped to kindred path
  const getCategoryStyles = (cat: QACategory) => {
    switch (cat) {
      case 'rights': return 'bg-[#A3E8B5] text-[#2D5A3C]'; // Green
      case 'case': return 'bg-[#D6E6F5] text-[#2C4A6B]'; // Blue
      case 'court': return 'bg-[#F5DCA1] text-[#6B501B]'; // Yellow
      case 'safety': return 'bg-[#F5D0DD] text-[#703043]'; // Rose
      case 'corner': return 'bg-[#E3D6F5] text-[#4A3270]'; // Purple
      case 'documents': return 'bg-[#D0DDF5] text-[#2C3B6B]'; // Indigo
      case 'housing': return 'bg-[#F5DFCD] text-[#704A2C]'; // Amber
      case 'turning18': return 'bg-[#F5D0A1] text-[#70401B]'; // Orange
      case 'benefits': return 'bg-[#D6F5E3] text-[#2D6B40]'; // Mint
      case 'school': return 'bg-[#DDF5D0] text-[#3B6B2C]'; // Lime
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getCategoryIcon = (cat: QACategory) => {
     switch (cat) {
        case 'rights': return <Scale size={16} />;
        case 'case': return <BookOpen size={16} />;
        case 'court': return <AlertCircle size={16} />;
        case 'safety': return <MapPin size={16} />;
        case 'corner': return <Users size={16} />;
        case 'documents': return <FileText size={16} />;
        case 'housing': return <Home size={16} />;
        case 'turning18': return <Users size={16} />;
        case 'benefits': return <DollarSign size={16} />;
        case 'school': return <Briefcase size={16} />;
        default: return <Info size={16} />;
     }
  }

  // Filter questions based on category & search
  const filteredQuestions = QUESTIONS.filter(q => {
    const matchesCat = activeCategory === 'all' || q.category === activeCategory;
    const matchesSearch = q.question.en.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.answer.en.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full bg-[#FFF9F3] min-h-screen font-['Outfit',_sans-serif] flex justify-center">
      <div className="w-full max-w-[480px] bg-[#FFF9F3] relative flex flex-col shadow-xl">
        
        {/* Top Header */}
        <div className="px-4 py-4 flex items-center gap-3 sticky top-0 bg-[#FFF9F3]/90 backdrop-blur-md z-30 font-['Outfit',_sans-serif]">
          {onBack && (
            <button
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors shrink-0"
              aria-label="Back to home"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
          )}
          <h1 className="text-lg font-bold text-[#2D5A3C] tracking-tight flex-1">Find Answers</h1>
          <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg">
            <FileText size={18} className="text-gray-500" />
          </div>
        </div>

        <div className="px-4 pb-24 space-y-6">
          {/* Hero Banner Area */}
          <div className="bg-gradient-to-br from-[#E6F8EA] to-[#D5F2DB] rounded-[32px] p-6 relative overflow-hidden group">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
               <div className="w-12 h-12 bg-[#82D99E] rounded-full flex items-center justify-center mb-1">
                 <HelpCircle className="text-white" size={24} />
               </div>
               <h2 className="text-2xl font-bold text-[#1A4226]">Find Answers</h2>
               <p className="text-[#3A6B4B] text-sm leading-relaxed px-4">
                 You have rights. Here's what they mean for you.
               </p>
            </div>
          </div>

          {/* Compass Character Card */}
          <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex items-start space-x-4">
             <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center shadow-inner shrink-0 overflow-hidden border border-blue-100">
                <img src={compassAvatar} alt="Compass" className="w-10 h-10 object-contain" />
             </div>
             <div className="pt-1">
                <div className="text-blue-900 font-bold mb-1">Hi, I'm Compass.</div>
                <div className="text-gray-500 text-sm leading-relaxed">
                  Here to help you find real answers. Being in foster care can feel really confusing... just tap a topic or search what's on your mind.
                </div>
             </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search for anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#EAE2D7]/50 placeholder:text-gray-500 text-gray-800 rounded-full py-4 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-[#A3E8B5] transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                 <X size={16} />
              </button>
            )}
          </div>

          {/* Categories Pill list */}
          <div>
            <h3 className="text-gray-800 font-bold mb-3 px-2">Top Questions</h3>
            <div className="flex overflow-x-auto space-x-3 pb-2 px-2 scrollbar-hide">
              <button 
                onClick={() => setActiveCategory('all')}
                className={`flex shrink-0 items-center space-x-2 px-4 py-2.5 rounded-full transition-colors ${activeCategory === 'all' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 shadow-sm'}`}
              >
                <span className="text-sm font-semibold">All Topics</span>
              </button>
              {TOPIC_CONFIG.map(topic => {
                const isActive = activeCategory === topic.category;
                const styleObj = getCategoryStyles(topic.category);
                
                return (
                  <button
                    key={topic.category}
                    onClick={() => setActiveCategory(topic.category)}
                    className={`flex shrink-0 items-center space-x-2 px-4 py-2.5 rounded-full transition-all ${
                      isActive ? styleObj + ' shadow-md scale-105' : 'bg-white text-gray-600 shadow-sm hover:bg-gray-50'
                    }`}
                  >
                    {getCategoryIcon(topic.category)}
                    <span className="text-sm font-semibold">{topic.label.en}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-3">
             {filteredQuestions.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                   No questions found. Try another search.
                </div>
             )}
             {filteredQuestions.map(q => {
               const isOpen = openIds.has(q.id);
               const styleObj = getCategoryStyles(q.category);
               
               return (
                 <div key={q.id} className="bg-white/80 rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-300">
                   <button 
                     onClick={() => toggleAccordion(q.id)}
                     className="w-full flex items-center justify-between p-5 text-left"
                   >
                     <div className="flex items-center space-x-4">
                       <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${styleObj}`}>
                          {getCategoryIcon(q.category)}
                       </div>
                       <span className={`font-semibold text-[15px] pr-2 ${isOpen ? 'text-gray-900' : 'text-gray-700'}`}>
                         {q.question.en}
                       </span>
                     </div>
                     <div className="text-gray-400 shrink-0">
                       {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                     </div>
                   </button>
                   
                   {isOpen && (
                     <div className="px-5 pb-6 pt-1 pl-[76px] pr-5 flex flex-col space-y-4">
                       <p className="text-sm text-gray-600 leading-relaxed">
                         {q.answer.en}
                       </p>
                       
                       {/* Categories and actions inside answer */}
                       <div className="flex items-center space-x-2 pt-2">
                           <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${styleObj}`}>
                             {TOPIC_CONFIG.find(t => t.category === q.category)?.label.en}
                           </span>
                       </div>
                     </div>
                   )}
                 </div>
               )
             })}
          </div>

          {/* Disclaimer Footer Card */}
          <div className="mt-8 bg-blue-50/50 rounded-[28px] p-6 border border-blue-100/50">
             <div className="flex items-center space-x-2 text-blue-800 font-bold mb-3 text-xs tracking-wider uppercase">
               <Info size={14} />
               <span>Just So You Know</span>
             </div>
             <p className="text-gray-500 text-sm italic leading-relaxed">
                This information is here to help you understand your rights, but it isn't legal advice. Every person's situation is a little different. If you have a specific question about your case, it's always good to talk to your lawyer or caseworker.
             </p>
          </div>

          {/* Footer branding */}
          <div className="text-center pb-8 pt-4">
              <p className="text-gray-400 text-xs mt-2">
                Kindred Path • You are safe and supported.
              </p>
              <div className="flex items-center justify-center space-x-4 mt-3">
                 <button className="text-[#6EA885] text-xs hover:underline">Privacy Policy</button>
                 <button className="text-[#6EA885] text-xs hover:underline">Help Center</button>
              </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
