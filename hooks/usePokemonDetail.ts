import { useEffect, useState } from "react";

import { PokemonDetail } from "@/types/pokemon";

interface PokemonDetailState {
  pokemon: PokemonDetail | null;
  loading: boolean;
  error: string | null;
}

export const usePokemonDetail = (name: string): PokemonDetailState => {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let isCancelled = false;

    const loadPokemon = async (): Promise<void> => {
      setPokemon(null);
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${name}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("No se pudo cargar el Pokemon.");
        }

        const data: PokemonDetail = await response.json();
        if (!isCancelled) {
          setPokemon(data);
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
  }, [name]);

  return { pokemon, loading, error };
};
