import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import caseworkerAvatar from '../assets/avatars/caseworker.png';
import judgeAvatar from '../assets/avatars/judge.png';
import attorneyAvatar from '../assets/avatars/attorney.png';
import casaAvatar from '../assets/avatars/casa.png';
import caregiverAvatar from '../assets/avatars/caregiver.png';
import galAvatar from '../assets/avatars/gal.png';
import supervisorAvatar from '../assets/avatars/supervisor.png';
import groupAvatar from '../assets/avatars/group_avatar.png';

const TEAM_MEMBERS = [
  {
    title: "Social Worker",
    what: "Your main helper. They visit you and make sure you're safe and have what you need.",
    bgColor: "bg-blue-100", // #dbeafe
    imgSrc: caseworkerAvatar,
  },
  {
    title: "Judge",
    what: "The person who listens to everyone and makes the final decisions about where you'll live.",
    bgColor: "bg-green-100", // #dcfce7
    imgSrc: judgeAvatar,
  },
  {
    title: "Foster Parent or Caregiver",
    what: "The person or family taking care of you at your new home.",
    bgColor: "bg-yellow-200", // #fef08a
    imgSrc: caregiverAvatar,
  },
  {
    title: "Lawyer",
    what: "Your special advocate. They speak up for you and tell the judge what you want.",
    bgColor: "bg-orange-100", // #ffedd5
    imgSrc: attorneyAvatar,
  },
  {
    title: "CASA Volunteer",
    what: "A community volunteer who gets to know you personally and speaks up for you in court.",
    bgColor: "bg-purple-100", // #f3e8ff
    imgSrc: casaAvatar,
  },
  {
    title: "Guardian ad Litem",
    what: "Appointed by the court specifically to represent your best interests.",
    bgColor: "bg-pink-100", // #fce7f3
    imgSrc: galAvatar,
  },
  {
    title: "DCS Supervisor",
    what: "Your caseworker's boss. Who you can talk to if things aren't getting fixed.",
    bgColor: "bg-teal-100", // #ccfbf1
    imgSrc: supervisorAvatar,
  }
];

const FAQS = [
  {
    q: "Can I talk to the judge?",
    a: "Yes, you can! You can talk to the judge in court or in their office. Your lawyer can help you with this."
  },
  {
    q: "Who can I talk to if I'm scared?",
    a: "You can reach out to your Caseworker, CASA Volunteer, or Attorney immediately. They are there to keep you safe."
  },
  {
    q: "What if I don't like my foster home?",
    a: "Tell your Caseworker or Lawyer. They will listen to your concerns and can advocate for a better situation if needed."
  },
  {
    q: "How often will I see my social worker?",
    a: "By law, your DCS Case Manager is required to visit you at least once a month in person."
  }
];

export default function MeetYourTeam({ isEmbedded = false }) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const containerClass = isEmbedded ? "w-full overflow-y-auto font-['Outfit',_sans-serif]" : "min-h-screen bg-[#FDF9F3] text-[#35322d] font-['Outfit',_sans-serif]";

  return (
    <div className={containerClass}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <img 
            src={groupAvatar} 
            alt="Your Team" 
            className="w-56 sm:w-72 h-auto mb-8 object-cover rounded-[2.5rem] shadow-sm border border-slate-200"
          />
          <h1 className="text-4xl font-bold text-[#629DA7] mb-3 font-sans" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Meet Your Team
          </h1>
          <p className="text-slate-600 text-lg">
            These are the helpful people here to support you on your journey.
          </p>
        </div>

        {/* Team Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {TEAM_MEMBERS.map((member, idx) => (
            <div 
              key={idx} 
              className={`rounded-3xl p-6 ${member.bgColor} shadow-sm border border-black/5 hover:shadow-md transition-shadow flex items-start space-x-5`}
            >
              <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full overflow-hidden shadow-inner flex items-center justify-center relative">
                 <img 
                    src={member.imgSrc} 
                    alt={member.title} 
                    className="object-cover w-full h-full scale-[1.3] pt-4"
                  />
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{member.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {member.what}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl text-center font-semibold text-[#629DA7] mb-6 font-sans">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFAQ === idx;
              return (
                <div key={idx} className="bg-[#DDEBFA] rounded-xl overflow-hidden text-[#1E3A5F]">
                  <button
                    onClick={() => setOpenFAQ(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left font-medium hover:bg-[#c9e0f6] transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-sm bg-white pt-3 border-x border-b border-[#DDEBFA] rounded-b-xl shadow-sm">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
