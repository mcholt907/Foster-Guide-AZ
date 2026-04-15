import { useState } from 'react';
import { ChevronLeft, Phone, MessageSquare, HeartPulse } from 'lucide-react';
import { CRISIS_PINS } from '../../../web/src/data/constants';

import groundingImg from '../assets/wellness/grounding.png';
import breathingImg from '../assets/wellness/breathing.png';
import journalImg from '../assets/wellness/journal.png';
import musicImg from '../assets/wellness/music.png';

interface Props {
  onBack?: () => void;
}

const GROUNDING_STEPS_EN = [
  { n: 5, sense: "things you can see", icon: "👁️" },
  { n: 4, sense: "things you can touch", icon: "✋" },
  { n: 3, sense: "things you can hear", icon: "👂" },
  { n: 2, sense: "things you can smell", icon: "👃" },
  { n: 1, sense: "thing you can taste", icon: "👅" },
];

const COPING_TOOLS_EN = [
  {
    id: "breathe",
    iconSrc: breathingImg,
    title: "Box breathing",
    desc: "Breathe in for 4 counts, hold for 4, out for 4, hold for 4. Repeat 3 times. Your body will slow down.",
  },
  {
    id: "journal",
    iconSrc: journalImg,
    title: "3-line journal",
    desc: "Write 3 lines: what happened, how I felt, one thing I'm grateful for. Any time, any day.",
  },
  {
    id: "move",
    iconSrc: musicImg,
    title: "Move your body",
    desc: "Even 5 minutes of walking, stretching, or dancing to one song can shift how you feel.",
  },
];

