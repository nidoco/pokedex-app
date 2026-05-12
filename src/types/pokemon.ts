export interface PokemonBase {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  results: PokemonBase[];
}