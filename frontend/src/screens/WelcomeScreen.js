import React from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '../store/useStore';

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const { setScreen, SCREENS } = useStore();

  return (
    <div className="flex flex-col items-center justify-between w-full h-full bg-brand-dark">
      {/* Top hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="w-24 h-24 mb-8 rounded-full bg-brand-red flex items-center justify-center shadow-2xl">
          <span className="text-5xl">🍔</span>
        </div>
        <h1 className="text-4xl font-black text-white leading-tight mb-4">
          {t('welcome_title')}
        </h1>
        <p className="text-lg text-gray-400 max-w-sm">
          {t('welcome_subtitle')}
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="w-full px-8 pb-16 flex flex-col gap-4">
        <button
          onClick={() => setScreen(SCREENS.SCENARIOS)}
          className="w-full py-5 bg-brand-red hover:bg-brand-red-dark active:scale-95 transition-all duration-150 rounded-2xl text-white text-2xl font-black shadow-lg shadow-red-900/50"
        >
          {t('btn_yes')}
        </button>
        <button
          onClick={() => setScreen(SCREENS.SCENARIOS)}
          className="w-full py-4 bg-transparent border-2 border-gray-600 hover:border-gray-400 active:scale-95 transition-all duration-150 rounded-2xl text-gray-300 text-xl font-semibold"
        >
          {t('btn_as_usual')}
        </button>
      </div>
    </div>
  );
}
