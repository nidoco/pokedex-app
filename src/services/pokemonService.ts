import axios from 'axios';
import type { PokemonListResponse } from '../types/pokemon';

// Definir la URL base que pide el documento
const API_URL = 'https://pokeapi.co/api/v2';

export const getPokemonList = async (limit: number = 30): Promise<PokemonListResponse> => {
  try {
    // Apuntamos al endpoint relativo sugerido: /pokemon?limit=30
    const response = await axios.get<PokemonListResponse>(`${API_URL}/pokemon?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener la lista de Pokémon:", error);
    throw error;
  }
};