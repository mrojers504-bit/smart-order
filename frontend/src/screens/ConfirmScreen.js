import React from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '../store/useStore';

export default function ConfirmScreen() {
  const { t } = useTranslation();
  const { selectedCombo, addToCart, setScreen, SCREENS } = useStore();

  if (!selectedCombo) {
    setScreen(SCREENS.COMBOS);
    return null;
  }

  const name = typeof selectedCombo.name === 'object' ? selectedCombo.name?.ru : selectedCombo.name;

  return (
    <div className="flex flex-col w-full h-full bg-white animate-slide-up">
      {/* Hero image — фиксированная высота, не сжимается */}
      <div className="relative w-full shrink-0" style={{ height: '42%' }}>
        {selectedCombo.imageUrl ? (
          <img
            src={selectedCombo.imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-8xl">
            🍽️
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        <button
          onClick={() => setScreen(SCREENS.COMBOS)}
          className="absolute top-5 left-5 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white text-xl active:opacity-60"
        >
          ←
        </button>
      </div>

      {/* Прокручиваемый контент */}
      <div className="flex-1 overflow-y-auto px-6 pt-2 pb-2">
        <h2 className="text-3xl font-black text-brand-dark mb-1">{name}</h2>

        <div className="flex items-center gap-4 mb-4">
          <span className="text-3xl font-black text-brand-red">
            {t('price', { amount: selectedCombo.totalPrice.toFixed(2) })}
          </span>
          {selectedCombo.maxCookingTime > 0 && (
            <span className="text-gray-500 font-medium">
              {t('cooking_time', { min: selectedCombo.maxCookingTime })}
            </span>
          )}
        </div>

        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">{t('composition')}</p>
        <div className="space-y-2">
          {selectedCombo.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-brand-dark font-medium">{item.name}</span>
              <div className="flex gap-3 text-sm text-gray-400">
                {item.weight && <span>{t('weight', { val: item.weight })}</span>}
                {item.energyFullAmount && <span>{t('kcal', { val: item.energyFullAmount })}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Кнопка всегда прибита к низу */}
      <div className="shrink-0 px-6 pb-8 pt-3 bg-white border-t border-gray-100">
        <button
          onClick={addToCart}
          className="w-full py-5 bg-brand-red hover:bg-brand-red-dark active:scale-95 transition-all rounded-2xl text-white text-2xl font-black shadow-lg shadow-red-900/30"
        >
          {t('add_to_cart')}
        </button>
      </div>
    </div>
  );
}
