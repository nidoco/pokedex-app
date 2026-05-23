import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPokemonList, getPokemonDetail } from '../services/pokemonService';
import type { PokemonBase, PokemonDetail } from '../types/pokemon';

export const ComparePage = () => {
  const navigate = useNavigate();
  const [pokemonList, setPokemonList] = useState<PokemonBase[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(true);

  // Estados para controlar el texto que escribe el usuario en los buscadores
  const [searchQueryA, setSearchQueryA] = useState<string>('');
  const [searchQueryB, setSearchQueryB] = useState<string>('');

  // Estados para saber qué Pokémon quedó seleccionado formalmente
  const [selectedA, setSelectedA] = useState<string>('');
  const [selectedB, setSelectedB] = useState<string>('');

  // Detalles descargados de la API
  const [pokemonDetailA, setPokemonDetailA] = useState<PokemonDetail | null>(null);
  const [pokemonDetailB, setPokemonDetailB] = useState<PokemonDetail | null>(null);
  const [loadingCompare, setLoadingCompare] = useState<boolean>(false);

  // Cargar los 610 Pokémon iniciales
  useEffect(() => {
    getPokemonList(610)
      .then((data) => setPokemonList(data.results))
      .catch(() => console.error("Error al cargar la lista de comparación"))
      .finally(() => setLoadingList(false));
  }, []);

  // Descarga el detalle del Pokémon A
  useEffect(() => {
    if (!selectedA) {
      setPokemonDetailA(null);
      return;
    }
    setLoadingCompare(true);
    getPokemonDetail(selectedA)
      .then(setPokemonDetailA)
      .finally(() => setLoadingCompare(false));
  }, [selectedA]);

  // Descarga el detalle del Pokémon B
  useEffect(() => {
    if (!selectedB) {
      setPokemonDetailB(null);
      return;
    }
    setLoadingCompare(true);
    getPokemonDetail(selectedB)
      .then(setPokemonDetailB)
      .finally(() => setLoadingCompare(false));
  }, [selectedB]);

  const getStatValue = (pokemon: PokemonDetail | null, statName: string): number => {
    if (!pokemon) return 0;
    const found = pokemon.stats.find(s => s.stat.name === statName);
    return found ? found.base_stat : 0;
  };

  const statsToCompare = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

  // FILTROS EN TIEMPO REAL PARA LAS SUGERENCIAS
  const suggestionsA = pokemonList.filter(p => 
    searchQueryA && p.name.toLowerCase().includes(searchQueryA.toLowerCase()) && p.name !== selectedA
  );

  const suggestionsB = pokemonList.filter(p => 
    searchQueryB && p.name.toLowerCase().includes(searchQueryB.toLowerCase()) && p.name !== selectedB
  );

  if (loadingList) return <p className="status-text">Cargando arena de combate...</p>;

  return (
    <div className="app-container">
      <button onClick={() => navigate(-1)} className="back-button">
        Volver
      </button>

      <h1 className="title">Comparador Pokémon</h1>

      {/* Contenedor de Buscadores Interactivos */}
      <div className="search-container" style={{ alignItems: 'flex-start', gap: '2rem' }}>
        
        {/* BUSCADOR COMBATIENTE A */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
          <input 
            type="text"
            className="search-input"
            style={{ width: '100%', boxSizing: 'border-box' }}
            placeholder="Buscar Pokémon A..."
            value={searchQueryA}
            onChange={(e) => setSearchQueryA(e.target.value)}
          />
          {suggestionsA.length > 0 && (
            <div className="custom-dropdown">
              {suggestionsA.slice(0, 5).map(p => (
                <div 
                  key={`sug-a-${p.name}`} 
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedA(p.name);
                    setSearchQueryA(p.name); // Muestra el nombre elegido en el input
                  }}
                >
                  {p.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <span className="vs-text" style={{ marginTop: '0.8rem' }}>VS</span>

        {/* BUSCADOR COMBATIENTE B */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
          <input 
            type="text"
            className="search-input"
            style={{ width: '100%', boxSizing: 'border-box' }}
            placeholder="Buscar Pokémon B..."
            value={searchQueryB}
            onChange={(e) => setSearchQueryB(e.target.value)}
          />
          {suggestionsB.length > 0 && (
            <div className="custom-dropdown">
              {suggestionsB.slice(0, 5).map(p => (
                <div 
                  key={`sug-b-${p.name}`} 
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedB(p.name);
                    setSearchQueryB(p.name);
                  }}
                >
                  {p.name}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {loadingCompare && <p className="status-text">Analizando estadísticas</p>}

      {/* Panel de Comparación Visual */}
      <div className="comparison-layout">
        <div className="compare-card">
          {pokemonDetailA ? (
            <>
              <img src={pokemonDetailA.sprites.other['official-artwork'].front_default} alt={pokemonDetailA.name} />
              <h2 className="pokemon-name">{pokemonDetailA.name}</h2>
            </>
          ) : (
            <p className="placeholder-text">Elige al primer combatiente</p>
          )}
        </div>

        <div className="compare-stats-panel">
          {statsToCompare.map(statName => {
            const valA = getStatValue(pokemonDetailA, statName);
            const valB = getStatValue(pokemonDetailB, statName);

            const classA = pokemonDetailA && pokemonDetailB ? (valA > valB ? 'stat-winner' : valA < valB ? 'stat-loser' : '') : '';
            const classB = pokemonDetailA && pokemonDetailB ? (valB > valA ? 'stat-winner' : valB < valA ? 'stat-loser' : '') : '';

            return (
              <div key={statName} className="compare-row">
                <span className={`compare-val-left ${classA}`}>{pokemonDetailA ? valA : '-'}</span>
                <span className="compare-stat-title">{statName.replace('-', ' ').toUpperCase()}</span>
                <span className={`compare-val-right ${classB}`}>{pokemonDetailB ? valB : '-'}</span>
              </div>
            );
          })}
        </div>

        <div className="compare-card">
          {pokemonDetailB ? (
            <>
              <img src={pokemonDetailB.sprites.other['official-artwork'].front_default} alt={pokemonDetailB.name} />
              <h2 className="pokemon-name">{pokemonDetailB.name}</h2>
            </>
          ) : (
            <p className="placeholder-text">Elige al segundo combatiente</p>
          )}
        </div>
      </div>
    </div>
  );
};