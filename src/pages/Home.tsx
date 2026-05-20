import { useEffect, useState } from 'react';
import { getPokemonList, getPokemonTypes, getPokemonByUrl } from '../services/pokemonService';
import { PokemonCard } from '../components/PokemonCard';  
import type { PokemonBase } from '../types/pokemon';

export const Home = () => {
  /* Lista completa de Pokémon */
  const [pokemonList, setPokemonList] = useState<PokemonBase[]>([]); 
  const [displayList, setDisplayList] = useState<PokemonBase[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [types, setTypes] = useState<{ name: string; url: string }[]>([]); 
  /* Lista de Pokémon favoritos */
  const [favorites, setFavorites] = useState<string[]>([]); 
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [selectedType, setSelectedType] = useState<string>(''); 
  const [error, setError] = useState<string | null>(null); 

  /* Cargar datos iniciales */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const pokemonData = await getPokemonList(610);
        setPokemonList(pokemonData.results);
        setDisplayList(pokemonData.results); 

        const typesData = await getPokemonTypes();
        setTypes(typesData.results);
        /* Revisa si hay favoritos guardados */
        const savedFavs = localStorage.getItem('pokedex_favorites');
        if (savedFavs) {
          setFavorites(JSON.parse(savedFavs));
        }
      } catch (err) {
        setError("Hubo un problema al conectar con el laboratorio del Profesor Oak.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);
/* Filtrar Pokémon por tipo en el menú desplegable */
  useEffect(() => {
    const filterByType = async () => {
      if (selectedType === '') {
        setDisplayList(pokemonList);
        return;
      }

      setLoading(true);
      try {
        const targetType = types.find(t => t.name === selectedType); /* Busca el tipo seleccionado */
        if (targetType) {
          const data = await getPokemonByUrl(targetType.url);
          const filteredByRange = data.results.filter(p => {
            const parts = p.url.split('/').filter(Boolean);
            const id = parseInt(parts[parts.length - 1], 10);
            return id <= 610;
          });

          setDisplayList(filteredByRange);
        }
      } catch (err) {
        setError("Error al filtrar por tipo.");
      } finally {
        setLoading(false);
      }
    };
    if (types.length > 0) {
      filterByType();
    }
  }, [selectedType, pokemonList, types]);

/* Agregar o quitar Pokémon de favs */
  const toggleFavorite = (name: string) => {
    let updatedFavs: string[];
    if (favorites.includes(name)) {
      updatedFavs = favorites.filter(fav => fav !== name);
    } else {
      updatedFavs = [...favorites, name]; 
    }
    setFavorites(updatedFavs);
    localStorage.setItem('pokedex_favorites', JSON.stringify(updatedFavs)); 
  };
/* Filtrar Pokémon por nombre de manera correcta */
  const filteredPokemon = displayList.filter((pokemon) => {
    return pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) return <p className="status-text">Buscando Pokémon</p>;
  if (error) return <p className="status-text error">{error}</p>;

  return (
    /* Filtros de búsqueda */
    <div className="app-container">
      <h1 className="title">Pokédex</h1>

      <div className="search-container">
        <input 
          type="text" 
          placeholder="Buscar Pokémon por nombre" 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select 
          className="type-select"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">Elegir tipo</option>
          {types.map(t => (
            <option key={t.name} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {filteredPokemon.length === 0 && (
        <p className="status-text alert">No se encontraron Pokémon con esos criterios.</p>
      )}

      <div className="pokemon-grid">
        {filteredPokemon.map((pokemon) => {
          const isFav = favorites.includes(pokemon.name);
          return (
            <div key={pokemon.name} className="card-wrapper">
              <PokemonCard pokemon={pokemon} />
              
              <button 
                onClick={() => toggleFavorite(pokemon.name)} 
                className={`fav-button ${isFav ? 'is-fav' : ''}`}
              >
                {isFav ? 'Quitar' : 'Favorito'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};