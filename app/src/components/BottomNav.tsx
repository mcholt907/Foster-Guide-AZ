import { House, FolderOpen, Users, HeartHandshake, HelpCircle } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard',    icon: House,          label: 'Home' },
  { id: 'case',         icon: FolderOpen,     label: 'My Case' },
  { id: 'team',         icon: Users,          label: 'My Team' },
  { id: 'wellness',     icon: HeartHandshake, label: 'Wellness' },
  { id: 'find-answers', icon: HelpCircle,     label: 'Answers' },
] as const;

interface Props {
  screen: string;
  onNavigate: (screen: string) => void;
}

export default function BottomNav({ screen, onNavigate }: Props) {
  return (
    <nav
      className="fixed bottom-6 inset-x-4 z-40 pointer-events-none md:hidden"
      style={{ fontFamily: 'Outfit, sans-serif' }}
    >
      <div className="mx-auto flex max-w-[480px] items-center justify-between rounded-[2.5rem] bg-white/95 p-2.5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.15),0_8px_20px_-8px_rgba(19,109,65,0.2)] backdrop-blur-xl border-2 border-white pointer-events-auto">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
          const isActive = screen === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="relative flex flex-col items-center justify-center rounded-2xl w-[72px] h-[64px] transition-all group"
            >
              <div className={`flex flex-col items-center gap-1.5 transition-transform duration-300 ${isActive ? '-translate-y-1.5' : 'translate-y-0 group-hover:-translate-y-0.5'}`}>
                
                {/* squishy icon container */}
                <div className={`p-2.5 rounded-[1.2rem] transition-colors duration-300 ${
                  isActive 
                    ? 'bg-[#136d41] text-white shadow-[0_8px_20px_-6px_rgba(19,109,65,0.5)]' 
                    : 'bg-transparent text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600'
                }`}>
                  <Icon 
                    className="h-[24px] w-[24px] shrink-0 transition-all duration-300" 
                    strokeWidth={isActive ? 3 : 2.5} 
                  />
                </div>

                {/* label */}
                <span className={`text-[10px] font-extrabold leading-none tracking-wide whitespace-nowrap transition-colors duration-300 ${
                  isActive ? 'text-[#136d41] scale-105' : 'text-slate-400'
                }`}>
                  {label}
                </span>

              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
