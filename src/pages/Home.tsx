import { useEffect, useState } from 'react';
import { getPokemonList } from '../services/pokemonService';
import { PokemonCard } from '../components/PokemonCard'; // Requisito RT03
import type { PokemonBase } from '../types/pokemon';

export const Home = () => {
  const [pokemonList, setPokemonList] = useState<PokemonBase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getPokemonList(30).then(data => {
      setPokemonList(data.results);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="status-text">Cargando datos papu...</p>;

  return (
    <div className="app-container">
      <h1 className="title">Pokédex</h1>
      <div className="pokemon-grid">
        {pokemonList.map((pokemon) => (
          /* Usamos el componente reutilizable aquí */
          <PokemonCard key={pokemon.name} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
};