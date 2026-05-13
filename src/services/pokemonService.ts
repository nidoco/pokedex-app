// src/services/pokemonService.ts
import axios from 'axios';
import type { PokemonListResponse, PokemonDetail } from '../types/pokemon';

const API_URL = 'https://pokeapi.co/api/v2';

export const getPokemonList = async (limit: number = 30): Promise<PokemonListResponse> => {
  const response = await axios.get<PokemonListResponse>(`${API_URL}/pokemon?limit=${limit}`);
  return response.data;
};

// Nuevo servicio para el detalle 
export const getPokemonDetail = async (idOrName: string): Promise<PokemonDetail> => {
  const response = await axios.get<PokemonDetail>(`${API_URL}/pokemon/${idOrName}`);
  return response.data;
};