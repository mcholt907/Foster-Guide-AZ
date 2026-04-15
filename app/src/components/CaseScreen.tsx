import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import MeetYourTeam from './MeetYourTeam';
import MyCaseExplained from './MyCaseExplained';

type Tab = 'case' | 'team';

interface Props {
  onBack: () => void;
  initialTab?: Tab;
}

export default function CaseScreen({ onBack, initialTab = 'case' }: Props) {
  const [tab, setTab] = useState<Tab>(initialTab);

  return (
    <div className="w-full min-h-screen bg-[#FDF9F3]">
      {/* Sticky header with back + tabs */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors shrink-0"
          aria-label="Back to home"
        >
          <ChevronLeft size={20} className="text-slate-600" />
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setTab('case')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              tab === 'case' ? 'bg-[#2A7F8E] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            My Case
          </button>
          <button
            onClick={() => setTab('team')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              tab === 'team' ? 'bg-[#2A7F8E] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Meet Your Team
          </button>
        </div>
      </div>

      {tab === 'case' ? <MyCaseExplained isEmbedded /> : <MeetYourTeam isEmbedded />}
    </div>
  );
}
