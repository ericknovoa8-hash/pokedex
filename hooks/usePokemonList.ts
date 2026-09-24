import { useEffect, useState } from "react";

import { PokemonListItem, PokemonListResponse } from "@/types/pokemon";

interface PokemonListState {
  pokemon: PokemonListItem[];
  loading: boolean;
  error: string | null;
}

export const usePokemonList = (limit = 20): PokemonListState => {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let isCancelled = false;

    const loadPokemon = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=0`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("No se pudo cargar la lista de Pokemon.");
        }

        const data: PokemonListResponse = await response.json();
        if (!isCancelled) {
          setPokemon(data.results);
        }
      } catch (requestError) {
        if (!isCancelled) {
          if (
            requestError instanceof Error &&
            requestError.name === "AbortError"
          ) {
            return;
          }

          setError(
            requestError instanceof Error
              ? requestError.message
              : "Error desconocido.",
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    void loadPokemon();

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [limit]);

  return { pokemon, loading, error };
};
