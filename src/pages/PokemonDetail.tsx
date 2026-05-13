import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPokemonDetail } from '../services/pokemonService';
import type { PokemonDetail } from '../types/pokemon';

export const PokemonDetailPage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);

  useEffect(() => {
    if (name) getPokemonDetail(name).then(setPokemon);
  }, [name]);

  if (!pokemon) return <p className="status-text">Buscando datos en la hierba alta...</p>;

  return (
    <div className="app-container">
      <button onClick={() => navigate(-1)} className="back-button">← Volver al listado</button>
      
      <div className="detail-container">
        <h1 className="pokemon-title">{pokemon.name}</h1>
        
        <img 
          src={pokemon.sprites.other['official-artwork'].front_default} 
          alt={pokemon.name}
          className="detail-image"
        />

        <div className="stats-box">
          // Contenedor de Peso y Altura con badges individuales 
          <div className="info-row">
            <div className="info-badge">
              <span className="label">PESO</span>
              <span className="value">{pokemon.weight / 10} kg</span>
            </div>
            <div className="info-badge">
              <span className="label">ALTURA</span>
              <span className="value">{pokemon.height / 10} m</span>
            </div>
          </div>

          // Fila de tipos con margen superior para no amontonarse
          <div className="types-row">
            {pokemon.types.map(t => (
              <span key={t.type.name} className={`tag ${t.type.name}`}>
                {t.type.name}
              </span>
            ))}
          </div>

          <h3 className="section-title">Estadísticas Base</h3>
          <div className="stats-list">
            {pokemon.stats.map(s => (
              <div key={s.stat.name} className="stat-item">
                <span className="stat-name">{s.stat.name.replace('-', ' ')}</span>
                <span className="stat-value">{s.base_stat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};