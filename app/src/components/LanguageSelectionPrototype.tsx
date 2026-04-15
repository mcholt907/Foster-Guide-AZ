import { useState } from 'react';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import welcomeIcon from '../assets/onboarding/welcome_icon.png';

interface Props {
  onNext: () => void;
  isEmbedded?: boolean;
}

export default function LanguageSelectionPrototype({ onNext, isEmbedded = false }: Props) {
  const [selectedLang, setSelectedLang] = useState<'en' | 'es' | null>(null);

  const containerClass = isEmbedded
    ? "w-full min-h-screen overflow-y-auto font-['Outfit',_sans-serif] bg-[#FDF9F3] text-[#35322d]"
    : "min-h-screen bg-[#FDF9F3] text-[#35322d] font-['Outfit',_sans-serif] flex justify-center";

  return (
    <div className={containerClass}>
      <div className="w-full max-w-[480px] min-h-screen shadow-2xl bg-[#FDF9F3] relative flex flex-col justify-between overflow-x-hidden">
        
        {/* Top Header Area */}
        <div className="px-6 pt-16 pb-6 flex flex-col items-center flex-1 relative z-10 w-full text-center">
          
          {/* Flawless Circular Icon Frame */}
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-white shadow-lg border-[6px] border-white flex justify-center items-center overflow-hidden mb-6 relative">
            <img 
              src={welcomeIcon} 
              alt="Welcome House" 
              className="w-full h-full object-cover scale-[1.15] translate-y-2"
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

          <div className="bg-[#e0f2fe] rounded-full px-5 py-2.5 flex items-center justify-center gap-2 text-[13px] font-bold text-[#0c4a6e] shadow-sm border border-[#bae6fd]">
            <Lock size={14} className="text-[#0284c7]" /> 
            No sign-up • Nothing is saved
          </div>
        </div>

        {/* Bottom Drawer Selection */}
        <div className="bg-white rounded-t-[2.5rem] px-8 pt-8 pb-10 shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.05)] relative z-20 flex flex-col">
            
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-extrabold text-[#35322d]">
              Select language
            </h3>
            <div className="flex gap-1.5">
              <div className="w-8 h-2 rounded-full bg-[#136d41]"></div>
              <div className="w-2 h-2 rounded-full bg-slate-200"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setSelectedLang('en')}
              className={`relative aspect-[4/3] rounded-[2rem] p-4 flex flex-col justify-center items-center text-center transition-all duration-300 ease-out border-[3px] ${
                selectedLang === 'en' 
                  ? 'bg-gradient-to-br from-[#fffdf5] to-[#fff4cc] border-[#fbbf24] shadow-sm scale-[1.02]' 
                  : 'bg-slate-50 border-transparent shadow-sm hover:bg-slate-100'
              }`}
            >
              {selectedLang === 'en' && (
                <div className="absolute top-4 right-4 bg-white rounded-full p-0.5 shadow-sm">
                  <CheckCircle2 size={24} className="fill-[#f59e0b] text-white" />
                </div>
              )}
              <span className={`font-extrabold text-2xl tracking-tight ${selectedLang === 'en' ? 'text-[#78350f]' : 'text-slate-500'}`}>
                English
              </span>
              {selectedLang === 'en' && <span className="text-xs font-bold mt-1 text-[#b45309] opacity-80 uppercase tracking-wider">Selected</span>}
            </button>

            <button
              onClick={() => setSelectedLang('es')}
              className={`relative aspect-[4/3] rounded-[2rem] p-4 flex flex-col justify-center items-center text-center transition-all duration-300 ease-out border-[3px] ${
                selectedLang === 'es' 
                  ? 'bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] border-[#38bdf8] shadow-sm scale-[1.02]' 
                  : 'bg-slate-50 border-transparent shadow-sm hover:bg-slate-100'
              }`}
            >
              {selectedLang === 'es' && (
                <div className="absolute top-4 right-4 bg-white rounded-full p-0.5 shadow-sm">
                  <CheckCircle2 size={24} className="fill-[#0284c7] text-white" />
                </div>
              )}
              <span className={`font-extrabold text-2xl tracking-tight ${selectedLang === 'es' ? 'text-[#0c4a6e]' : 'text-slate-500'}`}>
                Español
              </span>
              {selectedLang === 'es' && <span className="text-xs font-bold mt-1 text-[#0284c7] opacity-80 uppercase tracking-wider">Seleccionado</span>}
            </button>
          </div>

          <div className="h-[72px]"> {/* Fixed height container to prevent layout jumping */}
            {selectedLang && (
              <button
                onClick={onNext}
                className="w-full h-full rounded-[2rem] font-extrabold text-xl flex items-center justify-center gap-3 transition-colors duration-300 bg-[#136d41] text-white shadow-md hover:bg-[#0f5c35]"
              >
                {selectedLang === 'es' ? 'Continuar' : 'Continue'} <ArrowRight size={24} strokeWidth={3} />
              </button>
            )}
          </div>
          
        </div>

      </div>
    </div>
  );
}
