import React from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '../store/useStore';

export default function CartScreen() {
  const { t } = useTranslation();
  const { cart, setScreen, SCREENS } = useStore();

  // Схлопываем одинаковые комбо в группы { combo, quantity, groupKey }
  const groups = cart.reduce((acc, combo, idx) => {
    const key = combo.id;
    const existing = acc.find((g) => g.key === key);
    if (existing) {
      existing.quantity += 1;
      existing.indices.push(idx);
    } else {
      acc.push({ key, combo, quantity: 1, indices: [idx] });
    }
    return acc;
  }, []);

  const total = cart.reduce((sum, combo) => sum + (combo.totalPrice || 0), 0);
  const totalCount = cart.length;

  const increment = (group) => {
    useStore.setState((s) => ({ cart: [...s.cart, group.combo] }));
  };

  const decrement = (group) => {
    useStore.setState((s) => {
      const newCart = [...s.cart];
      // Удаляем последний вхождение этого combo по id
      const lastIdx = [...newCart].map((c) => c.id).lastIndexOf(group.key);
      if (lastIdx !== -1) newCart.splice(lastIdx, 1);
      return { cart: newCart };
    });
  };

  return (
    <div className="flex flex-col w-full h-full bg-white animate-slide-up">
      {/* Header */}
      <div className="bg-brand-dark px-6 pt-8 pb-6 shrink-0">
        <button
          onClick={() => setScreen(SCREENS.SCENARIOS)}
          className="text-gray-400 text-sm mb-4 flex items-center gap-1 active:opacity-60"
        >
          ← {t('cart_back')}
        </button>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black text-white">{t('cart_title')}</h2>
          <span className="bg-brand-red text-white text-sm font-black px-3 py-1 rounded-full">
            {totalCount} {t('cart_items_count')}
          </span>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
          <span className="text-6xl mb-4">🛒</span>
          <p className="text-xl text-gray-400 font-medium">{t('cart_empty')}</p>
          <button
            onClick={() => setScreen(SCREENS.SCENARIOS)}
            className="mt-6 px-8 py-3 bg-brand-red text-white rounded-2xl font-bold text-lg"
          >
            {t('continue_order')}
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {groups.map((group) => {
              const name = typeof group.combo.name === 'object'
                ? group.combo.name?.ru
                : group.combo.name;
              const lineTotal = (group.combo.totalPrice || 0) * group.quantity;

              return (
                <div key={group.key} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
                  {/* Верхняя строка — фото + название + цена строки */}
                  <div className="flex items-center gap-3 p-3">
                    <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-gray-200">
                      {group.combo.imageUrl ? (
                        <img src={group.combo.imageUrl} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-brand-dark text-base leading-tight">{name}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {group.combo.items?.map((i) => i.name).join(', ')}
                      </p>
                    </div>
                    <p className="text-xl font-black text-brand-red shrink-0">
                      {lineTotal.toFixed(2)} ₼
                    </p>
                  </div>

                  {/* Нижняя строка — управление количеством + удалить */}
                  <div className="flex items-center justify-between px-3 pb-3 gap-2">
                    {/* Кнопка удалить — красный фон, хорошо видно */}
                    <button
                      onClick={() => decrement(group)}
                      className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center active:bg-red-200 transition-colors"
                    >
                      {group.quantity === 1 ? (
                        /* Иконка корзины — удалить полностью */
                        <svg className="w-5 h-5 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      ) : (
                        /* Минус */
                        <svg className="w-5 h-5 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                      )}
                    </button>

                    {/* Счётчик */}
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-2xl font-black text-brand-dark w-10 text-center">
                        {group.quantity}
                      </span>
                    </div>

                    {/* Плюс */}
                    <button
                      onClick={() => increment(group)}
                      className="w-12 h-12 rounded-xl bg-brand-red flex items-center justify-center active:bg-brand-red-dark transition-colors"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Итого + кнопки */}
          <div className="shrink-0 px-6 pb-8 pt-4 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 font-medium text-lg">{t('payment_total')}</span>
              <span className="text-3xl font-black text-brand-dark">{total.toFixed(2)} ₼</span>
            </div>
            <button
              onClick={() => setScreen(SCREENS.PAYMENT)}
              className="w-full py-5 bg-brand-red active:scale-95 transition-all rounded-2xl text-white text-2xl font-black shadow-lg shadow-red-900/30 mb-3"
            >
              {t('go_to_pay')}
            </button>
            <button
              onClick={() => setScreen(SCREENS.SCENARIOS)}
              className="w-full py-4 bg-amber-400 active:bg-amber-500 active:scale-95 transition-all rounded-2xl text-brand-dark text-lg font-black shadow-md shadow-amber-200 flex items-center justify-center gap-2"
            >
              <span className="text-xl">➕</span>
              {t('continue_order')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
