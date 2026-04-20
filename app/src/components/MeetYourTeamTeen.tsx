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
  CheckCircle2
} from 'lucide-react';
import welcomeIcon from '../assets/onboarding/welcome_icon.png';

const ROLE_THEMES: Record<string, { primary: string; secondary: string; light: string; accent: string; shadow: string }> = {
  emerald: {
    primary: '#115e59', // teal-900ish
    secondary: '#065f46',
    light: 'rgba(209, 250, 229, 0.4)', // emerald-50
    accent: '#34d399', // emerald-400
    shadow: 'rgba(17, 94, 89, 0.15)'
  },
  indigo: {
    primary: '#4338ca', // indigo-700
    secondary: '#3730a3',
    light: 'rgba(238, 242, 255, 0.5)', // indigo-50
    accent: '#818cf8', // indigo-400
    shadow: 'rgba(67, 56, 202, 0.15)'
  },
  blue: {
    primary: '#1d4ed8', // blue-700
    secondary: '#1e40af',
    light: 'rgba(239, 246, 255, 0.5)', // blue-50
    accent: '#60a5fa', // blue-400
    shadow: 'rgba(29, 78, 216, 0.15)'
  },
  rose: {
    primary: '#be123c', // rose-700
    secondary: '#9f1239',
    light: 'rgba(255, 241, 242, 0.5)', // rose-50
    accent: '#fb7185', // rose-400
    shadow: 'rgba(190, 18, 60, 0.15)'
  },
  amber: {
    primary: '#b45309', // amber-700
    secondary: '#92400e',
    light: 'rgba(255, 251, 235, 0.5)', // amber-50
    accent: '#fbbf24', // amber-400
    shadow: 'rgba(180, 83, 9, 0.15)'
  },
  cyan: {
    primary: '#0891b2', // cyan-600
    secondary: '#155e75',
    light: 'rgba(236, 254, 255, 0.5)', // cyan-50
    accent: '#22d3ee', // cyan-400
    shadow: 'rgba(8, 145, 178, 0.15)'
  },
  slate: {
    primary: '#334155', // slate-700
    secondary: '#1e293b',
    light: 'rgba(248, 250, 252, 0.5)', // slate-50
    accent: '#94a3b8', // slate-400
    shadow: 'rgba(51, 65, 85, 0.15)'
  }
};

const WHO_IN_YOUR_CASE = [
  {
    id: "caseworker",
    title: "Your DCS Case Manager",
    short: "Caseworker",
    aka: "Also called: caseworker",
    icon: UserCircle2,
    color: "emerald",
    role: "Your main point of contact at the Department of Child Safety (DCS).",
    what: "They manage your case day-to-day — writing your case plan, scheduling visits, and connecting you to services. By law they're supposed to meet with you at least once a month in person.",
    tip: "Keep their number saved. If something feels wrong or isn't happening, they're your first call.",
  },
  {
    id: "judge",
    title: "The Judge",
    short: "Judge",
    aka: "Also called: dependency court judge",
    icon: Scale,
    color: "indigo",
    role: "Makes the big legal decisions about your case — including where you live.",
    what: "A Superior Court judge oversees your dependency case. They approve your case plan, decide placement, and make the final call at every hearing. You have the right to speak at hearings — your voice counts.",
    tip: "You can tell the judge how you feel, what you want, and what's not working — through your attorney or by asking to address the court directly.",
  },
  {
    id: "attorney",
    title: "Your Attorney",
    short: "Attorney",
    aka: "Also called: your lawyer",
    icon: Briefcase,
    color: "blue",
    role: "Represents only you — not DCS (the state), not your parents, not the foster family.",
    what: "Arizona law gives every youth in foster care the right to an attorney. They go to court with you, explain what's happening, and argue for what you want. Everything you tell them stays private.",
    tip: "Be honest with your attorney — they can only fight for you if they know what's really going on. If you don't have one, ask your caseworker immediately.",
  },
  {
    id: "casa",
    title: "CASA Volunteer",
    short: "CASA",
    aka: "Court Appointed Special Advocate",
    icon: HeartHandshake,
    color: "rose",
    role: "A trained community volunteer who gets to know you personally and speaks up for you in court.",
    what: "Unlike your caseworker, a CASA has one job: figure out what's best for you and tell the judge. They visit you regularly, read your full case file, and write a report for the court. Not everyone has one — but you can request one.",
    tip: "CASA volunteers are not DCS employees. They chose to be there for kids. They tend to have more time for you than a caseworker does.",
  },
  {
    id: "caregiver",
    title: "Foster Parent / Caregiver",
    short: "Caregiver",
    aka: "Also called: foster family, house manager, staff",
    icon: HomeIcon,
    color: "amber",
    role: "The adult(s) responsible for your day-to-day care — in a foster home, kinship home, or group home.",
    what: "Foster parents and kinship caregivers are licensed or approved by DCS to provide a home. If you live in a group home, a House Manager (also called a house parent or staff) fills that role — they're employed by the group home agency, not DCS. A kinship caregiver is a relative or someone you already knew. None of them are your caseworker, but they're responsible for your safety and daily needs.",
    tip: "If you ever feel unsafe where you're living — whether a foster home or group home — tell your caseworker, attorney, or CASA right away. You have the right to be safe.",
  },
  {
    id: "gal",
    title: "Guardian ad Litem",
    short: "GAL",
    aka: "Sometimes the same person as your attorney",
    icon: Shield,
    color: "cyan",
    role: "Someone appointed by the court specifically to represent your best interests.",
    what: "In some cases the court appoints a GAL who is separate from your attorney. They look at your whole situation — school, health, placement, relationships — and advise the judge. In Arizona, this role is sometimes filled by your attorney or your CASA.",
    tip: "Ask your attorney or caseworker if you have a GAL and who they are.",
  },
  {
    id: "supervisor",
    title: "DCS Supervisor",
    short: "Supervisor",
    aka: "Your caseworker's boss",
    icon: Users,
    color: "slate",
    role: "Your caseworker's boss at DCS. Who you can talk to if things aren't getting fixed.",
    what: "If you've raised a concern with your caseworker and nothing is changing, ask to speak with their supervisor. Keep a written record of when you asked and what was said — dates matter.",
    tip: "Asking to escalate is normal and OK. The system is designed for it. You won't get in trouble for asking.",
  },
];

