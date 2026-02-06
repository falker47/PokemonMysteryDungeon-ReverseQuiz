import { useState, useEffect, useMemo } from 'react';
import { loadData, GAME_VERSIONS, getTargetNature, solveQuiz } from './utils/data';
import PokemonSelector from './components/PokemonSelector';
import QuestionCard from './components/QuestionCard';
import LanguageSelector from './components/LanguageSelector';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import './App.css';

function InnerApp() {
  const { language, t, translateNature, translateGame } = useLanguage();
  const [data, setData] = useState({ starters: null, questions: null });
  const [game, setGame] = useState(GAME_VERSIONS[0].id);
  const [pokemon, setPokemon] = useState(null);
  const [gender, setGender] = useState('Male'); // Default
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadData().then(d => {
      setData(d);
      setIsLoaded(true);
    });
  }, []);

  // Filter available pokemon based on game
  const availablePokemon = useMemo(() => {
    if (!data.starters) return [];
    return Object.keys(data.starters).filter(p => {
      const gameData = data.starters[p][game];
      if (!gameData) return false;
      const hasMale = gameData.Male?.length > 0;
      const hasFemale = gameData.Female?.length > 0;
      return hasMale || hasFemale;
    }).sort();
  }, [data.starters, game]);

  // Reset pokemon if not available in new game selection
  useEffect(() => {
    if (pokemon && !availablePokemon.includes(pokemon)) {
      setPokemon(null);
    }
  }, [game, availablePokemon, pokemon]);

  const targetNature = useMemo(() => {
    if (!data.starters || !pokemon) return null;
    return getTargetNature(data.starters, game, pokemon, gender);
  }, [data.starters, game, pokemon, gender]);

  const solvedQuestions = useMemo(() => {
    if (!data.questions) return [];
    const gameVer = GAME_VERSIONS.find(v => v.id === game);
    if (!gameVer) return [];
    return solveQuiz(data.questions, gameVer.dbKey, targetNature);
  }, [data.questions, game, targetNature]);

  const filteredQuestions = useMemo(() => {
    if (!searchQuery) return solvedQuestions;
    const lowerQuery = searchQuery.toLowerCase();

    return solvedQuestions.filter(q => {
      if (language === 'it') {
        return (
          (q.text_it && q.text_it.toLowerCase().includes(lowerQuery)) ||
          q.answers.some(a => a.text_it && a.text_it.toLowerCase().includes(lowerQuery))
        );
      }
      // Default to English
      return (
        q.text.toLowerCase().includes(lowerQuery) ||
        q.answers.some(a => a.text.toLowerCase().includes(lowerQuery))
      );
    });
  }, [solvedQuestions, searchQuery, language]);

  if (!isLoaded) {
    return <div className="min-h-screen bg-dungeon-dark flex items-center justify-center text-dungeon-accent animate-pulse">{t('loading')}</div>;
  }

  return (
    <div className="min-h-screen relative text-dungeon-text p-2 pb-0 overflow-x-hidden">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-[-1] bg-cover bg-center blur-sm scale-105"
        style={{ backgroundImage: "url('/hero-preview16-9.jpg')" }}
      />
      {/* Dark Overlay for Readability */}
      <div className="fixed inset-0 z-[-1] bg-dungeon-dark/85" />

      {/* Header */}
      <header className="max-w-4xl mx-auto mb-8 relative flex flex-col md:block">
        {/* Language Toggle */}
        <div className="self-end mb-2 md:absolute md:top-4 md:right-0 md:mb-0 z-10">
          <LanguageSelector />
        </div>

        <div className="text-center pt-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-dungeon-accent to-yellow-200 bg-clip-text text-transparent mb-1">
            {t('title')}
          </h1>
          <p className="text-gray-400 text-sm">{t('subtitle')}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-4">

        <div className="flex flex-col md:flex-row gap-4">
          {/* Step 1: Game Version & Gender Selection */}
          <section className="w-full md:w-[33%] bg-dungeon-panel border border-white/10 rounded-2xl p-3 shadow-xl backdrop-blur-sm flex flex-col justify-center">
            <div className="grid grid-cols-[70fr_30fr] md:grid-cols-1 gap-2">

              {/* Game Version */}
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-400 mb-1 uppercase tracking-wider">{t('gameVersion')}</label>
                <div className="relative">
                  <select
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                    className="w-full bg-black/30 border border-white/20 rounded-lg py-2 px-3 text-xs md:text-base text-white appearance-none focus:ring-2 focus:ring-dungeon-accent focus:border-transparent outline-none transition-all cursor-pointer hover:bg-black/40"
                  >
                    {GAME_VERSIONS.map(v => (
                      <option key={v.id} value={v.id}>{translateGame(v.id)}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-dungeon-accent">
                    ▼
                  </div>
                </div>
              </div>

              {/* Gender Selection */}
              <div className="w-full">
                <label className="block text-sm font-semibold text-gray-400 mb-1 uppercase tracking-wider">{t('gender')}</label>
                <div className="flex bg-black/30 p-1 rounded-lg w-full">
                  {['Male', 'Female'].map(g => {
                    const isSelected = gender === g;
                    const isMale = g === 'Male';
                    const activeStyle = isMale
                      ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                      : 'bg-pink-600 text-white shadow-[0_0_10px_rgba(219,39,119,0.5)]';

                    const inactiveStyle = isMale
                      ? 'text-gray-500 hover:text-blue-400 hover:bg-white/5'
                      : 'text-gray-500 hover:text-pink-400 hover:bg-white/5';

                    return (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={`
                          flex-1 h-9 md:h-10 rounded-md flex items-center justify-center text-lg md:text-xl font-bold transition-all
                          ${isSelected ? activeStyle : inactiveStyle}
                        `}
                        title={isMale ? t('male') : t('female')}
                      >
                        {isMale ? '♂' : '♀'}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </section>

          {/* Step 2: Pokemon Selection */}
          <section className="w-full md:w-[65%] bg-dungeon-panel border border-white/10 rounded-2xl p-3 shadow-xl flex flex-col">
            <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">{t('targetPokemon')}</label>
            <div className="flex-1 flex flex-col">
              <PokemonSelector
                pokemonList={availablePokemon}
                selected={pokemon}
                onSelect={setPokemon}
              />
            </div>
          </section>
        </div>

        {/* Step 3: Result Display & Questions */}
        <section className="animate-fade-in-up delay-100 pt-2">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-3">

            {/* Target Nature Display (Replaces "Interview Strategy") */}
            <div className="flex items-center gap-4">

              <div>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{t('targetNature')}</h2>
                {targetNature ? (
                  <div className="text-3xl font-black text-dungeon-accent drop-shadow-[0_0_8px_rgba(255,203,5,0.6)]">
                    {translateNature(targetNature)}
                  </div>
                ) : (
                  <div className="text-xl font-bold text-gray-500/50">
                    ---
                  </div>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-[27.2rem]">
              <input
                type="text"
                placeholder={t('searchQuestions')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[54px] bg-black/40 border border-white/10 rounded-full px-4 pl-10 text-xl text-white focus:outline-none focus:border-dungeon-accent/50 focus:ring-1 focus:ring-dungeon-accent/50 transition-all placeholder-gray-600"
              />
              <svg className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 border border-white/20 rounded-xl p-4 bg-black/10 shadow-inner">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map(q => (
                <QuestionCard key={q.id} question={q} targetNature={targetNature} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 italic">{t('noQuestions')}</div>
            )}
          </div>
        </section>

      </main>

      <footer className="max-w-4xl mx-auto mt-12 text-center text-sm text-gray-500 pb-8">
        <a
          href="https://falker47.github.io/Nexus-portfolio/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-dungeon-accent transition-colors duration-300"
        >
          &copy; {new Date().getFullYear()} {t('footerText')}
        </a>
      </footer>

    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <InnerApp />
    </LanguageProvider>
  );
}

export default App;
