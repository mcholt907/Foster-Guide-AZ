import { useState } from 'react'
import DashboardPrototype from './components/DashboardPrototype'
import CaseScreen from './components/CaseScreen'
import FindAnswersPrototype from './components/FindAnswersPrototype'
import WellnessPrototype from './components/WellnessPrototype'
import LanguageSelectionPrototype from './components/LanguageSelectionPrototype'
import AgeSelectionPrototype from './components/AgeSelectionPrototype'
import BottomNav from './components/BottomNav'
import DashboardTeen from './components/DashboardTeen'
import MeetYourTeamTeen from './components/MeetYourTeamTeen'
import MyCaseExplainedTeen from './components/MyCaseExplainedTeen'
import WellnessTeen from './components/WellnessTeen'
import FindAnswersTeen from './components/FindAnswersTeen'

type Screen = 'dashboard' | 'case' | 'team' | 'find-answers' | 'wellness' | 'onboarding' | 'age-select'

function App() {
  const [screen, setScreen] = useState<Screen>('dashboard')

  const goBack = () => setScreen('dashboard')
  const showNav = screen !== 'onboarding' && screen !== 'age-select'

  const handleNavigate = (s: string) => {
    if (s === 'answers') setScreen('find-answers');
    else setScreen(s as Screen);
  };

  return (
    <>
      {screen === 'onboarding' && <LanguageSelectionPrototype onNext={() => setScreen('age-select')} />}
      {screen === 'age-select' && (
        <AgeSelectionPrototype
          onNext={() => setScreen('dashboard')}
          onBack={() => setScreen('onboarding')}
          onChangeLanguage={() => setScreen('onboarding')}
        />
      )}
      {screen === 'dashboard' && <DashboardTeen onNavigate={handleNavigate} />}
      {screen === 'case' && <MyCaseExplainedTeen onNavigate={handleNavigate} />}
      {screen === 'team' && <MeetYourTeamTeen onNavigate={handleNavigate} />}
      {screen === 'wellness' && <WellnessTeen onNavigate={handleNavigate} />}
      {screen === 'find-answers' && <FindAnswersTeen onNavigate={handleNavigate} />}
      {showNav && (
        <div className="md:hidden">
          <BottomNav screen={screen} onNavigate={handleNavigate} />
        </div>
      )}
    </>
  )
}

export default App