export default function WellnessPrototype({ onBack }: Props = {}) {
  const [groundingActive, setGroundingActive] = useState(false);
  const [groundingStep, setGroundingStep] = useState(0);

  function startGrounding() {
    setGroundingStep(0);
    setGroundingActive(true);
  }

  function nextGroundingStep() {
    if (groundingStep < GROUNDING_STEPS_EN.length - 1) {
      setGroundingStep((s) => s + 1);
    } else {
      setGroundingActive(false);
      setGroundingStep(0);
    }
  }

  const currentStep = GROUNDING_STEPS_EN[groundingStep];

  return (
    <div className="w-full bg-[#FFF9F3] min-h-screen font-['Outfit',_sans-serif] flex justify-center">
      <div className="w-full max-w-[480px] bg-[#FFF9F3] relative flex flex-col shadow-xl">

        {/* Top Header */}
        <div className="px-4 py-4 flex items-center gap-3 sticky top-0 bg-[#FFF9F3]/90 backdrop-blur-md z-30">
          {onBack && (
            <button
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors shrink-0"
              aria-label="Back to home"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
          )}
          <div className="w-8 h-8 flex items-center justify-center bg-[#E1EAF4] rounded-full shrink-0">
            <HeartPulse size={16} className="text-[#1B3A5C]" />
          </div>
          <h1 className="text-lg font-bold text-[#1B3A5C] tracking-tight flex-1">Wellness Check-In</h1>
        </div>

        <div className="px-4 pb-24 space-y-5">
          {/* Hero Banner Area */}
          <div className="bg-gradient-to-br from-[#E1EAF4] to-[#C9DBEE] rounded-[32px] p-8 relative overflow-hidden group border border-[#B3D6DB]/20">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
               <h2 className="text-2xl font-bold text-[#1B3A5C]">Wellness Check-In</h2>
               <p className="text-[#2C5F8E] text-sm leading-relaxed px-4">
                 Tools for when things feel overwhelming.
               </p>
            </div>
          </div>

          {/* 5-4-3-2-1 Grounding */}
          <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center shadow-inner shrink-0 overflow-hidden border border-blue-100">
                <img src={groundingImg} alt="Grounding" className="w-14 h-14 object-contain scale-[1.2]" />
              </div>
              <div className="pt-2">
                <div className="text-base font-bold text-[#1B3A5C]">
                  5-4-3-2-1 Grounding Exercise
                </div>
                <div className="text-sm text-gray-500 mt-1 leading-snug">
                  Helps calm your mind in under 2 minutes.
                </div>
              </div>
            </div>

            <div className="mt-5">
              {!groundingActive ? (
                <button
                  onClick={startGrounding}
                  className="w-full rounded-full bg-[#1B3A5C] px-4 py-4 text-[15px] font-semibold text-white shadow-md hover:bg-[#122b46] active:scale-[0.98] transition-all"
                >
                  Start exercise
                </button>
              ) : (
                <div className="rounded-[20px] bg-[#E1EAF4] p-6 text-center shadow-inner">
                  <div className="text-6xl mb-4 drop-shadow-sm">{currentStep.icon}</div>
                  <div className="text-4xl font-black text-[#1B3A5C] mb-2">{currentStep.n}</div>
                  <div className="text-base text-[#2C5F8E] font-medium mb-6">
                    Name {currentStep.n} {currentStep.sense}
                  </div>
                  {/* Step dots */}
                  <div className="flex justify-center gap-2 mb-6">
                    {GROUNDING_STEPS_EN.map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i === groundingStep ? "w-6 bg-[#1B3A5C]" : i < groundingStep ? "w-2 bg-[#1B3A5C]/40" : "w-2 bg-[#B3D6DB]"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={nextGroundingStep}
                    className="w-full rounded-full bg-[#1B3A5C] px-6 py-3.5 text-[15px] font-semibold text-white shadow-md hover:bg-[#122b46] transition-all active:scale-[0.98]"
                  >
                    {groundingStep < GROUNDING_STEPS_EN.length - 1
                      ? "Next Step →"
                      : "Finished ✓"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Coping tools */}
          <div className="grid gap-3">
            {COPING_TOOLS_EN.map((tool) => (
              <div key={tool.id} className="rounded-[24px] bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-transparent hover:border-blue-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 shrink-0 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden border border-gray-100">
                    <img src={tool.iconSrc} alt={tool.title} className="w-12 h-12 object-contain scale-[1.2]" />
                  </div>
                  <div className="pt-1">
                    <div className="text-[15px] font-bold text-[#1B3A5C] mb-1">{tool.title}</div>
                    <p className="text-sm text-gray-500 leading-relaxed pr-2">{tool.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Crisis contacts */}
          <div className="mt-6 rounded-[28px] bg-blue-50/50 p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="text-xl shrink-0 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm">💙</div>
              <div className="text-[15px] font-bold text-[#1B3A5C]">
                You're not alone — real people who care
              </div>
            </div>
            
            <div className="grid gap-3">
              {CRISIS_PINS.map((c) => (
                <div key={c.name} className="rounded-[20px] bg-white p-4 shadow-sm">
                  <div className="text-[15px] font-bold text-gray-800 mb-0.5">{c.name}</div>
                  <div className="text-xs text-gray-500 mb-3">{c.how}</div>
                  <div className="flex gap-2">
                    {c.url.startsWith("tel:") ? (
                      <a
                        href={c.url}
                        className="flex items-center gap-1.5 rounded-full bg-[#E1EAF4] hover:bg-[#C9DBEE] px-4 py-2 text-[13px] font-bold text-[#1B3A5C] transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        Call
                      </a>
                    ) : c.url.startsWith("sms:") ? (
                      <a
                        href={c.url}
                        className="flex items-center gap-1.5 rounded-full bg-[#E1EAF4] hover:bg-[#C9DBEE] px-4 py-2 text-[13px] font-bold text-[#1B3A5C] transition-colors"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Text
                      </a>
                    ) : (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-full bg-gray-100 hover:bg-gray-200 px-4 py-2 text-[13px] font-bold text-gray-600 transition-colors"
                      >
                        Open
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reminder */}
          <div className="mt-6 rounded-[24px] bg-[#E6F8EA] p-5 shadow-sm">
            <div className="flex items-start gap-4 text-[#1A4226]">
              <span className="text-2xl shrink-0 bg-white/50 w-10 h-10 rounded-full flex items-center justify-center">🌱</span>
              <p className="text-[14px] font-medium leading-relaxed pt-1">
                What you feel makes sense given what you've been through. Reaching out is a strength, not a weakness.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
