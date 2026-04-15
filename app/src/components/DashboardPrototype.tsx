import { Lock, Phone, HelpCircle } from "lucide-react";
import caseImg from '../assets/dashboard/case.png';
import rightsImg from '../assets/dashboard/rights.png';
import wellnessImg from '../assets/dashboard/wellness.png';
import groupAvatarImg from '../assets/avatars/group_avatar.png';

interface Props {
  onNavigate: (screen: string) => void;
}

export default function DashboardPrototype({ onNavigate }: Props) {
  return (
    <div className="bg-slate-100 min-h-screen flex justify-center">
      <div className="bg-[#fef8f3] w-full max-w-[480px] min-h-screen pb-24 font-['Outfit',_sans-serif] text-[#35322d] shadow-2xl overflow-hidden relative">

        {/* Top Header */}
        <div className="px-6 pt-12 pb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#136d41] leading-tight">
            What do you need today?
          </h1>
          <div className="flex items-center gap-2 mt-3 bg-white/50 w-fit px-3 py-1.5 rounded-full text-xs font-semibold text-slate-500 shadow-sm border border-slate-100">
            <span className="text-slate-400">📍</span>
            <span>Ages 10–12 • English</span>
          </div>
        </div>

        {/* Grid Menu */}
        <div className="px-6 grid grid-cols-2 gap-4 mb-8">

          {/* Meet Your Team — active */}
          <button
            onClick={() => onNavigate('team')}
            className="aspect-square bg-[#fff4cc] rounded-[2rem] p-5 flex flex-col justify-center gap-2 items-start text-left shadow-sm border border-black/5 hover:scale-[1.02] transition-transform active:scale-95"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[1.5rem] flex items-center justify-center overflow-hidden mix-blend-multiply drop-shadow-sm">
              <img src={groupAvatarImg} alt="" className="w-full h-full object-cover scale-[1.3] pt-2" />
            </div>
            <span className="font-bold text-[#78350f] text-lg sm:text-xl leading-none">Meet your team</span>
          </button>

          {/* My Case Explained — active */}
          <button
            onClick={() => onNavigate('case')}
            className="aspect-square bg-[#e0f2fe] rounded-[2rem] p-5 flex flex-col justify-center gap-2 items-start text-left shadow-sm border border-black/5 hover:scale-[1.02] transition-transform active:scale-95"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center overflow-hidden drop-shadow-sm">
              <img src={caseImg} alt="" className="w-full h-full object-cover scale-[1.2]" />
            </div>
            <span className="font-bold text-[#0c4a6e] text-lg sm:text-xl leading-none">My case explained</span>
          </button>

          {/* Know Your Rights — coming soon */}
          <div className="aspect-square bg-[#dcfce7] rounded-[2rem] p-5 flex flex-col justify-center gap-2 items-start text-left shadow-sm border border-black/5 opacity-50 relative">
            <div className="absolute top-4 right-4 bg-white/90 rounded-full px-2 py-0.5 flex items-center gap-1 text-[10px] font-bold text-slate-400">
              <Lock size={9} /> Soon
            </div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center overflow-hidden drop-shadow-sm">
              <img src={rightsImg} alt="" className="w-full h-full object-cover scale-[1.2]" />
            </div>
            <span className="font-bold text-[#14532d] text-lg sm:text-xl leading-none">Know your rights</span>
          </div>

          {/* Wellness Check-In — active */}
          <button
            onClick={() => onNavigate('wellness')}
            className="aspect-square bg-[#fce7f3] rounded-[2rem] p-5 flex flex-col justify-center gap-2 items-start text-left shadow-sm border border-black/5 hover:scale-[1.02] transition-transform active:scale-95 relative"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center overflow-hidden drop-shadow-sm">
              <img src={wellnessImg} alt="" className="w-full h-full object-cover scale-[1.2]" />
            </div>
            <span className="font-bold text-[#831843] text-lg sm:text-xl leading-none">Wellness check-in</span>
          </button>

        </div>

        {/* Ask Compass CTA */}
        <div className="px-6 mb-10">
          <button
            onClick={() => onNavigate('find-answers')}
            className="w-full bg-[#136d41] rounded-[2.5rem] p-8 text-center shadow-md relative overflow-hidden hover:brightness-110 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#a1f5bc] rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none" />
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 relative z-10">Have a quick question?</h2>
            <div className="bg-[#a1f5bc] text-[#004a28] w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 relative z-10 shadow-lg">
              <HelpCircle size={20} />
              Find Answers
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="px-6 flex items-center justify-center mb-6">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="px-3 text-[10px] font-bold tracking-widest text-[#a09c98] uppercase">Support & Safety</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        {/* Safety Module */}
        <div className="px-6 grid gap-3">
          <a
            href="tel:988"
            className="bg-white rounded-[1.5rem] p-4 flex items-center gap-4 shadow-sm border border-black/5 hover:bg-slate-50 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-[#fee2e2] flex shrink-0 items-center justify-center text-[#b91c1c]">
              <Phone size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-[#35322d]">988 Suicide & Crisis</h4>
              <p className="text-xs text-[#a09c98] mt-0.5">Call or text anytime</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#fee2e2] flex items-center justify-center text-[#b91c1c] shrink-0">
              <Phone size={16} />
            </div>
          </a>
        </div>

      </div>
    </div>
  );
}
