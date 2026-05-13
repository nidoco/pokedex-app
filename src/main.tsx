import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { getPokemonList } from './services/pokemonService';
import type { PokemonBase } from './types/pokemon';
import './index.css'; 

const App = () => {
  const [pokemonList, setPokemonList] = useState<PokemonBase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        // Pedimos los 30 Pokémon como dice la tabla de la Clase 1
        const data = await getPokemonList(30);
        setPokemonList(data.results);
      } catch (err) {
        setError("Hubo un problema al cargar los Pokémon, F en el chat.");
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  return (
    <div className="app-container">
      <h1 className="title">Pokédex</h1>
      
      {loading && <p className="status-text">Cargando datos papu...</p>}
      {error && <p className="status-text error">{error}</p>}

      <div className="pokemon-grid">
        {pokemonList.map((pokemon, index) => (
          <div key={pokemon.name} className="pokemon-card">
            <span className="pokemon-number">#{index + 1}</span>
            <p className="pokemon-name">{pokemon.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Punto de entrada de React al DOM
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);