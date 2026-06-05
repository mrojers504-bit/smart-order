import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './ru.json';
import az from './az.json';
import en from './en.json';

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    az: { translation: az },
    en: { translation: en },
  },
  lng: 'ru',
  fallbackLng: 'ru',
  interpolation: { escapeValue: false },
});

export default i18n;
