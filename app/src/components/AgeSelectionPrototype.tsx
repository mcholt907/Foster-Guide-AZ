import { useState } from 'react';
import { Lock, CheckCircle2 } from 'lucide-react';
import welcomeIcon from '../assets/onboarding/welcome_icon.png';

interface Props {
  onNext?: () => void;
  onBack?: () => void;
  onChangeLanguage?: () => void;
  isEmbedded?: boolean;
}

export default function AgeSelectionPrototype({ onNext, onBack, onChangeLanguage, isEmbedded = false }: Props) {
  const [selectedAge, setSelectedAge] = useState<string | null>(null);

  const containerClass = isEmbedded
    ? "w-full min-h-screen overflow-y-auto font-['Outfit',_sans-serif] bg-[#FDF9F3] text-[#35322d]"
    : "min-h-screen bg-[#FDF9F3] text-[#35322d] font-['Outfit',_sans-serif] flex justify-center";

  const ageOptions = [
    { id: '10-12', label: '10–12', desc: 'Learn the basics' },
    { id: '13-15', label: '13–15', desc: 'Your rights + court' },
    { id: '16-17', label: '16–17', desc: 'Planning ahead' },
    { id: '18-21', label: '18–21', desc: "Staying in care past 18 + what's next" }
  ];

  return (
    <div className={containerClass}>
      <div className="w-full max-w-[480px] min-h-screen shadow-2xl bg-[#FDF9F3] relative flex flex-col justify-between overflow-x-hidden">
        
        {/* Top Header Area */}
        <div className="px-6 pt-12 sm:pt-16 pb-6 flex flex-col items-center flex-1 relative z-10 w-full text-center">
          
          {/* Flawless Circular Icon Frame */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white shadow-lg border-[6px] border-white flex justify-center items-center overflow-hidden mb-6 relative">
            <img 
              src={welcomeIcon} 
              alt="Welcome House" 
              className="w-full h-full object-cover scale-[1.15] translate-y-2"
              onError={(e) => {
                // Fallback if image doesn't load gracefully
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          
          <div className="text-[#136d41] font-extrabold text-[11px] mb-4 uppercase tracking-[0.2em] bg-[#136d41]/10 px-4 py-1.5 rounded-full">
            FosterHub AZ
          </div>

          <h2 className="text-4xl sm:text-[2.75rem] font-extrabold text-[#115e59] mb-4 leading-[1.1]">
            This place is<br/>for you.
          </h2>

          <p className="text-slate-600 font-medium text-[16px] sm:text-lg leading-relaxed max-w-sm mb-6 px-2">
            Foster care can be confusing and overwhelming. This is a calm, safe space to find real answers and learn your rights.
          </p>

          <div className="bg-[#e0f2fe] rounded-full px-5 py-2.5 flex flex-wrap items-center justify-center gap-2 text-[13px] font-bold text-[#0c4a6e] shadow-sm border border-[#bae6fd]">
            <Lock size={14} className="text-[#0284c7]" /> 
            <span>No sign-up • Nothing is saved</span>
          </div>
        </div>

        {/* Bottom Drawer Selection */}
        <div className="bg-white rounded-t-[2.5rem] px-6 sm:px-8 pt-8 pb-10 shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.05)] relative z-20 flex flex-col">
            
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[1.35rem] sm:text-2xl font-extrabold text-[#35322d]">
              How old are you?
            </h3>
            {/* Progress Dots */}
            <div className="flex gap-1.5 items-center">
              <div className="w-2 h-2 rounded-full bg-slate-200"></div>
              <div className="w-6 h-2 rounded-full bg-[#115e59]"></div>
              <div className="w-2 h-2 rounded-full bg-slate-200"></div>
              <div className="w-2 h-2 rounded-full bg-slate-200"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
            {ageOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedAge(opt.id)}
                className={`relative flex flex-col justify-center items-center text-center transition-all duration-300 ease-out border-[3px] rounded-[1.5rem] p-3 sm:p-4 min-h-[110px] ${
                  selectedAge === opt.id 
                    ? 'bg-gradient-to-br from-[#E6F8EA] to-[#D5F2DB] border-[#136d41] shadow-md scale-[1.02]' 
                    : 'bg-slate-50 border-transparent shadow-sm hover:bg-slate-100 hover:scale-[1.01]'
                }`}
              >
                {selectedAge === opt.id && (
                  <div className="absolute top-3 right-3 bg-white rounded-full p-0.5 shadow-sm">
                    <CheckCircle2 size={16} className="fill-[#136d41] text-white" />
                  </div>
                )}
                <span className={`font-extrabold text-2xl tracking-tight mb-1 ${selectedAge === opt.id ? 'text-[#115e59]' : 'text-[#35322d]'}`}>
                  {opt.label}
                </span>
                <span className={`text-xs font-medium leading-tight px-1 ${selectedAge === opt.id ? 'text-[#136d41]' : 'text-slate-500'}`}>
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-stretch gap-3 mb-6">
            <button
              onClick={onBack}
              className="px-6 py-4 rounded-[1.5rem] font-bold text-[16px] text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Back
            </button>
            <button
              onClick={onNext}
              disabled={!selectedAge}
              className={`flex-1 py-4 rounded-[1.5rem] font-extrabold text-[16px] flex items-center justify-center gap-2 transition-all duration-300 ${
                selectedAge 
                  ? 'bg-[#136d41] text-white hover:bg-[#0f5c35] shadow-md hover:shadow-lg' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              Next
            </button>
          </div>

          <div className="text-center">
            <button 
              onClick={onChangeLanguage}
              className="text-[#64748b] text-[13px] font-medium hover:text-[#115e59] underline decoration-2 underline-offset-4 transition-colors"
            >
               Cambiar a Español
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
