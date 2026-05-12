import { useEffect, useState } from 'react';
import { getPokemonList } from './services/pokemonService';
import type { PokemonBase } from './types/pokemon';
import './App.css'; 

function App() {
  const [pokemonList, setPokemonList] = useState<PokemonBase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        // Pedimos los primeros 30 Pokémon como sugiere la tabla
        const data = await getPokemonList(30);
        setPokemonList(data.results);
      } catch (err) {
        setError("Hubo un problema al cargar los Pokémon.");
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  return (
    <div className="app-container">
      <h1 className="title">Pokédex</h1>
      
      {/* Estados de la interfaz */}
      {loading && <p className="status-text">Cargando datos...</p>}
      {error && <p className="status-text error">{error}</p>}

      {/* Listado de Pokémon */}
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
}

export default App;