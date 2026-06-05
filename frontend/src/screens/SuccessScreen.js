import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '../store/useStore';

export default function SuccessScreen() {
  const { t } = useTranslation();
  const { setScreen, reset, SCREENS } = useStore();

  // Auto-navigate to welcome after 8 sec
  useEffect(() => {
    const timer = setTimeout(() => reset(), 8000);
    return () => clearTimeout(timer);
  }, [reset]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-brand-dark animate-bounce-in">
      {/* Success icon */}
      <div className="w-32 h-32 mb-8 rounded-full bg-brand-red flex items-center justify-center shadow-2xl shadow-red-900/60">
        <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-5xl font-black text-white mb-3">{t('added_title')}</h1>
      <p className="text-xl text-gray-400 mb-12 text-center px-8">{t('added_subtitle')}</p>

      <div className="w-full px-8 flex flex-col gap-4">
        <button
          onClick={() => setScreen(SCREENS.PAYMENT)}
          className="w-full py-5 bg-brand-red hover:bg-brand-red-dark active:scale-95 transition-all rounded-2xl text-white text-2xl font-black shadow-lg shadow-red-900/50"
        >
          {t('go_to_pay')}
        </button>
        <button
          onClick={() => setScreen(SCREENS.SCENARIOS)}
          className="w-full py-4 border-2 border-gray-600 hover:border-gray-400 active:scale-95 transition-all rounded-2xl text-gray-300 text-xl font-semibold"
        >
          {t('continue_order')}
        </button>
      </div>
    </div>
  );
}
