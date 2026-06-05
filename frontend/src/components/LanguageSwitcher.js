import React from 'react';
import { useTranslation } from 'react-i18next';

const LANGS = ['az', 'ru', 'en'];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = i18n.language;

  return (
    <div className="absolute top-4 right-4 flex gap-1 z-50">
      {LANGS.map((lang) => (
        <button
          key={lang}
          onClick={() => i18n.changeLanguage(lang)}
          className={`px-3 py-1 rounded-lg text-sm font-bold transition-all duration-150 ${
            current === lang
              ? 'bg-brand-red text-white'
              : 'bg-black/30 text-gray-300 hover:bg-black/50'
          }`}
        >
          {t(`lang_${lang}`)}
        </button>
      ))}
    </div>
  );
}
