import { Link } from 'react-router-dom';
import type { PokemonBase } from '../types/pokemon';

interface Props {
  pokemon: PokemonBase;
}
export const PokemonCard = ({ pokemon }: Props) => {
  const getPokemonId = (url: string) => {
    const parts = url.split('/').filter(Boolean);
    return parts[parts.length - 1];
  }; 

  const pokemonId = getPokemonId(pokemon.url);

  return (
    <Link to={`/pokemon/${pokemon.name}`} className="pokemon-card">
      <span className="pokemon-number">#{pokemonId}</span>
      <p className="pokemon-name">{pokemon.name}</p>
    </Link>
  );
};