const FAQS = [
  {
    q: "Can I talk directly to the judge?",
    a: "Yes, you have the right to address the judge. You can speak to them in court or request an in-chambers meeting. Your lawyer is responsible for helping you arrange this."
  },
  {
    q: "Who should I contact if I feel unsafe?",
    a: "Reach out to your Caseworker, CASA Volunteer, or Attorney immediately. Their primary legal obligation is to ensure you are in a safe environment."
  },
  {
    q: "What if it's not working out?",
    a: "Inform your Caseworker and your Lawyer. They are obligated to listen to your concerns and advocate for a transition plan if the environment is not suitable."
  }
];

export default function MeetYourTeamTeen({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const [openMember, setOpenMember] = useState<string>("caseworker");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        const activeElement = scrollRef.current.querySelector('[data-active="true"]');
        if (activeElement) {
            activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }
  }, [openMember]);

  const activeMember = WHO_IN_YOUR_CASE.find(m => m.id === openMember) || WHO_IN_YOUR_CASE[0];
  const activeTheme = ROLE_THEMES[activeMember.color] || ROLE_THEMES.emerald;

  return (
    <div className="flex w-full min-h-screen font-['Inter',_sans-serif] bg-[#FDFBF7] text-[#2d3748] overflow-x-hidden selection:bg-emerald-100/80">
      
      {/* Utility Styles */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .glass-panel { 
            background: rgba(255, 255, 255, 0.7); 
            backdrop-filter: blur(12px); 
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.4);
        }
      `}</style>
      
      {/* 1. Desktop Sidebar (Hidden on Mobile) */}
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
            { id: 'team', icon: Users, label: 'My Advocates', active: true },
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
             <p className="text-white text-[13px] font-black leading-relaxed mb-1 tracking-tight">Professional Support</p>
             <p className="text-slate-400 text-[10px] leading-relaxed font-bold opacity-80 uppercase tracking-widest">Guidance for Your Future</p>
           </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 overflow-y-auto relative w-full pb-24 md:pb-0 scroll-smooth">
        
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50/50 rounded-full blur-[140px] -z-10 translate-x-1/4 -translate-y-1/4 animate-pulse duration-[10s]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-50/50 rounded-full blur-[120px] -z-10 -translate-x-1/4 translate-y-1/4"></div>

        {/* Mobile Top Header */}
        <header className="md:hidden flex items-center justify-between px-6 py-6 glass-panel sticky top-0 z-40 border-b border-[#115e59]/5 backdrop-blur-xl">
           <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center overflow-hidden shadow-lg border border-white/20">
                <img src={welcomeIcon} alt="Logo" className="w-full h-full object-cover scale-[1.1] translate-y-1" />
              </div>
              <span className="font-black text-[#1e293b] tracking-tight text-lg">FosterHub AZ</span>
           </div>
           <button className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-xl transition-all shadow-sm border border-slate-200">
              <Menu size={20} />
           </button>
        </header>

        <main className="max-w-[1240px] mx-auto px-6 sm:px-12 py-10 sm:py-20">
          
          {/* Typographic Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-14 md:mb-20"
          >
            <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-8 tracking-[-0.05em] leading-[0.9] sm:leading-[0.85] decoration-emerald-200 decoration-8 underline-offset-[-2px]">
              Who's in your case?
            </h1>
            <p className="text-slate-500 text-lg sm:text-xl font-medium max-w-2xl leading-[1.6] tracking-tight border-l-[3px] border-emerald-100 pl-8">
               Your professional network is built to secure your safety and uphold your legal rights during your transition.
            </p>
          </motion.div>

          <div className="flex flex-col gap-10">
            
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10">
              
              {/* Member Selection: Mobile Horizontal Hub / Desktop Vertical Grid */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-4 -mx-6 px-6 md:mx-0 md:px-0"
              >
                <div 
                  ref={scrollRef}
                  className="flex lg:flex-col gap-3.5 overflow-x-auto lg:overflow-x-visible pb-6 md:pb-0 no-scrollbar snap-x scroll-px-6 lg:max-h-[700px] lg:pr-2"
                >
                  {WHO_IN_YOUR_CASE.map((member, index) => {
                    const isActive = openMember === member.id;
                    const theme = ROLE_THEMES[member.color] || ROLE_THEMES.emerald;
                    return (
                      <motion.button 
                        key={member.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        data-active={isActive}
                        onClick={() => setOpenMember(member.id)}
                        className={`snap-center flex-shrink-0 flex items-center gap-4 p-4.5 sm:p-5 rounded-[1.5rem] transition-all duration-500 text-left relative group ${
                          isActive 
                            ? 'bg-white transform scale-[1.02] z-10' 
                            : 'bg-white/40 glass-panel border-transparent border-2 text-slate-500 hover:bg-white hover:border-slate-200'
                        }`}
                        style={isActive ? { 
                            boxShadow: `0 12px 44px ${theme.shadow}`,
                            borderColor: `${theme.primary}20`,
                            borderWidth: '2px'
                        } : {}}
                      >
                        <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-[1.1rem] flex items-center justify-center transition-all duration-500 shrink-0`}
                             style={isActive ? { 
                                 backgroundColor: theme.primary,
                                 color: 'white',
                                 boxShadow: `0 8px 16px ${theme.shadow.replace('0.15', '0.4')}`
                             } : { backgroundColor: 'rgba(241, 245, 249, 0.8)' }}>
                          <member.icon size={20} sm:size={22} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <div className="flex flex-col">
                           <span className={`text-[15.5px] font-black tracking-tight leading-none transition-colors`}
                                 style={{ color: isActive ? theme.primary : '#334155' }}>
                             {member.short}
                           </span>
                        </div>
                        {isActive && <motion.div layoutId="active-arrow" className="ml-auto hidden lg:block"><ArrowRight size={18} style={{ color: theme.accent }} /></motion.div>}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {/* 4. Architectural Bio Content Card */}
              <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={openMember}
                    initial={{ opacity: 0, x: 20, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                    className="bg-white rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-14 shadow-[0_32px_80px_rgba(17,94,89,0.06)] border border-white relative overflow-hidden flex flex-col min-h-[600px] group"
                    style={{ boxShadow: `0 32px 80px ${activeTheme.shadow.replace('0.15', '0.1')}` }}
                  >
                    {/* Modern Architectural Accents */}
                    <motion.div 
                        layoutId="active-stripe"
                        className="absolute left-0 top-0 bottom-0 w-[6px] sm:w-[8px] rounded-r-full"
                        style={{ background: `linear-gradient(to bottom, ${activeTheme.accent}, ${activeTheme.primary})` }}
                    />
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-bl-[100%] transition-transform duration-1000 group-hover:scale-110 pointer-events-none -z-0"
                         style={{ backgroundColor: activeTheme.light }}></div>

                    <div className="flex items-start justify-between mb-12 relative z-10 w-full">
                      <div className="max-w-md">
                        <h2 className="text-2xl sm:text-3xl font-black text-[#1e293b] mb-3 tracking-tighter leading-tight">
                           {activeMember.title}
                        </h2>
                        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{activeMember.aka}</p>
                      </div>
                      
                      {/* Glass Profile Frame */}
                      <div className="shrink-0 w-16 h-16 sm:w-24 sm:h-24 bg-white/70 backdrop-blur-xl rounded-[2rem] flex items-center justify-center shadow-inner border border-white relative"
                           style={{ color: activeTheme.primary }}>
                        <div className="absolute inset-0 rounded-[2rem] blur-xl -z-10 transition-colors"
                             style={{ backgroundColor: activeTheme.light }}></div>
                        <activeMember.icon size={36} sm:size={48} strokeWidth={1.5} />
                      </div>
                    </div>

                    <div className="mb-14 relative z-10">
                       <div className="relative p-6 sm:p-8 rounded-[1.5rem] border flex items-start gap-4 ring-1 ring-white/50"
                            style={{ backgroundColor: activeTheme.light, borderColor: `${activeTheme.primary}10` }}>
                          <div className="w-1.5 h-full absolute left-4 top-0 bottom-0 py-6">
                             <div className="w-full h-full rounded-full" style={{ backgroundColor: `${activeTheme.primary}20` }} />
                          </div>
                          <p className="text-base sm:text-lg font-black leading-tight tracking-tight pl-2"
                             style={{ color: activeTheme.primary }}>
                            {activeMember.role}
                          </p>
                       </div>
                    </div>

                    <div className="flex-1 space-y-12 relative z-10">
                        <div className="max-w-3xl">
                          <p className="text-[#1e293b] text-base sm:text-lg font-medium leading-[1.8] tracking-tight">
                            {activeMember.what}
                          </p>
                        </div>

                        {activeMember.tip && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-6 sm:p-8 rounded-[2.5rem] bg-sky-50/40 border border-sky-200/30 shadow-[0_12px_32px_rgba(14,165,233,0.04)] relative overflow-hidden isolate"
                          >
                             {/* Abstract shimmer effect */}
                             <div className="absolute inset-0 bg-gradient-to-tr from-sky-100/20 to-transparent -z-10" />
                             <div className="flex gap-5 items-start">
                               <div className="mt-1 flex-shrink-0 bg-sky-100 text-sky-600 p-2 rounded-xl shadow-sm ring-4 ring-white">
                                 <Info size={22} weight="bold" />
                               </div>
                               <div className="flex flex-col">
                                 <span className="uppercase tracking-[0.25em] text-[10px] text-sky-600 font-black mb-1.5 opacity-80">Strategic Insight</span>
                                 <p className="text-[#0c4a6e] text-[15px] sm:text-[16px] font-black leading-[1.6]">
                                   {activeMember.tip}
                                 </p>
                               </div>
                             </div>
                          </motion.div>
                        )}
                    </div>

                    <div className="mt-12 flex justify-end relative z-10 border-t border-slate-50 pt-8 opacity-50">
                       <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 size={12} /> Foster Guidance AZ Standard v2.1
                       </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Questions Section - Balanced Architecture */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-16 md:gap-24 items-start py-16 md:py-32 border-t border-slate-200/80 mt-10">
               <div>
                  <div className="w-12 h-1 bg-emerald-400 rounded-full mb-8" />
                  <h2 className="text-3xl sm:text-4xl font-black text-[#1e293b] tracking-[-0.05em] mb-6 leading-[0.9]">
                    Questions on <br className="hidden sm:block" /> Your Advocacy?
                  </h2>
                  <p className="text-slate-500 font-bold text-lg sm:text-xl leading-relaxed max-w-sm tracking-tight">
                    Understanding the complexities of the courtroom is a fundamental right.
                  </p>
                  
                  <button className="mt-8 flex items-center gap-3 text-[#115e59] font-black text-sm uppercase tracking-widest hover:gap-5 transition-all group">
                     Explore Legislative Source <ArrowRight size={18} className="transition-transform group-hover:scale-110" />
                  </button>
               </div>

               <div className="space-y-5 w-full">
                  {FAQS.map((faq, idx) => {
                    const isOpen = openFAQ === idx;
                    return (
                      <div 
                        key={idx} 
                        className={`transition-all duration-500 rounded-[2rem] border ${
                          isOpen ? 'bg-white shadow-[0_20px_48px_rgba(0,0,0,0.06)] border-[#115e59]/20' : 'bg-white/40 glass-panel border-white/50 hover:border-slate-300'
                        }`}
                      >
                        <button 
                          onClick={() => setOpenFAQ(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between px-8 py-7 sm:py-8 text-left"
                        >
                          <span className={`text-base sm:text-lg font-black pr-6 transition-all duration-500 tracking-tight leading-tight ${isOpen ? 'text-[#115e59] transform translate-x-2' : 'text-slate-700'}`}>
                            {faq.q}
                          </span>
                          <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                            isOpen ? 'bg-[#115e59] text-white shadow-lg rotate-0' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                          }`}>
                            {isOpen ? <ChevronUp size={20} strokeWidth={3} /> : <ChevronDown size={20} strokeWidth={3} />}
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
                              <div className="px-8 pb-10">
                                <div className="pt-6 border-t border-slate-50 text-sm sm:text-base font-medium leading-[1.7] text-slate-500 tracking-tight">
                                  {faq.a}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
               </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
