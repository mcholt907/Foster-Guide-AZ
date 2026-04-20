import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  UserCircle2, 
  Scale, 
  Briefcase, 
  HeartHandshake, 
  Shield, 
  Users,
  FolderOpen,
  HeartPulse,
  HelpCircle,
  Home as HomeIcon,
  Sparkles,
  Info,
  ArrowRight,
  ShieldCheck,
  Menu,
  CheckCircle2,
  Clock,
  Calendar,
  Zap
} from 'lucide-react';
import welcomeIcon from '../assets/onboarding/welcome_icon.png';

const CASE_STAGES = [
  {
    id: "prelim",
    title: "First Safety Hearing",
    subtitle: "Preliminary Protective Hearing",
    icon: ShieldCheck,
    color: "emerald",
    what: "The judge checks if you're safe and decides what happens right away — usually within just a few days of coming into care.",
    teen: "This is often a fast-paced hearing. Your lawyer's primary job is to ensure you are in the safest, least restrictive placement possible.",
    insight: "Before it starts, tell your lawyer exactly where you want to live. Even if it's with a relative or a friend's family, they need to advocate for your preference.",
    next: "Dates for the next hearings are set."
  },
  {
    id: "adjudication",
    title: "The Facts Hearing",
    subtitle: "Adjudication",
    icon: Scale,
    color: "indigo",
    what: "The court decides if the concerns in your case are proven and whether the state (DCS) needs to stay involved.",
    teen: "This is a critical legal milestone. If the judge 'adjudicates' you dependent, the court gain authority over where you live and what services you receive.",
    insight: "Ask your lawyer: 'How does this decision affect my school stability and my right to work?' If you're 16+, your education plan should be a priority.",
    next: "Your case plan and services get reviewed and updated."
  },
  {
    id: "review",
    title: "The Check-In Hearing",
    subtitle: "Review Hearing",
    icon: Calendar,
    color: "blue",
    what: "The judge checks in on how your plan is going, how your family is doing, and what needs to change.",
    teen: "As a teen, these are your best opportunities to update the judge on your progress toward independence.",
    insight: "Come with 1–2 specific updates: what's working (like a job or a school club) and what isn't (like needing more driver's ed). Documenting these makes them real for the court.",
    next: "More check-ins are scheduled, or you move toward a long-term plan."
  },
  {
    id: "permanency",
    title: "Long-Term Plan Hearing",
    subtitle: "Permanency Hearing",
    icon: Zap,
    color: "rose",
    what: "The judge discusses the long-term plan for your future — like going home, guardianship, or transitioning to adulthood.",
    teen: "For older youth, this hearing is essentially your 'launch plan.' It's where the court formalizes what happens when you turn 18.",
    insight: "Arizona law requires a transition plan for all youth 16 and older. If your hearing doesn't mention 'Independent Living' or 'Extended Care' options, remind your attorney to bring it up.",
    next: "Everyone takes final steps toward your long-term plan."
  }
];

const FAQS = [
  {
    q: "Do I have to go to court?",
    a: "Usually yes — but your lawyer will tell you what to expect ahead of time. You won't be alone. Your lawyer goes with you, and as a teen, being present is the best way to ensure your 'best interests' actually match your 'wishes'."
  },
  {
    q: "Can I talk to the judge?",
    a: "Yes! You have a legal right to address the judge. You can speak up during the hearing, submit a written statement beforehand, or ask for an 'in-chambers' meeting with just you and the judge."
  },
  {
    q: "What if I don't understand the legal words?",
    a: "Stop the hearing and ask your lawyer to explain. You have the right to understand every decision being made about your life. There are no 'dumb questions' in court."
  }
];

const THEMES: Record<string, { primary: string; secondary: string; light: string; accent: string; shadow: string }> = {
  emerald: {
    primary: '#115e59',
    secondary: '#065f46',
    light: 'rgba(209, 250, 229, 0.4)',
    accent: '#34d399',
    shadow: 'rgba(17, 94, 89, 0.15)'
  },
  indigo: {
    primary: '#4338ca',
    secondary: '#3730a3',
    light: 'rgba(238, 242, 255, 0.5)',
    accent: '#818cf8',
    shadow: 'rgba(67, 56, 202, 0.15)'
  },
  blue: {
    primary: '#1d4ed8',
    secondary: '#1e40af',
    light: 'rgba(239, 246, 255, 0.5)',
    accent: '#60a5fa',
    shadow: 'rgba(29, 78, 216, 0.15)'
  },
  rose: {
    primary: '#be123c',
    secondary: '#9f1239',
    light: 'rgba(255, 241, 242, 0.5)',
    accent: '#fb7185',
    shadow: 'rgba(190, 18, 60, 0.15)'
  }
};

