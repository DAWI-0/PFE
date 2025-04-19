import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translation from './translation/transation.json';

const getLanguage = () => localStorage.getItem('lang') || 'Fr';

i18n
    .use(initReactI18next)
    .init({
        lng: getLanguage(),
        resources: {
            En: { translation: Object.fromEntries(Object.entries(translation).map(([key, val]) => [key, val.en])) },
            Fr: { translation: Object.fromEntries(Object.entries(translation).map(([key, val]) => [key, val.fr])) },
            Ar: { translation: Object.fromEntries(Object.entries(translation).map(([key, val]) => [key, val.ar])) }
        },
        fallbackLng: 'Fr',
        interpolation: {
            escapeValue: false
        }
    });

window.addEventListener('storage', (event) => {
    if (event.key === 'lang') {
        i18n.changeLanguage(event.newValue);
    }
});

export default i18n;