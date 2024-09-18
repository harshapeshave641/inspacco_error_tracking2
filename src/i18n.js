// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: require('./i18n-language/en.json'),
      },
      mr: {
        translation: require('./i18n-language/mr.json'),
      },
      hi: {
        translation: require('./i18n-language/hi.json'),
      },
      ar: {
        translation: require('./i18n-language/ar.json'),
      },
    },
    lng: 'en', // default language
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
