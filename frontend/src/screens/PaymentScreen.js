import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '../store/useStore';

const STATUS = {
  IDLE: 'idle',
  WAITING: 'waiting',
  DONE: 'done',
  FAILED: 'failed',
};

export default function PaymentScreen() {
  const { t } = useTranslation();
  const { cart, reset } = useStore();
  const [status, setStatus] = useState(STATUS.IDLE);
  const [seconds, setSeconds] = useState(30);

  const total = cart.reduce((sum, combo) => sum + (combo.totalPrice || 0), 0);

  // Таймер ожидания оплаты
  useEffect(() => {
    if (status !== STATUS.WAITING) return;
    if (seconds <= 0) {
      setStatus(STATUS.FAILED);
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [status, seconds]);

  // Авто-возврат на старт через 5 сек после успеха/отмены
  useEffect(() => {
    if (status !== STATUS.DONE) return;
    const t = setTimeout(() => reset(), 5000);
    return () => clearTimeout(t);
  }, [status, reset]);

  const handlePay = () => {
    setStatus(STATUS.WAITING);
    setSeconds(30);
    // Здесь можно вызвать реальный платёжный терминал через API
    // Пока симулируем успех через 3 сек
    setTimeout(() => setStatus(STATUS.DONE), 3000);
  };

  if (status === STATUS.DONE) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-brand-dark animate-bounce-in px-8">
        <div className="w-28 h-28 mb-6 rounded-full bg-green-500 flex items-center justify-center shadow-2xl">
          <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-white mb-3">{t('payment_success')}</h1>
        <p className="text-gray-400 text-lg mb-2 text-center">{t('payment_success_sub')}</p>
        <p className="text-gray-600 text-sm mb-10">{t('payment_auto_return')}</p>
        <button
          onClick={reset}
          className="w-full py-5 bg-brand-red active:scale-95 transition-all rounded-2xl text-white text-xl font-black shadow-lg shadow-red-900/50"
        >
          {t('back_to_home')}
        </button>
      </div>
    );
  }

  if (status === STATUS.FAILED) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-brand-dark px-8">
        <div className="w-28 h-28 mb-6 rounded-full bg-red-700 flex items-center justify-center shadow-2xl">
          <span className="text-5xl">✕</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-3">{t('payment_timeout')}</h1>
        <p className="text-gray-400 text-center mb-8">{t('payment_timeout_sub')}</p>
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => { setStatus(STATUS.IDLE); setSeconds(30); }}
            className="w-full py-5 bg-brand-red rounded-2xl text-white text-xl font-black"
          >
            {t('payment_retry')}
          </button>
          <button
            onClick={reset}
            className="w-full py-4 border-2 border-gray-600 rounded-2xl text-gray-300 text-lg font-semibold"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    );
  }

  if (status === STATUS.WAITING) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-brand-dark px-8">
        <div className="w-28 h-28 mb-8 rounded-full border-4 border-brand-red border-t-transparent animate-spin" />
        <h1 className="text-3xl font-black text-white mb-3">{t('payment_waiting')}</h1>
        <p className="text-gray-400 text-center mb-6">{t('payment_waiting_sub')}</p>
        <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-8">
          <span className="text-4xl font-black text-white">{seconds}</span>
        </div>
        <button
          onClick={() => setStatus(STATUS.FAILED)}
          className="text-gray-500 underline text-sm"
        >
          {t('cancel')}
        </button>
      </div>
    );
  }

  // IDLE — экран выбора способа оплаты
  return (
    <div className="flex flex-col w-full h-full bg-white">
      {/* Header */}
      <div className="bg-brand-dark px-6 pt-8 pb-6 shrink-0">
        <button
          onClick={() => useStore.getState().setScreen(useStore.getState().SCREENS.SUCCESS)}
          className="text-gray-400 text-sm mb-4 flex items-center gap-1 active:opacity-60"
        >
          ← {t('cancel')}
        </button>
        <h2 className="text-3xl font-black text-white">{t('payment_title')}</h2>
      </div>

      <div className="flex-1 flex flex-col px-6 py-6">
        {/* Итого */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-6">
          <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">{t('payment_total')}</p>
          <p className="text-5xl font-black text-brand-dark">
            {total.toFixed(2)} <span className="text-3xl text-gray-400">₼</span>
          </p>
          <p className="text-sm text-gray-400 mt-1">{cart.length} {t('payment_items')}</p>
        </div>

        {/* Позиции */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-6">
          {cart.map((combo, i) => {
            const name = typeof combo.name === 'object' ? combo.name?.ru : combo.name;
            return (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-brand-dark font-medium">{name}</span>
                <span className="text-brand-red font-bold">{combo.totalPrice?.toFixed(2)} ₼</span>
              </div>
            );
          })}
        </div>

        {/* Кнопки оплаты */}
        <div className="shrink-0 space-y-3">
          <button
            onClick={handlePay}
            className="w-full py-5 bg-brand-red active:scale-95 transition-all rounded-2xl text-white text-2xl font-black shadow-lg shadow-red-900/30 flex items-center justify-center gap-3"
          >
            <span>💳</span> {t('payment_card')}
          </button>
          <button
            onClick={handlePay}
            className="w-full py-4 bg-gray-900 active:scale-95 transition-all rounded-2xl text-white text-xl font-bold flex items-center justify-center gap-3"
          >
            <span>💵</span> {t('payment_cash')}
          </button>
        </div>
      </div>
    </div>
  );
}
