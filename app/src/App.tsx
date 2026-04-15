import { useState } from 'react'
import DashboardPrototype from './components/DashboardPrototype'
import CaseScreen from './components/CaseScreen'
import FindAnswersPrototype from './components/FindAnswersPrototype'
import WellnessPrototype from './components/WellnessPrototype'
import LanguageSelectionPrototype from './components/LanguageSelectionPrototype'

type Screen = 'dashboard' | 'case' | 'team' | 'find-answers' | 'wellness' | 'onboarding'

function App() {
  const [screen, setScreen] = useState<Screen>('onboarding')

  const goBack = () => setScreen('dashboard')

  if (screen === 'onboarding') return <LanguageSelectionPrototype onNext={() => setScreen('dashboard')} />
  if (screen === 'case') return <CaseScreen onBack={goBack} initialTab="case" />
  if (screen === 'team') return <CaseScreen onBack={goBack} initialTab="team" />
  if (screen === 'find-answers') return <FindAnswersPrototype onBack={goBack} />
  if (screen === 'wellness') return <WellnessPrototype onBack={goBack} />
  return <DashboardPrototype onNavigate={(s) => setScreen(s as Screen)} />
}

export default App
