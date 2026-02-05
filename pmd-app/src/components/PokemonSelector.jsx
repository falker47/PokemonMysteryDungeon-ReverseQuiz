import React from 'react';

/**
 * Grid of Pokemon images.
 * @param {Object} props
 * @param {string[]} props.pokemonList - List of pokemon names to display
 * @param {string} props.selected - Currently selected pokemon
 * @param {function} props.onSelect - Callback
 */
export default function PokemonSelector({ pokemonList, selected, onSelect }) {
    return (
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 px-1">
            {pokemonList.map((pokemon) => (
                <button
                    key={pokemon}
                    onClick={() => onSelect(pokemon)}
                    className={`
            relative group p-1.5 rounded-lg transition-all duration-200
            flex flex-col items-center gap-1
            ${selected === pokemon
                            ? 'bg-dungeon-accent/20 shadow-[0_0_10px_rgba(252,163,17,0.3)]'
                            : 'bg-dungeon-panel border border-white/10 hover:bg-white/5 hover:border-white/30 hover:-translate-y-0.5'
                        }
          `}
                >
                    {/* Selected Overlay Border - Ensures border is ON TOP of image */}
                    {selected === pokemon && (
                        <div className="absolute inset-0 border-2 border-dungeon-accent rounded-lg z-20 pointer-events-none"></div>
                    )}

                    <div className="w-10 h-10 sm:w-12 sm:h-12 relative">
                        <img
                            src={`/pokemon-pics/${pokemon.toLowerCase()}.png`}
                            alt={pokemon}
                            className="w-full h-full object-contain filter drop-shadow-md"
                            onError={(e) => { e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'; /* Fallback to Pikachu */ }}
                        />
                    </div>
                    <span className={`text-[9px] sm:text-[10px] font-medium truncate w-full text-center ${selected === pokemon ? 'text-dungeon-accent' : 'text-gray-400 group-hover:text-white'}`}>
                        {pokemon}
                    </span>
                </button>
            ))}
        </div>
    );
}
