import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartPulse, 
  Home as HomeIcon, 
  Users, 
  FolderOpen, 
  HelpCircle, 
  Menu, 
  ArrowRight, 
  Phone, 
  MessageSquare, 
  Sparkles,
  Wind,
  Brain,
  Zap,
  CheckCircle2,
  Clock,
  Shield,
  LifeBuoy
} from 'lucide-react';

import welcomeIcon from '../assets/onboarding/welcome_icon.png';
import groundingImg from '../assets/wellness/grounding.png';
import breathingImg from '../assets/wellness/breathing.png';
import journalImg from '../assets/wellness/journal.png';
import musicImg from '../assets/wellness/music.png';

const GROUNDING_STEPS = [
  { n: 5, sense: "things you can see", icon: "👁️" },
  { n: 4, sense: "things you can touch", icon: "✋" },
  { n: 3, sense: "things you can hear", icon: "👂" },
  { n: 2, sense: "things you can smell", icon: "👃" },
  { n: 1, sense: "thing you can taste", icon: "👅" },
];

const COPING_TOOLS = [
  {
    id: "breathe",
    img: breathingImg,
    title: "Box Breathing",
    desc: "Breathe in for 4 counts, hold for 4, out for 4, hold for 4. Repeat 3 times to signal to your nervous system that you are safe.",
    color: "sky"
  },
  {
    id: "journal",
    img: journalImg,
    title: "3-Line Journaling",
    desc: "Write 3 lines: what happened, how you felt, and one thing you're grateful for. This helps move thoughts from your head to the page.",
    color: "emerald"
  },
  {
    id: "move",
    img: musicImg,
    title: "Change Your Scenery",
    desc: "Even 5 minutes of walking or listening to one specific song can physically shift your brain away from a loop of stress.",
    color: "amber"
  }
];

const SUPPORT_NETWORK = [
  {
    name: "988 Suicide & Crisis Lifeline",
    desc: "Call or text 988 for 24/7 confidential support. You don't have to be in 'crisis' to reach out—you just need someone to talk to.",
    action: "tel:988",
    label: "Call 988"
  },
  {
    name: "Crisis Text Line",
    desc: "Text HOME to 741741. Best for when you need to talk but aren't in a place where you can speak out loud.",
    action: "sms:741741",
    label: "Text 741741"
  },
  {
    name: "AZ DCS SOS-CHILD",
    desc: "1-888-767-2445. Use this if you are currently feeling unsafe or if there is an emergency in your placement.",
    action: "tel:18887672445",
    label: "Contact SOS"
  }
];

