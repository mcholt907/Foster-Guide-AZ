import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HeartPulse, 
  Home as HomeIcon, 
  Users, 
  FolderOpen, 
  HelpCircle, 
  Menu, 
  ChevronRight, 
  Scale, 
  Compass as CompassIcon,
  Sparkles,
  Calendar,
  Lock,
  Phone,
  ShieldCheck,
  Briefcase,
  MapPin,
  Clock,
  ExternalLink
} from 'lucide-react';

import welcomeIcon from '../assets/onboarding/welcome_icon.png';
import groupAvatarImg from '../assets/avatars/group_avatar.png';
import caseImg from '../assets/dashboard/case.png';
import wellnessImg from '../assets/dashboard/wellness.png';
import rightsImg from '../assets/dashboard/rights.png';

export default function DashboardTeen({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
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
            { id: 'dashboard', icon: HomeIcon, label: 'Dashboard', active: true },
            { id: 'case', icon: FolderOpen, label: 'My Case Explained' },
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
             <ShieldCheck size={20} className="text-emerald-400 mb-3" />
             <p className="text-white text-[13px] font-black leading-relaxed mb-1 tracking-tight">Command Center</p>
             <p className="text-slate-400 text-[10px] leading-relaxed font-bold opacity-80 uppercase tracking-widest">Ages 16–18 • English</p>
           </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 overflow-y-auto relative w-full pb-24 md:pb-0 scroll-smooth">
        
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-50/40 rounded-full blur-[140px] -z-10 translate-x-1/4 -translate-y-1/4 shadow-inner"></div>

        {/* Mobile Top Header */}
        <header className="md:hidden flex items-center justify-between px-6 py-6 sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
           <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center overflow-hidden shadow-lg border border-white/20">
                <img src={welcomeIcon} alt="Logo" className="w-full h-full object-cover scale-[1.1] translate-y-1" />
              </div>
              <span className="font-black text-[#1e293b] tracking-tight text-lg">FosterHub AZ</span>
           </div>
           <button className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-500 rounded-xl outline-none">
              <Menu size={20} />
           </button>
        </header>

        <main className="max-w-[1240px] mx-auto px-6 sm:px-12 py-10 sm:py-20">
          
          {/* Greeting Hero */}
          <div className="mb-16">
            <h1 className="text-4xl sm:text-6xl font-black text-[#1e293b] mb-4 tracking-[-0.05em] leading-[0.9]">
               Good morning.
            </h1>
            <p className="text-slate-400 text-lg font-bold tracking-tight">
               Today is {currentDate}. Here is your status summary.
            </p>
          </div>

          {/* System Insight Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
             <div className="bg-white p-8 rounded-[2rem] shadow-[0_12px_32px_rgba(0,0,0,0.03)] border border-white flex items-center gap-6 group hover:shadow-[0_24px_48px_rgba(0,0,0,0.06)] transition-all">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                   <Calendar size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1">Next Hearing</p>
                  <p className="text-lg font-black text-[#1a2f44]">June 12, 2026</p>
                </div>
             </div>
             
             <div className="bg-white p-8 rounded-[2rem] shadow-[0_12px_32px_rgba(0,0,0,0.03)] border border-white flex items-center gap-6 group hover:shadow-[0_24px_48px_rgba(0,0,0,0.06)] transition-all">
                <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-all">
                   <MapPin size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1">Placement</p>
                  <p className="text-lg font-black text-[#1a2f44]">Secured</p>
                </div>
             </div>

             <div className="bg-white p-8 rounded-[2rem] shadow-[0_12px_32px_rgba(0,0,0,0.03)] border border-white flex items-center gap-6 group hover:shadow-[0_24px_48px_rgba(0,0,0,0.06)] transition-all">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                   <Briefcase size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1">Process Goal</p>
                  <p className="text-lg font-black text-[#1a2f44]">Reunification</p>
                </div>
             </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-16 items-start">
             
             {/* Primary Navigation Hub */}
             <div className="lg:col-span-8 flex flex-col gap-10">
                <div className="flex items-center justify-between">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Command Control</h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-8">
                   
                   {/* Team */}
                   <button 
                     onClick={() => onNavigate?.('team')}
                     className="bg-white p-10 rounded-[2.5rem] shadow-[0_24px_64px_rgba(0,0,0,0.02)] border border-white flex flex-col items-start gap-8 group hover:shadow-[0_32px_80px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all text-left overflow-hidden relative"
                   >
                     <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <div className="w-16 h-16 bg-[#fff4cc] rounded-[1.5rem] flex items-center justify-center overflow-hidden mix-blend-multiply shadow-sm group-hover:scale-110 transition-transform">
                        <img src={groupAvatarImg} alt="Team" className="w-full h-full object-cover scale-[1.3] pt-2" />
                     </div>
                     <div className="flex flex-col gap-2 relative z-10">
                        <h4 className="text-2xl font-black text-[#78350f] tracking-tight leading-none">Your Advocates</h4>
                        <p className="text-slate-400 text-sm font-bold leading-relaxed">Direct lines to your judge, lawyer, and caseworker.</p>
                     </div>
                     <div className="w-full pt-6 border-t border-slate-50 flex items-center justify-between text-amber-600 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                        Open Portal <ChevronRight size={14} strokeWidth={3} />
                     </div>
                   </button>

                   {/* Case Explained */}
                   <button 
                     onClick={() => onNavigate?.('case')}
                     className="bg-white p-10 rounded-[2.5rem] shadow-[0_24px_64px_rgba(0,0,0,0.02)] border border-white flex flex-col items-start gap-8 group hover:shadow-[0_32px_80px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all text-left overflow-hidden relative"
                   >
                     <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <div className="w-16 h-16 bg-[#e0f2fe] rounded-[1.5rem] flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                        <img src={caseImg} alt="Case" className="w-full h-full object-cover scale-[1.2]" />
                     </div>
                     <div className="flex flex-col gap-2 relative z-10">
                        <h4 className="text-2xl font-black text-[#0369a1] tracking-tight leading-none">Legal Roadmap</h4>
                        <p className="text-slate-400 text-sm font-bold leading-relaxed">Timeline of your hearings and next legal maneuvers.</p>
                     </div>
                     <div className="w-full pt-6 border-t border-slate-50 flex items-center justify-between text-sky-600 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                        View Timeline <ChevronRight size={14} strokeWidth={3} />
                     </div>
                   </button>

                   {/* Wellness */}
                   <button 
                     onClick={() => onNavigate?.('wellness')}
                     className="bg-white p-10 rounded-[2.5rem] shadow-[0_24px_64px_rgba(0,0,0,0.02)] border border-white flex flex-col items-start gap-8 group hover:shadow-[0_32px_80px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all text-left overflow-hidden relative"
                   >
                     <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <div className="w-16 h-16 bg-[#fce7f3] rounded-[1.5rem] flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                        <img src={wellnessImg} alt="Wellness" className="w-full h-full object-cover scale-[1.2]" />
                     </div>
                     <div className="flex flex-col gap-2 relative z-10">
                        <h4 className="text-2xl font-black text-[#be185d] tracking-tight leading-none">Mindful Hub</h4>
                        <p className="text-slate-400 text-sm font-bold leading-relaxed">Daily grounding tools and mental health resources.</p>
                     </div>
                     <div className="w-full pt-6 border-t border-slate-50 flex items-center justify-between text-pink-600 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                        Start Session <ChevronRight size={14} strokeWidth={3} />
                     </div>
                   </button>

                   {/* Find Answers */}
                   <button 
                     onClick={() => onNavigate?.('answers')}
                     className="bg-white p-10 rounded-[2.5rem] shadow-[0_24px_64px_rgba(0,0,0,0.02)] border border-white flex flex-col items-start gap-8 group hover:shadow-[0_32px_80px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all text-left overflow-hidden relative"
                   >
                     <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <div className="w-16 h-16 bg-[#dcfce7] rounded-[1.5rem] flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                        <img src={rightsImg} alt="Answers" className="w-full h-full object-cover scale-[1.2]" />
                     </div>
                     <div className="flex flex-col gap-2 relative z-10">
                        <h4 className="text-2xl font-black text-[#15803d] tracking-tight leading-none">Knowledge Hub</h4>
                        <p className="text-slate-400 text-sm font-bold leading-relaxed">Searchable database for rights, laws, and next steps.</p>
                     </div>
                     <div className="w-full pt-6 border-t border-slate-50 flex items-center justify-between text-emerald-600 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                        Search Portal <ChevronRight size={14} strokeWidth={3} />
                     </div>
                   </button>

                </div>
             </div>

             {/* Side Action Column */}
             <div className="lg:col-span-4 sticky top-10 flex flex-col gap-8">
                
                {/* Strategic Advisor Panel */}
                <div className="bg-[#1a2f44] text-white p-10 rounded-[2.5rem] shadow-[0_24px_80px_rgba(0,0,0,0.15)] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/5 blur-3xl rounded-full"></div>
                   <div className="flex items-center gap-4 mb-8">
                      <div className="w-10 h-10 bg-white shadow-[0_12px_24px_rgba(255,255,255,0.1)] rounded-2xl flex items-center justify-center shrink-0">
                         <CompassIcon size={20} className="text-[#1a2f44]" strokeWidth={3} />
                      </div>
                      <h4 className="font-black text-lg tracking-tight">Strategic Tip</h4>
                   </div>
                   
                   <p className="text-slate-100 text-base font-bold leading-relaxed mb-6">
                      Did you know you can request a private meeting with your judge before your June hearing?
                   </p>
                   
                   <button 
                     onClick={() => onNavigate?.('answers')}
                     className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
                   >
                     Learn your rights <ArrowRight size={14} strokeWidth={3} />
                   </button>
                </div>

                {/* Crisis Support - High End */}
                <div className="bg-rose-50 rounded-[2.5rem] p-10 border border-rose-100/50 shadow-sm flex flex-col items-center text-center group ">
                   <div className="w-20 h-20 bg-white rounded-[2rem] shadow-sm flex items-center justify-center mb-8 rotate-3  group-hover:rotate-0 transition-all">
                      <Phone size={32} className="text-rose-500" />
                   </div>
                   <h5 className="font-black text-rose-900 mb-4 tracking-tight text-xl">Crisis Support</h5>
                   <p className="text-rose-700/60 text-sm font-bold leading-relaxed mb-10">
                      If you're feeling overwhelmed or need immediate help, 988 is available 24/7.
                   </p>
                   <a 
                     href="tel:988"
                     className="w-full py-5 rounded-2xl bg-rose-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-rose-200 hover:bg-rose-600 hover:-translate-y-1 active:translate-y-0 transition-all"
                   >
                     Call or Text 988
                   </a>
                </div>

                {/* Start over */}
                <div className="mt-6 pb-2 text-center">
                  <button
                    type="button"
                    onClick={() => onNavigate?.('onboarding')}
                    className="text-xs text-slate-400 underline hover:text-slate-600 transition-colors"
                  >
                    ↩ Start over
                  </button>
                </div>

                {/* Support Footer Logo */}
                <div className="flex flex-col items-center pt-8 opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all">
                   <div className="flex items-center gap-3 mb-2">
                     <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden">
                        <img src={welcomeIcon} alt="Logo" className="w-full h-full object-cover translate-y-0.5" />
                     </div>
                     <span className="font-black text-slate-900 tracking-tight text-xs">FosterHub</span>
                   </div>
                   <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Arizona Youth Services</p>
                </div>
             </div>
          </div>

        </main>
      </div>
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
