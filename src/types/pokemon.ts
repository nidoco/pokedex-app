/* Datos base de un Pokémon */
export interface PokemonBase {
  name: string;
  url: string;
}
/* Respuesta de la API para la lista de Pokémon */
export interface PokemonListResponse {
  results: PokemonBase[];
}
/* Detalles de un Pokémon específico a extraer de la API */
export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}