import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = () => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'en', label: 'English', flag: 'gb' },
        { code: 'it', label: 'Italiano', flag: 'it' }
    ];

    const currentLang = languages.find(l => l.code === language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (langCode) => {
        setLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-[110px] md:w-auto scale-[1.3] md:scale-100 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3 py-1.5 transition-all outline-none focus:ring-2 focus:ring-dungeon-accent/50 origin-right"
            >
                <img
                    src={`https://flagcdn.com/w40/${currentLang.flag}.png`}
                    srcSet={`https://flagcdn.com/w80/${currentLang.flag}.png 2x`}
                    width="20"
                    height="15"
                    alt={currentLang.label}
                    className="rounded-sm object-cover"
                />
                <span className="text-white text-sm font-medium hidden md:block">{currentLang.label}</span>
                <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-dungeon-panel border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in-up">
                    <div className="py-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleSelect(lang.code)}
                                className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-white/10 transition-colors ${language === lang.code ? 'bg-white/5 text-dungeon-accent' : 'text-gray-300'
                                    }`}
                            >
                                <img
                                    src={`https://flagcdn.com/w40/${lang.flag}.png`}
                                    srcSet={`https://flagcdn.com/w80/${lang.flag}.png 2x`}
                                    width="20"
                                    height="15"
                                    alt={lang.label}
                                    className="rounded-sm object-cover"
                                />
                                <span className="text-sm font-medium">{lang.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