export default function WellnessTeen({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const [activeExercise, setActiveExercise] = useState<boolean>(false);
  const [groundingStep, setGroundingStep] = useState(0);

  const startGrounding = () => {
    setGroundingStep(0);
    setActiveExercise(true);
  };

  const nextGroundingStep = () => { 
    if (groundingStep < GROUNDING_STEPS.length - 1) {
      setGroundingStep(s => s + 1);
    } else {
      setActiveExercise(false);
      setGroundingStep(0);
    }
  };

  const currentStep = GROUNDING_STEPS[groundingStep];

  return (
    <div className="flex w-full min-h-screen font-['Inter',_sans-serif] bg-[#FDFBF7] text-[#2d3748] overflow-x-hidden selection:bg-sky-100/80">
      
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
            { id: 'wellness', icon: HeartPulse, label: 'Mental Health', active: true },
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
              <item.icon size={20} className={`shrink-0 transition-all duration-300 group-hover:scale-110 ${item.active ? 'text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]' : ''}`} />
              <span className="text-[15.5px] tracking-tight">{item.label}</span>
              {item.active && <motion.div layoutId="nav-pill" className="absolute left-0 w-1.5 h-8 bg-sky-400 rounded-r-full shadow-[0_0_12px_rgba(56,189,248,0.8)]" />}
            </button>
          ))}
        </nav>

        <div className="p-8">
           <div className="w-full p-6 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 relative overflow-hidden group">
             <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-sky-500/10 blur-2xl rounded-full"></div>
             <Wind size={20} className="text-sky-400 mb-3" />
             <p className="text-white text-[13px] font-black leading-relaxed mb-1 tracking-tight">Focus & Relief</p>
             <p className="text-slate-400 text-[10px] leading-relaxed font-bold opacity-80 uppercase tracking-widest">A space for clarity</p>
           </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 overflow-y-auto relative w-full pb-24 md:pb-0 scroll-smooth">
        
        {/* Immersive Exercise Overlay */}
        <AnimatePresence>
          {activeExercise && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-[#1a2f44]/95 backdrop-blur-3xl flex flex-col items-center justify-center p-10 text-center"
            >
              <div className="max-w-xl w-full">
                <motion.div 
                  key={groundingStep}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="mb-12"
                >
                  <div className="text-8xl sm:text-9xl mb-12 drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                    {currentStep.icon}
                  </div>
                  <div className="text-6xl sm:text-8xl font-black text-white mb-6 tracking-tighter">
                    {currentStep.n}
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-bold text-sky-300 tracking-tight leading-tight">
                    Name {currentStep.n} {currentStep.sense}
                  </h3>
                </motion.div>

                <div className="flex justify-center gap-3 mb-16">
                   {GROUNDING_STEPS.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 rounded-full transition-all duration-700 ${
                          i === groundingStep ? 'w-12 bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]' : i < groundingStep ? 'w-3 bg-sky-400/40' : 'w-3 bg-white/10'
                        }`}
                      />
                   ))}
                </div>

                <button 
                  onClick={nextGroundingStep}
                  className="w-full sm:w-80 bg-white text-[#1a2f44] font-black text-lg py-6 rounded-3xl shadow-2xl hover:bg-sky-50 active:scale-95 transition-all"
                >
                  {groundingStep < GROUNDING_STEPS.length - 1 ? 'Next Sense' : 'Finish & Reset'}
                </button>
                <button 
                  onClick={() => setActiveExercise(false)}
                  className="mt-8 text-white/40 font-bold hover:text-white/60 transition-colors uppercase tracking-widest text-xs"
                >
                  Close exercise
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-50/50 rounded-full blur-[140px] -z-10 translate-x-1/4 -translate-y-1/4 shadow-inner"></div>

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

        <main className="max-w-[1240px] mx-auto px-6 sm:px-12 py-10 sm:py-20 overflow-visible">
          
          {/* Typographic Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-14 md:mb-24"
          >
            <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-8 tracking-[-0.05em] leading-[0.9]">
               Breathe & Reset
            </h1>
            <p className="text-slate-500 text-lg sm:text-xl font-medium max-w-2xl leading-[1.6] tracking-tight border-l-[3px] border-slate-200 pl-8">
               What you feel is real. These tools are designed to help you quiet the noise, find your center, and navigate the difficult moments.
            </p>
          </motion.div>

          {/* Interactive Tool Grid */}
          <div className="grid lg:grid-cols-12 gap-8 mb-24 overflow-visible">
            
            {/* Immersive Grounding Card */}
            <div className="lg:col-span-12 group">
               <div className="relative bg-[#1a2f44] rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-14 overflow-hidden border border-[#2a4563] shadow-[0_24px_80px_rgba(0,0,0,0.15)]">
                  {/* Decorative Accents */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
                  <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full"></div>

                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-20">
                     <div className="w-40 sm:w-60 h-40 sm:h-60 rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center p-8 backdrop-blur-md group-hover:scale-105 transition-transform duration-700">
                        <img src={groundingImg} alt="Grounding" className="w-full h-full object-contain drop-shadow-2xl brightness-110" />
                     </div>
                     <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                           <Zap size={18} className="text-sky-400 fill-sky-400" />
                           <span className="text-sky-400 font-black text-[10px] uppercase tracking-[0.35em]">Instant Relief</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight">The 5-4-3-2-1 Reset</h2>
                        <p className="text-slate-300 text-base sm:text-xl mb-12 max-w-xl font-medium leading-relaxed tracking-tight group-hover:text-white transition-colors">
                           This exercise helps pull your brain out of 'overdrive' by grounding you in your actual environment through your five senses.
                        </p>
                        <button 
                          onClick={startGrounding}
                          className="px-10 py-5 rounded-2xl bg-sky-400 text-[#1a2f44] font-black text-lg shadow-[0_12px_44px_rgba(56,189,248,0.4)] hover:bg-white transition-all hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto md:mx-0"
                        >
                          Start Immersive Exercise <ArrowRight size={20} strokeWidth={3} />
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            {/* Toolkit Grid */}
            <div className="lg:col-span-12 grid sm:grid-cols-3 gap-6">
               {COPING_TOOLS.map((tool) => (
                 <motion.div 
                   key={tool.id}
                   whileHover={{ y: -8 }}
                   className="bg-white rounded-[2.5rem] p-10 border border-slate-50 shadow-[0_12px_44px_rgba(0,0,0,0.02)] group flex flex-col items-center text-center"
                 >
                   <div className="w-24 h-24 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center p-5 mb-8 group-hover:bg-sky-50 transition-colors duration-500 overflow-hidden relative">
                      <img src={tool.img} alt={tool.title} className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
                   </div>
                   <h3 className="text-xl font-black text-[#1e293b] mb-4 tracking-tight">{tool.title}</h3>
                   <p className="text-slate-400 text-sm font-medium leading-relaxed">
                     {tool.desc}
                   </p>
                 </motion.div>
               ))}
            </div>
          </div>

          {/* Support Network Section */}
          <section className="mt-40 grid lg:grid-cols-12 gap-16 items-start">
             <div className="lg:col-span-4 sticky top-32">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-6 block">Direct Access</span>
                <h2 className="text-4xl font-black text-[#1e293b] tracking-tight mb-6 leading-[0.95]">Your Support Network</h2>
                <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10">
                   Real people who care, available 24/7. Reaching out isn't a sign of weakness—it's the highest level of resourcefulness.
                </p>
                <div className="p-8 rounded-[2rem] bg-sky-50/50 border border-sky-100/50 flex gap-5 items-start">
                   <LifeBuoy size={24} className="text-sky-500 mt-1" />
                   <p className="text-sky-800 text-sm font-bold leading-relaxed">
                      All calls and texts are private. These teams are trained specifically to help youth navigating the foster care system.
                   </p>
                </div>
             </div>

             <div className="lg:col-span-8 flex flex-col gap-6">
                {SUPPORT_NETWORK.map((contact, idx) => (
                   <motion.div 
                     key={idx}
                     initial={{ opacity: 0, x: 20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     transition={{ delay: idx * 0.1 }}
                     className="bg-white rounded-[2.5rem] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 group flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left"
                   >
                     <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-sky-900 group-hover:text-white transition-all duration-500">
                        {contact.action.startsWith('tel:') ? <Phone size={24} /> : <MessageSquare size={24} />}
                     </div>
                     <div className="flex-1">
                        <h4 className="text-xl font-black text-[#1e293b] mb-2 tracking-tight">{contact.name}</h4>
                        <p className="text-slate-400 text-[13px] font-bold leading-relaxed mb-6 sm:mb-0 max-w-md">{contact.desc}</p>
                     </div>
                     <a 
                       href={contact.action}
                       className="px-8 py-4 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-sky-400 transition-all hover:scale-105 shadow-[0_8px_20px_rgba(0,0,0,0.1)]"
                     >
                       {contact.label}
                     </a>
                   </motion.div>
                ))}

                {/* Motivational Callout */}
                <div className="mt-12 p-12 rounded-[3.5rem] bg-gradient-to-br from-[#1a2f44] to-[#122b46] text-white flex flex-col sm:flex-row items-center gap-10 overflow-hidden relative group">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                   <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center shrink-0 backdrop-blur-md group-hover:rotate-12 transition-transform duration-700">
                      <Sparkles size={40} className="text-sky-300" />
                   </div>
                   <p className="text-xl sm:text-2xl font-black leading-tight tracking-tight text-center sm:text-left italic">
                      "What you feel makes sense given what you've been through. You are building resilience every single day."
                   </p>
                </div>
             </div>
          </section>
        </main>
      </div>
    </div>
  );
}
