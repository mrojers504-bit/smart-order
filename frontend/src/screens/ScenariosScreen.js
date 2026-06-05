import React from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '../store/useStore';

const SCENARIO_CONFIG = [
  { type: 'fast', icon: '⚡', descKey: 'scenario_fast_desc', labelKey: 'scenario_fast', color: 'from-yellow-600 to-yellow-500' },
  { type: 'profitable', icon: '💰', descKey: 'scenario_profitable_desc', labelKey: 'scenario_profitable', color: 'from-green-700 to-green-500' },
  { type: 'popular', icon: '🔥', descKey: 'scenario_popular_desc', labelKey: 'scenario_popular', color: 'from-orange-700 to-orange-500' },
  { type: 'group', icon: '👥', descKey: 'scenario_group_desc', labelKey: 'scenario_group', color: 'from-blue-700 to-blue-500' },
];

export default function ScenariosScreen() {
  const { t } = useTranslation();
  const { setScenario, fetchCombos, setScreen, SCREENS } = useStore();

  const handleSelect = (type) => {
    setScenario(type);
    fetchCombos(type);
  };

  return (
    <div className="flex flex-col w-full h-full bg-white">
      {/* Header */}
      <div className="bg-brand-dark px-6 pt-8 pb-6">
        <button
          onClick={() => setScreen(SCREENS.WELCOME)}
          className="text-gray-400 text-sm mb-4 flex items-center gap-1 active:opacity-60"
        >
          ← {t('cancel')}
        </button>
        <h2 className="text-3xl font-black text-white">{t('choose_scenario')}</h2>
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-2 gap-4 p-6 bg-gray-50">
        {SCENARIO_CONFIG.map((s) => (
          <button
            key={s.type}
            onClick={() => handleSelect(s.type)}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-white shadow-md active:scale-95 transition-transform duration-150 border-2 border-transparent active:border-brand-red"
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
              <span className="text-3xl">{s.icon}</span>
            </div>
            <span className="text-xl font-black text-brand-dark">{t(s.labelKey)}</span>
            <span className="text-sm text-gray-500 text-center leading-tight">{t(s.descKey, { min: 10 })}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
