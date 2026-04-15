import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import caseHeaderIcon from '../assets/my_case/case_header_icon.png';
import safetyHearingIcon from '../assets/my_case/safety_hearing_icon.png';
import factsHearingIcon from '../assets/my_case/facts_hearing_icon.png';
import checkinHearingIcon from '../assets/my_case/checkin_hearing_icon.png';
import longTermPlanIcon from '../assets/my_case/long_term_plan_icon.png';

const STAGES = [
  {
    id: "prelim",
    title: "First Safety Hearing",
    imgIcon: safetyHearingIcon,
    bgColor: "bg-blue-50",
    accentColor: "bg-blue-200",
    numberBg: "bg-blue-500",
    what: "The judge checks that you're safe and makes a quick decision about where you'll stay — usually within just a few days of coming into care.",
    forYou: "Before the hearing starts, tell your lawyer anything you want the judge to know. Your voice matters right from the start.",
    next: "The dates for your next hearings get set, so everyone knows what's coming.",
  },
  {
    id: "adjudication",
    title: "Facts Hearing",
    imgIcon: factsHearingIcon,
    bgColor: "bg-purple-50",
    accentColor: "bg-purple-200",
    numberBg: "bg-purple-500",
    what: "The court looks at all the facts and decides if the concerns in your case are true and if your case should keep going.",
    forYou: 'Ask your lawyer: "What does this mean for where I live and my school?" They\'re there to explain everything to you.',
    next: "Your case plan — the plan for your care — gets reviewed and updated based on what the court decided.",
  },
  {
    id: "review",
    title: "Check-In Hearing",
    imgIcon: checkinHearingIcon,
    bgColor: "bg-teal-50",
    accentColor: "bg-teal-200",
    numberBg: "bg-teal-500",
    what: "The judge checks in on how your plan is going — what's working and what might need to change.",
    forYou: "Come ready with 1 or 2 things you want people to know: what's going well and what isn't. You deserve to be heard.",
    next: "More check-in hearings get scheduled, or you move toward planning what happens long-term.",
  },
  {
    id: "permanency",
    title: "Long-Term Plan Hearing",
    imgIcon: longTermPlanIcon,
    bgColor: "bg-amber-50",
    accentColor: "bg-amber-200",
    numberBg: "bg-amber-500",
    what: "The judge talks about the long-term plan for your future — like going back home, living with a guardian, or being adopted.",
    forYou: "Ask your lawyer to walk you through each option in plain words. You have a say in this — your opinion counts.",
    next: "Everyone starts taking steps toward making that long-term plan happen.",
  },
];

const FAQS = [
  {
    q: "Do I have to go to court?",
    a: "Usually yes — but your lawyer will tell you what to expect ahead of time. You won't be alone. Your lawyer goes with you.",
  },
  {
    q: "Can I talk to the judge?",
    a: "Yes! You can speak up at hearings through your lawyer, or ask to speak directly to the judge. Judges want to hear from you.",
  },
  {
    q: "What if I don't understand what's happening?",
    a: "Stop and ask your lawyer to explain it — that's their job. You should understand everything that's going on in your case.",
  },
  {
    q: "How many hearings will there be?",
    a: "Every case is different. Some end quickly, others take longer. Your lawyer can give you a better idea of what to expect for your specific case.",
  },
];

export default function MyCaseExplained({ isEmbedded = false }) {
  const [openStage, setOpenStage] = useState<string | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const containerClass = isEmbedded
    ? "w-full overflow-y-auto font-['Outfit',_sans-serif]"
    : "min-h-screen bg-[#FDF9F3] text-[#35322d] font-['Outfit',_sans-serif]";

  return (
    <div className={containerClass}>
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-10 pt-2">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-white rounded-[2rem] shadow-sm border border-black/5 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#DDEBFA]/50 to-transparent pointer-events-none"></div>
              <img src={caseHeaderIcon} alt="Balance Scale" className="w-24 h-24 object-cover scale-[1.15] mix-blend-multiply" />
            </div>
          </div>
          <h1
            className="text-4xl font-bold text-[#629DA7] mb-3"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            My Case Explained
          </h1>
          <p className="text-slate-600 text-lg">
            Here's what happens in court — step by step, in plain language.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mb-16">
          <div className="grid gap-4">
            {STAGES.map((stage, idx) => {
              const isOpen = openStage === stage.id;
              return (
                <div key={stage.id} className="relative z-10">
                  <div className={`rounded-3xl overflow-hidden shadow-sm border border-black/5 ${stage.bgColor}`}>
                    <button
                      onClick={() => setOpenStage(isOpen ? null : stage.id)}
                      className="w-full flex items-center gap-4 px-5 py-4 text-left hover:brightness-[0.97] transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <img src={stage.imgIcon} alt="" className="w-14 h-14 object-contain drop-shadow-sm scale-[1.1]" />
                          <span className="text-xl font-bold text-gray-800">{stage.title}</span>
                        </div>
                      </div>
                      {isOpen
                        ? <ChevronUp size={20} className="shrink-0 text-gray-500" />
                        : <ChevronDown size={20} className="shrink-0 text-gray-500" />
                      }
                    </button>

                    {isOpen && (
                      <div className="border-t border-black/5 px-5 pb-5 pt-5 grid gap-4">

                        {/* What happens */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                          <div className="text-lg font-extrabold text-slate-800 mb-2">
                            👀 What happens
                          </div>
                          <p className="text-[17px] text-slate-600 leading-relaxed font-medium">{stage.what}</p>
                        </div>

                        {/* For you */}
                        <div className="bg-[#fffdf5] border-2 border-[#fbbf24] rounded-[2rem] p-6">
                          <div className="text-lg font-extrabold text-[#b45309] mb-2">
                            ✋ Your turn
                          </div>
                          <p className="text-[17px] text-[#78350f] leading-relaxed font-medium">{stage.forYou}</p>
                        </div>

                        {/* What's next */}
                        <div className={`${stage.accentColor}/50 border-2 border-white rounded-[2rem] p-6`}>
                          <div className="text-lg font-extrabold text-slate-800 mb-2">
                            ➡️ What's next
                          </div>
                          <p className="text-[17px] text-slate-700 leading-relaxed font-medium">{stage.next}</p>
                        </div>

                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-2xl text-center font-extrabold text-[#115e59] mb-6"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Questions you might have
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFAQ === idx;
              return (
                <div key={idx} className="bg-[#DDEBFA]/50 border-2 border-[#DDEBFA] rounded-[2rem] overflow-hidden text-[#1E3A5F]">
                  <button
                    onClick={() => setOpenFAQ(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left font-extrabold text-lg transition-colors hover:bg-[#DDEBFA]"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-[17px] font-medium leading-relaxed bg-white border-x-2 border-b-2 border-[#DDEBFA] rounded-b-[2rem] shadow-sm">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Safe notice */}
        <div className="mt-16 max-w-2xl mx-auto rounded-3xl bg-slate-50 border-2 border-slate-100 px-6 py-5 text-[15px] font-medium text-slate-500 text-center leading-relaxed">
          This is general information, not legal advice. Talk to your lawyer about your specific case — they're there to help you.
        </div>

      </div>
    </div>
  );
}
