import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartPulse, 
  Home as HomeIcon, 
  Users, 
  FolderOpen, 
  HelpCircle, 
  Menu, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Scale, 
  FileText, 
  Briefcase, 
  Home, 
  Scale as CourtIcon, 
  ShieldCheck, 
  Compass as CompassIcon,
  Sparkles,
  Info,
  X,
  CreditCard,
  Building2,
  GraduationCap
} from 'lucide-react';

import welcomeIcon from '../assets/onboarding/welcome_icon.png';
import { QUESTIONS, TOPIC_CONFIG } from '../../../web/src/data/questions';
import type { QACategory } from '../../../web/src/data/questions';

const CATEGORY_ICONS: Record<string, any> = {
  rights: Scale,
  case: FileText,
  court: CourtIcon,
  safety: ShieldCheck,
  corner: Users,
  documents: CreditCard,
  housing: Building2,
  turning18: Sparkles,
  benefits: Home,
  school: GraduationCap
};

const CATEGORY_TAGLINES: Record<string, string> = {
  rights: "Your legal guarantees.",
  case: "How the process works.",
  court: "Navigating hearings.",
  documents: "Identity & ID cards.",
  turning18: "Your independence plan.",
  housing: "Safe places to stay.",
};

export default function FindAnswersTeen({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<QACategory | 'all'>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const filteredQuestions = QUESTIONS.filter(q => {
    // Only show questions relevant to 16-17 or 18-21
    const isTeenRelevant = q.ageBands.includes('16-17') || q.ageBands.includes('18-21');
    const matchesCat = activeCategory === 'all' || q.category === activeCategory;
    const matchesSearch = q.question.en.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.answer.en.toLowerCase().includes(searchQuery.toLowerCase());
    return isTeenRelevant && matchesCat && matchesSearch;
  });

  return (
    <div className="flex w-full min-h-screen font-['Inter',_sans-serif] bg-[#FDFBF7] text-[#2d3748] overflow-x-hidden selection:bg-emerald-100/80">
      
      {/* 1. Desktop Sidebar */}
      <aside className="w-[300px] bg-[#1a2f44] text-white flex-shrink-0 hidden md:flex flex-col relative z-30 shadow-[4px_0_24px_rgba(0,0,0,0.05)]">
        <div className="p-10 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white shadow-[0_8px_20px_rgba(255,255,255,0.15)] rounded-2xl flex items-center justify-center overflow-hidden">
               <img src={welcomeIcon} alt="Logo" className="w-full h-full object-cover scale-[1.1] translate-y-1" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-black text-xl leading-tight tracking-tight">FosterHub</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-black">Arizona</span>
            </div>
          </div>
        </div>

        <nav className="flex flex-col px-6 gap-2 flex-1">
          {[
            { id: 'dashboard', icon: HomeIcon, label: 'Dashboard' },
            { id: 'case', icon: FolderOpen, label: 'My Case Explained' },
            { id: 'team', icon: Users, label: 'My Advocates' },
            { id: 'wellness', icon: HeartPulse, label: 'Mental Health' },
            { id: 'answers', icon: HelpCircle, label: 'Search Portal', active: true },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={`flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-500 group relative ${
                item.active 
                  ? 'bg-gradient-to-r from-white/15 to-transparent text-white font-bold shadow-[0_4px_12px_rgba(0,0,0,0.1)]' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white font-medium'
              }`}
            >
              <item.icon size={20} className={`shrink-0 transition-all duration-300 group-hover:scale-110 ${item.active ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]' : ''}`} />
              <span className="text-[15.5px] tracking-tight">{item.label}</span>
              {item.active && <motion.div layoutId="nav-pill" className="absolute left-0 w-1.5 h-8 bg-emerald-400 rounded-r-full shadow-[0_0_12px_rgba(52,211,153,0.8)]" />}
            </button>
          ))}
        </nav>

        <div className="p-8">
           <div className="w-full p-6 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 relative overflow-hidden group">
             <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full"></div>
             <CompassIcon size={20} className="text-emerald-400 mb-3" />
             <p className="text-white text-[13px] font-black leading-relaxed mb-1 tracking-tight">Search Portal</p>
             <p className="text-slate-400 text-[10px] leading-relaxed font-bold opacity-80 uppercase tracking-widest">Knowledge is Power</p>
           </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 overflow-y-auto relative w-full pb-24 md:pb-0 scroll-smooth">
        
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50/40 rounded-full blur-[140px] -z-10 translate-x-1/4 -translate-y-1/4 shadow-inner"></div>

        {/* Mobile Top Header */}
        <header className="md:hidden flex items-center justify-between px-6 py-6 sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
           <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center overflow-hidden shadow-lg border border-white/20">
                <img src={welcomeIcon} alt="Logo" className="w-full h-full object-cover scale-[1.1] translate-y-1" />
              </div>
              <span className="font-black text-[#1e293b] tracking-tight text-lg">FosterHub AZ</span>
           </div>
           <button className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-500 rounded-xl">
              <Menu size={20} />
           </button>
        </header>

        <main className="max-w-[1240px] mx-auto px-6 sm:px-12 py-10 sm:py-20">
          
          {/* Typographic Search Hero */}
          <div className="mb-20">
            <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-12 tracking-[-0.05em] leading-[0.9]">
               Knowledge Hub
            </h1>
            
            <div className="relative group max-w-3xl">
               <div className="absolute inset-x-0 bottom-[-20px] h-10 bg-black/5 blur-2xl rounded-full scale-95 opacity-50 group-hover:opacity-70 transition-opacity"></div>
               <div className="relative flex items-center">
                  <Search size={22} className="absolute left-7 text-emerald-500" strokeWidth={3} />
                  <input 
                    type="text" 
                    placeholder="Search your future. Topics, rights, or questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white rounded-[2rem] py-8 pl-18 pr-8 text-xl font-bold text-slate-800 shadow-[0_24px_48px_rgba(0,0,0,0.06)] border border-white focus:outline-none focus:ring-4 focus:ring-emerald-400/10 transition-all placeholder:text-slate-300 placeholder:font-medium"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-7 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
               </div>
            </div>
          </div>

          {/* Quick Filter Grid */}
          <div className="mb-20 overflow-visible">
            <div className="flex items-center justify-between mb-8 px-2">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Quick Topics</h3>
              <button 
                onClick={() => setActiveCategory('all')}
                className={`text-xs font-black uppercase tracking-widest transition-colors ${activeCategory === 'all' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Clear Filters
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
               {TOPIC_CONFIG.filter(t => t.bands.includes('16-17')).map((topic) => {
                 const Icon = CATEGORY_ICONS[topic.category] || FileText;
                 const isActive = activeCategory === topic.category;
                 return (
                   <button 
                     key={topic.category}
                     onClick={() => setActiveCategory(topic.category)}
                     className={`relative p-6 rounded-[2rem] border transition-all duration-500 flex flex-col items-center text-center group ${
                       isActive 
                         ? 'bg-white shadow-[0_12px_32px_rgba(0,0,0,0.05)] border-emerald-100 scale-105 z-10' 
                         : 'bg-transparent border-transparent text-slate-400 hover:bg-white/60 hover:border-slate-100'
                     }`}
                   >
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 ${
                       isActive ? 'bg-[#1a2f44] text-white shadow-lg rotate-12' : 'bg-slate-50 text-slate-300 group-hover:bg-white group-hover:text-slate-500'
                     }`}>
                        <Icon size={20} />
                     </div>
                     <span className={`text-[13px] font-black tracking-tight leading-none ${isActive ? 'text-slate-900' : ''}`}>
                       {topic.label.en}
                     </span>
                     {isActive && <motion.div layoutId="topic-dot" className="mt-2 w-1 h-1 bg-emerald-500 rounded-full" />}
                   </button>
                 );
               })}
            </div>
          </div>

          {/* Search Content Area */}
          <div className="grid lg:grid-cols-12 gap-16 items-start">
             
             {/* Question List */}
             <div className="lg:col-span-8 flex flex-col gap-4">
                {filteredQuestions.length === 0 ? (
                  <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold">No results found for "{searchQuery}"</p>
                  </div>
                ) : (
                  filteredQuestions.map((q) => {
                    const isOpen = openId === q.id;
                    const Icon = CATEGORY_ICONS[q.category] || FileText;
                    return (
                      <div 
                        key={q.id}
                        className={`transition-all duration-500 rounded-[2rem] border overflow-hidden ${
                          isOpen ? 'bg-white shadow-[0_24px_64px_rgba(0,0,0,0.03)] border-slate-100' : 'bg-transparent border-transparent hover:bg-white/60 hover:border-slate-100'
                        }`}
                      >
                        <button 
                          onClick={() => setOpenId(isOpen ? null : q.id)}
                          className="w-full flex items-center justify-between p-7 text-left group"
                        >
                           <div className="flex items-center gap-6">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                                isOpen ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300 group-hover:bg-white shadow-sm'
                              }`}>
                                 <Icon size={18} />
                              </div>
                              <span className={`text-lg font-bold tracking-tight pr-6 transition-colors ${isOpen ? 'text-slate-900' : 'text-slate-600'}`}>
                                {q.question.en}
                              </span>
                           </div>
                           <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 transition-transform ${isOpen ? 'rotate-180 bg-slate-900 text-white' : ''}`}>
                              <ChevronDown size={14} strokeWidth={3} />
                           </div>
                        </button>
                        
                        <AnimatePresence>
                           {isOpen && (
                             <motion.div 
                               initial={{ height: 0, opacity: 0 }}
                               animate={{ height: 'auto', opacity: 1 }}
                               exit={{ height: 0, opacity: 0 }}
                               className="overflow-hidden"
                             >
                                <div className="px-7 pb-10 pt-2 pl-[84px] pr-10">
                                   <p className="text-[#334155] text-lg font-medium leading-[1.8] tracking-tight mb-8">
                                     {q.answer.en}
                                   </p>
                                   
                                   <div className="flex flex-wrap items-center gap-4">
                                      {q.citations?.map((c, i) => (
                                        <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-400 tracking-wider">
                                           <Scale size={12} /> {c}
                                        </div>
                                      ))}
                                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-[10px] font-black text-emerald-600 tracking-wider uppercase">
                                         {TOPIC_CONFIG.find(t => t.category === q.category)?.label.en}
                                      </div>
                                   </div>
                                </div>
                             </motion.div>
                           )}
                        </AnimatePresence>
                      </div>
                    )
                  })
                )}
             </div>

             {/* Strategic Assistant Sidebar */}
             <div className="lg:col-span-4 sticky top-10 flex flex-col gap-6">
                
                {/* Advisor Panel */}
                <div className="bg-[#1a2f44] text-white p-10 rounded-[2.5rem] shadow-[0_24px_80px_rgba(0,0,0,0.15)] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/5 blur-3xl rounded-full"></div>
                   <div className="flex items-center gap-4 mb-8">
                      <div className="w-10 h-10 bg-white shadow-[0_12px_24px_rgba(255,255,255,0.1)] rounded-2xl flex items-center justify-center shrink-0">
                         <CompassIcon size={20} className="text-[#1a2f44]" strokeWidth={3} />
                      </div>
                      <h4 className="font-black text-lg tracking-tight">Strategic Advisor</h4>
                   </div>
                   
                   <p className="text-slate-300 text-sm font-bold leading-relaxed mb-10 pl-4 border-l-2 border-emerald-400">
                      "Knowledge is your strongest currency. When you understand the law, adults have to listen to you. Focus on your rights first."
                   </p>
                   
                   <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-2">Pro Tip No.1</span>
                        <p className="text-xs font-bold leading-relaxed text-slate-100 opacity-90">Always ask your lawyer for a copy of the actual statute discussed in court.</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-2">Pro Tip No.2</span>
                        <p className="text-xs font-bold leading-relaxed text-slate-100 opacity-90">If a decision affects your rights, it must be documented in writing.</p>
                      </div>
                   </div>
                </div>

                {/* Resource Callout */}
                <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-10 border border-white shadow-sm flex flex-col items-center text-center">
                   <Info size={30} className="text-slate-400 mb-6" />
                   <h5 className="font-black text-[#1e293b] mb-4 tracking-tight">Need specific advice?</h5>
                   <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                      Remember that these answers are general guidance. Your lawyer is the only one who can give you legal advice specific to your case.
                   </p>
                   <button 
                     onClick={() => onNavigate?.('team')}
                     className="w-full py-4 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all hover:scale-105"
                   >
                     Message Lawyer
                   </button>
                </div>
             </div>
          </div>

          {/* Footer Quote */}
          <div className="mt-40 text-center py-20 border-t border-slate-100">
             <div className="max-w-xl mx-auto">
               <span className="text-3xl italic font-black text-slate-200 block mb-8">"</span>
               <p className="text-2xl font-black text-[#1e293b] tracking-tight leading-tight mb-8">
                 You have the right to a clear future. The more you know, the stronger that future becomes.
               </p>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Kindred Path • Arizona</span>
             </div>
          </div>

        </main>
      </div>
    </div>
  );
}
