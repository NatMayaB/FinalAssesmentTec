import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './languages/english.json';
import es from './languages/spanish.json';
import fr from './languages/french.json';
import pt from './languages/portuguese.json';
import ct from './languages/catalan.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      es: {
        translation: es,
      },
        fr: {
            translation: fr,
        },
        pt: {
            translation: pt,
        },
        ct: {
            translation: ct,
        },
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