export default function MyCaseExplainedTeen({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const [openStage, setOpenStage] = useState<string>("prelim");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const activeStage = CASE_STAGES.find(s => s.id === openStage) || CASE_STAGES[0];
  const theme = THEMES[activeStage.color];

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
            { id: 'case', icon: FolderOpen, label: 'My Case Explained', active: true },
            { id: 'team', icon: Users, label: 'My Advocates' },
            { id: 'wellness', icon: HeartPulse, label: 'Mental Health' },
            { id: 'answers', icon: HelpCircle, label: 'Search Portal' },
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
             <Sparkles size={20} className="text-emerald-400 mb-3" />
             <p className="text-white text-[13px] font-black leading-relaxed mb-1 tracking-tight">Legal Roadmap</p>
             <p className="text-slate-400 text-[10px] leading-relaxed font-bold opacity-80 uppercase tracking-widest">Navigating Your Case</p>
           </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 overflow-y-auto relative w-full pb-24 md:pb-0 scroll-smooth">
        
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-100/50 rounded-full blur-[140px] -z-10 translate-x-1/4 -translate-y-1/4 shadow-inner"></div>

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
          
          {/* Typographic Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-14 md:mb-24"
          >
            <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-8 tracking-[-0.05em] leading-[0.9]">
              Your Legal Roadmap
            </h1>
            <p className="text-slate-500 text-lg sm:text-xl font-medium max-w-2xl leading-[1.6] tracking-tight border-l-[3px] border-slate-200 pl-8">
               Understanding exactly what happens in court is your fundamental right. This is your step-by-step guide to the legal journey ahead.
            </p>
          </motion.div>

          {/* Timeline Grid */}
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12">
            
            {/* Stage Nav */}
            <div className="lg:col-span-4 space-y-3">
               {CASE_STAGES.map((stage, idx) => {
                 const isActive = openStage === stage.id;
                 const stageTheme = THEMES[stage.color];
                 return (
                   <button 
                     key={stage.id}
                     onClick={() => setOpenStage(stage.id)}
                     className={`w-full flex items-center gap-5 p-5 rounded-[1.5rem] transition-all duration-500 text-left border-2 group ${
                       isActive 
                         ? 'bg-white shadow-[0_12px_44px_rgba(0,0,0,0.04)] z-10' 
                         : 'bg-transparent border-transparent text-slate-400 hover:bg-white/60'
                     }`}
                     style={isActive ? { borderColor: `${stageTheme.primary}15` } : {}}
                   >
                     <div className={`w-11 h-11 rounded-[1.1rem] flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-105 ${isActive ? 'shadow-lg' : ''}`}
                          style={{ backgroundColor: isActive ? stageTheme.primary : 'rgba(241, 245, 249, 0.8)', color: isActive ? 'white' : 'currentColor' }}>
                        <stage.icon size={20} weight={isActive ? "bold" : "regular"} />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-0.5">Stage 0{idx + 1}</span>
                        <span className={`text-[15.5px] font-black tracking-tight leading-none ${isActive ? 'text-slate-900' : ''}`}>
                          {stage.title}
                        </span>
                     </div>
                     {isActive && <motion.div layoutId="roadmap-arrow" className="ml-auto transform"><ArrowRight size={18} style={{ color: stageTheme.accent }} /></motion.div>}
                   </button>
                 );
               })}
            </div>

            {/* Stage Detail Card */}
            <div className="lg:col-span-8">
               <AnimatePresence mode="wait">
                  <motion.div 
                    key={openStage}
                    initial={{ opacity: 0, scale: 0.98, x: 10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.98, x: -10 }}
                    className="bg-white rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-14 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-white relative overflow-hidden min-h-[600px]"
                  >
                    {/* Architectural Accents */}
                    <div className="absolute left-0 top-0 bottom-0 w-[6px] rounded-r-full"
                         style={{ background: `linear-gradient(to bottom, ${theme.accent}, ${theme.primary})` }}></div>
                    <div className="absolute top-0 right-0 w-80 h-80 rounded-bl-full pointer-events-none opacity-20"
                         style={{ backgroundColor: theme.light }}></div>

                    <div className="relative z-10">
                       <h2 className="text-3xl sm:text-4xl font-black text-[#1e293b] mb-2 tracking-tighter">
                          {activeStage.title}
                       </h2>
                       <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-12">{activeStage.subtitle}</p>

                       <section className="space-y-12">
                         {/* Core Explanation */}
                         <div className="flex gap-6 items-start">
                           <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 bg-white shadow-sm"
                                style={{ color: theme.primary }}>
                             <Info size={20} />
                           </div>
                           <div>
                             <h4 className="text-[12px] font-black uppercase tracking-widest text-slate-400 mb-2">Legal Context</h4>
                             <p className="text-[#1e293b] text-base sm:text-lg font-medium leading-[1.8] tracking-tight max-w-2xl">
                               {activeStage.what}
                             </p>
                           </div>
                         </div>

                         {/* Teen Specific Focus */}
                         <div className="flex gap-6 items-start">
                           <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 bg-white shadow-sm text-amber-500">
                             <Zap size={20} />
                           </div>
                           <div>
                             <h4 className="text-[12px] font-black uppercase tracking-widest text-[#b45309] opacity-60 mb-2">Teen Perspective</h4>
                             <p className="text-[#334155] text-base sm:text-lg font-medium leading-[1.8] tracking-tight max-w-2xl">
                               {activeStage.teen}
                             </p>
                           </div>
                         </div>

                         {/* Strategic Insight Box */}
                         <div className="p-8 rounded-[2rem] border relative overflow-hidden"
                              style={{ backgroundColor: theme.light, borderColor: `${theme.primary}10` }}>
                            <div className="flex gap-5 items-start relative z-10">
                               <div className="mt-1 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white text-slate-900 shadow-sm"
                                    style={{ color: theme.primary }}>
                                 <ArrowRight size={18} strokeWidth={3} />
                               </div>
                               <div>
                                 <span className="text-[10px] font-black uppercase tracking-[0.25em] mb-2 block opacity-60">Strategic Action</span>
                                 <p className="text-base sm:text-lg font-black leading-tight tracking-tight"
                                    style={{ color: theme.primary }}>
                                   {activeStage.insight}
                                 </p>
                               </div>
                            </div>
                         </div>

                         {/* Next Steps Footer */}
                         <div className="pt-10 border-t border-slate-50 flex items-center gap-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
                            <Clock size={16} /> Next: {activeStage.next}
                         </div>
                       </section>
                    </div>
                  </motion.div>
               </AnimatePresence>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="mt-24 sm:mt-40 max-w-3xl mx-auto py-20 border-t border-slate-100">
             <div className="text-center mb-16">
                <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-8" />
                <h2 className="text-3xl sm:text-4xl font-black text-[#1e293b] tracking-tight mb-4">Common Questions</h2>
                <p className="text-slate-500 font-medium">Clear answers for complex legal moments.</p>
             </div>

             <div className="space-y-4">
                {FAQS.map((faq, idx) => {
                  const isOpen = openFAQ === idx;
                  return (
                    <div 
                      key={idx} 
                      className={`transition-all duration-500 rounded-[1.75rem] border ${
                        isOpen ? 'bg-white shadow-[0_20px_48px_rgba(0,0,0,0.03)] border-slate-200' : 'bg-transparent border-transparent hover:bg-slate-50'
                      }`}
                    >
                      <button 
                        onClick={() => setOpenFAQ(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between px-8 py-6 text-left"
                      >
                        <span className={`text-[17px] font-black pr-6 transition-all tracking-tight leading-tight ${isOpen ? 'text-slate-900' : 'text-slate-500'}`}>
                          {faq.q}
                        </span>
                        <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                          isOpen ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {isOpen ? <ChevronUp size={16} strokeWidth={3} /> : <ChevronDown size={16} strokeWidth={3} />}
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
                            <div className="px-8 pb-8 pt-2">
                               <p className="text-slate-500 text-base leading-relaxed tracking-tight font-medium">
                                 {faq.a}
                               </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
             </div>

             <div className="mt-20 p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center gap-6 justify-between text-center sm:text-left">
                <div className="flex gap-4 items-center">
                   <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400">
                      <Scale size={24} />
                   </div>
                   <div>
                      <h4 className="font-black text-sm text-slate-900 uppercase tracking-tight">Legal Notice</h4>
                      <p className="text-[11px] font-bold text-slate-400 leading-tight">This is general guidance, not professional legal advice.</p>
                   </div>
                </div>
                <button className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-widest border-b-2 border-slate-900 pb-1 hover:gap-4 transition-all">
                   Contact DCS Ombudsman <ArrowRight size={14} />
                </button>
             </div>
          </section>
        </main>
      </div>
    </div>
  );
}
