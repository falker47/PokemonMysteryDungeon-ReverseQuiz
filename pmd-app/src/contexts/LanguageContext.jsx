import { createContext, useContext, useState } from 'react';
import { translations, natureTranslations, gameVersionTranslations } from '../utils/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('en'); // 'en' or 'it'

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'it' : 'en');
    };

    /**
     * Translates a key to the current language.
     * @param {string} key 
     * @returns {string}
     */
    const t = (key) => {
        return translations[language][key] || key;
    };

    /**
     * Translates a nature from English to the current language.
     * @param {string} nature 
     * @returns {string}
     */
    const translateNature = (nature) => {
        if (!nature) return null;
        if (language === 'en') return nature;
        return natureTranslations[nature] || nature;
    };

    /**
     * Translates a game version ID to the current language label.
     * @param {string} gameId 
     * @returns {string}
     */
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

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
