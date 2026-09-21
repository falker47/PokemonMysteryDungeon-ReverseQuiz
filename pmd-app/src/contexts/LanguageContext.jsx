import { useState } from 'react';
import { translations, natureTranslations, gameVersionTranslations } from '../utils/translations';
import { LanguageContext } from './language-context';

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('en');

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'it' : 'en');
    };

    const t = (key) => translations[language][key] || key;

    const translateNature = (nature) => {
        if (!nature) return null;
        if (language === 'en') return nature;
        return natureTranslations[nature] || nature;
    };

    const translateGame = (gameId) => {
        const game = gameVersionTranslations[gameId];
        if (!game) return gameId;
        return game[language];
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, translateNature, translateGame }}>
            {children}
        </LanguageContext.Provider>
    );
}
