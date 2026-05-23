import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getPokemonList, getPokemonTypes, getPokemonByUrl } from '../services/pokemonService';
import { PokemonCard } from '../components/PokemonCard';  
import type { PokemonBase } from '../types/pokemon';

export const Home = () => {
  const navigate = useNavigate();
  
  /* Estados de listas */
  const [pokemonList, setPokemonList] = useState<PokemonBase[]>([]); 
  const [displayList, setDisplayList] = useState<PokemonBase[]>([]); 
  const [types, setTypes] = useState<{ name: string; url: string }[]>([]); 
  const [favorites, setFavorites] = useState<string[]>([]); 
  
  /* Estados de filtros */
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [selectedType, setSelectedType] = useState<string>(''); 
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false); // Nuevo estado para alternar favoritos
  
  /* Estados de carga y error */
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); 

  /* Cargar datos iniciales */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const pokemonData = await getPokemonList(610);
        setPokemonList(pokemonData.results);
        setDisplayList(pokemonData.results); 

        const typesData = await getPokemonTypes();
        const validTypes = typesData.results;
        setTypes(validTypes);
        
        const savedFavs = localStorage.getItem('pokedex_favorites');
        if (savedFavs) {
          setFavorites(JSON.parse(savedFavs));
        }
      } catch (err) {
        setError("Hubo un problema al conectar.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const filterByType = async () => {
      if (selectedType === '') {
        setDisplayList(pokemonList);
        return;
      }

      setLoading(true);
      try {
        const targetType = types.find(t => t.name === selectedType);
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

    if (pokemonList.length > 0) {
      // Al cambiar de tipo, quitamos el filtro de favoritos para evitar confusiones visuales
      setShowFavoritesOnly(false);
      filterByType();
    }
  }, [selectedType]); 

  /* Agregar o quitar Pokémon de favoritos */
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

  /* Filtrar en tiempo real por lo que se escribe y por favoritos */
  const filteredPokemon = displayList.filter((pokemon) => {
    // Si la opción de favoritos está activa, filtramos los que no estén en la lista
    if (showFavoritesOnly && !favorites.includes(pokemon.name)) {
      return false;
    }
    return pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) return <p className="status-text">Buscando Pokémon</p>;
  if (error) return <p className="status-text error">{error}</p>;

  return (
    <div className="app-container">
      <h1 className="title">Pokédex</h1>

      <div className="search-container">
        <input 
          type="text" 
          placeholder="Buscar Pokémon por nombre..." 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select 
          className="type-select"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          {types.map(t => (
            <option key={t.name} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>

        {/* Botón para alternar la vista entre todos o favoritos */}
        <button
          className="type-select"
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          style={{ 
            cursor: 'pointer',
            backgroundColor: showFavoritesOnly ? '#eab308' : '',
            color: showFavoritesOnly ? '#0f172a' : '',
            fontWeight: showFavoritesOnly ? 'bold' : 'normal'
          }}
        >
          {showFavoritesOnly ? 'Viendo Favoritos' : 'Ver Favoritos'}
        </button>

        <button 
          className="type-select" 
          onClick={() => navigate('/compare')}
          style={{ cursor: 'pointer' }}
        >
          Comparar Pokémon
        </button>
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