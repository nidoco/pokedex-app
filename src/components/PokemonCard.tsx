import { Link } from 'react-router-dom';
import type { PokemonBase } from '../types/pokemon';

interface Props {
  pokemon: PokemonBase;
}

export const PokemonCard = ({ pokemon }: Props) => {
  return (
    <Link to={`/pokemon/${pokemon.name}`} className="pokemon-card">
      <p className="pokemon-name">{pokemon.name}</p>
    </Link>
  );
};