import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { EmailManager } from './components/EmailManager';

export default function App() {
  const [showManager, setShowManager] = useState(false);

  if (showManager) {
    return <EmailManager onBack={() => setShowManager(false)} />;
  }

  return <LandingPage onGetStarted={() => setShowManager(true)} />;
}
