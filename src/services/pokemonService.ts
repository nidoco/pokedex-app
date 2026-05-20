import axios from 'axios';
import type { PokemonListResponse, PokemonDetail } from '../types/pokemon';

const API_URL = 'https://pokeapi.co/api/v2';
/* Lista de nombres y links de los Pokémon */
export const getPokemonList = async (limit: number = 30): Promise<PokemonListResponse> => {
  const response = await axios.get<PokemonListResponse>(`${API_URL}/pokemon?limit=${limit}`);
  return response.data;
};
/* Obtener detalles de un Pokémon específico */
export const getPokemonDetail = async (idOrName: string): Promise<PokemonDetail> => {
  const response = await axios.get<PokemonDetail>(`${API_URL}/pokemon/${idOrName}`);
  return response.data;
};
/* Agregar los tipos de Pokémon para el menú desplegable */
export const getPokemonTypes = async (): Promise<{ results: { name: string; url: string }[] }> => {
  const response = await axios.get(`${API_URL}/type`);
  return response.data;
};
/* Acomodar los resultador de la API para el listado de los datos */
export const getPokemonByUrl = async (url: string): Promise<PokemonListResponse> => {
  const response = await axios.get(url);
  const formattedResults = response.data.pokemon.map((p: any) => p.pokemon);
  return { results: formattedResults };
};