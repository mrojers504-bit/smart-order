import React from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '../store/useStore';

export default function CombosScreen() {
  const { t } = useTranslation();
  const { combos, cart, selectedScenario, loading, error, selectCombo, setScreen, SCREENS, fetchCombos } = useStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-white gap-4">
        <p className="text-gray-600 text-lg">{t('error_load')}</p>
        <button
          onClick={() => fetchCombos(selectedScenario)}
          className="px-8 py-3 bg-brand-red text-white rounded-2xl font-bold"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col w-full h-full bg-gray-50">
      {/* Header */}
      <div className="bg-brand-dark px-6 pt-8 pb-6 shrink-0">
        <button
          onClick={() => setScreen(SCREENS.SCENARIOS)}
          className="text-gray-400 text-sm mb-4 flex items-center gap-1 active:opacity-60"
        >
          ← {t('cancel')}
        </button>
        <h2 className="text-3xl font-black text-white">{t('combos_title')}</h2>
      </div>

      {/* Плавающая кнопка корзины */}
      {cart.length > 0 && (
        <button
          onClick={() => setScreen(SCREENS.CART)}
          className="absolute bottom-6 right-6 z-20 bg-brand-red text-white rounded-2xl px-5 py-3 flex items-center gap-3 shadow-xl shadow-red-900/40 active:scale-95 transition-transform"
        >
          <span className="text-xl">🛒</span>
          <span className="font-black text-lg">{cart.length}</span>
          <span className="font-semibold text-sm opacity-80">
            {cart.reduce((s, c) => s + (c.totalPrice || 0), 0).toFixed(2)} ₼
          </span>
        </button>
      )}

      {/* Scrollable cards */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">
        {combos.length === 0 ? (
          <p className="text-center text-gray-400 mt-12 text-lg">{t('empty_combo')}</p>
        ) : (
          combos.map((combo) => (
            <ComboCard key={combo.id} combo={combo} onSelect={selectCombo} />
          ))
        )}
      </div>
    </div>
  );
}

function ComboCard({ combo, onSelect }) {
  const { t } = useTranslation();

  return (
    <button
      onClick={() => onSelect(combo)}
      className="w-full bg-white rounded-3xl shadow-sm overflow-hidden flex text-left active:scale-[0.98] transition-transform duration-150 border border-gray-100"
    >
      {/* Image */}
      <div className="w-36 h-36 shrink-0 bg-gray-200 relative overflow-hidden">
        {combo.imageUrl ? (
          <img src={combo.imageUrl} alt={combo.name?.ru || combo.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
        )}
        {combo.maxCookingTime > 0 && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-full">
            {t('cooking_time', { min: combo.maxCookingTime })}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between p-4 flex-1 min-w-0">
        <div>
          <p className="text-lg font-black text-brand-dark leading-tight mb-1">
            {typeof combo.name === 'object' ? combo.name?.ru : combo.name}
          </p>
          <p className="text-sm text-gray-500 leading-snug line-clamp-2">
            {combo.items.map((i) => i.name).join(', ')}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-2xl font-black text-brand-red">
            {t('price', { amount: combo.totalPrice.toFixed(2) })}
          </span>
          <span className="text-xs bg-brand-red/10 text-brand-red font-bold px-3 py-1 rounded-full">
            {combo.items.length} позиции
          </span>
        </div>
      </div>
    </button>
  );
}
