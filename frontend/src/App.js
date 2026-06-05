import React, { useEffect } from 'react';
import useStore from './store/useStore';
import WelcomeScreen from './screens/WelcomeScreen';
import ScenariosScreen from './screens/ScenariosScreen';
import CombosScreen from './screens/CombosScreen';
import ConfirmScreen from './screens/ConfirmScreen';
import SuccessScreen from './screens/SuccessScreen';
import CartScreen from './screens/CartScreen';
import PaymentScreen from './screens/PaymentScreen';
import LanguageSwitcher from './components/LanguageSwitcher';

export default function App() {
  const { screen, SCREENS, fetchScenarios } = useStore();

  useEffect(() => {
    fetchScenarios();
  }, []);

  // Auto-reset after 3 min of inactivity (kiosk mode)
  useEffect(() => {
    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => useStore.getState().reset(), 3 * 60 * 1000);
    };
    window.addEventListener('touchstart', resetTimer);
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();
    return () => {
      clearTimeout(timer);
      window.removeEventListener('touchstart', resetTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, []);

  const screenMap = {
    [SCREENS.WELCOME]: <WelcomeScreen />,
    [SCREENS.SCENARIOS]: <ScenariosScreen />,
    [SCREENS.COMBOS]: <CombosScreen />,
    [SCREENS.CONFIRM]: <ConfirmScreen />,
    [SCREENS.SUCCESS]: <SuccessScreen />,
    [SCREENS.CART]: <CartScreen />,
    [SCREENS.PAYMENT]: <PaymentScreen />,
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans">
      <LanguageSwitcher />
      <div key={screen} className="w-full h-full animate-fade-in">
        {screenMap[screen] ?? <WelcomeScreen />}
      </div>
    </div>
  );
}
