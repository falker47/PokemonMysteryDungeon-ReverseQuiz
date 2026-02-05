import { useState, useEffect, useMemo } from 'react';
import { loadData, GAME_VERSIONS, getTargetNature, solveQuiz } from './utils/data';
import PokemonSelector from './components/PokemonSelector';
import QuestionCard from './components/QuestionCard';
import './App.css';

function App() {
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
    if (!data.questions || !targetNature) return [];
    const gameVer = GAME_VERSIONS.find(v => v.id === game);
    if (!gameVer) return [];
    return solveQuiz(data.questions, gameVer.dbKey, targetNature);
  }, [data.questions, game, targetNature]);

  const filteredQuestions = useMemo(() => {
    if (!searchQuery) return solvedQuestions;
    const lowerQuery = searchQuery.toLowerCase();
    return solvedQuestions.filter(q =>
      q.text.toLowerCase().includes(lowerQuery) ||
      q.answers.some(a => a.text.toLowerCase().includes(lowerQuery))
    );
  }, [solvedQuestions, searchQuery]);

  if (!isLoaded) {
    return <div className="min-h-screen bg-dungeon-dark flex items-center justify-center text-dungeon-accent animate-pulse">Loading Grimoire...</div>;
  }

  return (
    <div className="min-h-screen bg-dungeon-dark text-dungeon-text p-4 pb-20">

      {/* Header */}
      <header className="max-w-4xl mx-auto mb-8 text-center pt-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-dungeon-accent to-yellow-200 bg-clip-text text-transparent mb-2">
          PMD REVERSE QUIZ
        </h1>
        <p className="text-gray-400">Choose your path. Control your fate.</p>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">

        {/* Step 1: Game Version & Gender Selection (One Row) */}
        <section className="bg-dungeon-panel border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-6 items-end md:items-center justify-between">

            {/* Game Version */}
            <div className="w-full md:w-auto flex-1">
              <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Game Version</label>
              <div className="relative">
                <select
                  value={game}
                  onChange={(e) => setGame(e.target.value)}
                  className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white appearance-none focus:ring-2 focus:ring-dungeon-accent focus:border-transparent outline-none transition-all cursor-pointer hover:bg-black/40"
                >
                  {GAME_VERSIONS.map(v => (
                    <option key={v.id} value={v.id}>{v.label}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-dungeon-accent">
                  ▼
                </div>
              </div>
            </div>

            {/* Gender Selection */}
            <div className="w-full md:w-auto">
              <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Gender</label>
              <div className="flex bg-black/30 p-1 rounded-lg">
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
                        w-12 h-11 rounded-md flex items-center justify-center text-xl font-bold transition-all
                        ${isSelected ? activeStyle : inactiveStyle}
                      `}
                      title={g}
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
        <section className="bg-dungeon-panel border border-white/10 rounded-2xl p-6 shadow-xl">
          <label className="block text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Choose Target Pokémon</label>
          <PokemonSelector
            pokemonList={availablePokemon}
            selected={pokemon}
            onSelect={setPokemon}
          />
        </section>

        {/* Step 3: Result Display */}
        {pokemon && targetNature && (
          <section className="animate-fade-in-up">
            <div className="bg-dungeon-panel border-2 border-dungeon-accent/30 rounded-xl p-4 shadow-[0_0_15px_rgba(252,163,17,0.15)] flex flex-row items-center justify-center gap-6 max-w-lg mx-auto">
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Target Nature</span>
              <div className="text-4xl font-black drop-shadow-[0_0_10px_rgba(255,203,5,0.5)] text-dungeon-accent">
                {targetNature}
              </div>
            </div>
          </section>
        )}

        {/* Step 4: Cheat Sheet & Search */}
        {pokemon && targetNature && (
          <section className="animate-fade-in-up delay-100 pt-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-8 bg-dungeon-accent rounded-full"></span>
                Interview Strategy
              </h2>

              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-full py-2 px-4 pl-10 text-sm text-white focus:outline-none focus:border-dungeon-accent/50 focus:ring-1 focus:ring-dungeon-accent/50 transition-all placeholder-gray-600"
                />
                <svg className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map(q => (
                  <QuestionCard key={q.id} question={q} targetNature={targetNature} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 italic">No matching questions found.</div>
              )}
            </div>
          </section>
        )}

      </main>
    </div >
  )
}

export default App
