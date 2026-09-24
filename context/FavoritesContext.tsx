import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

import { PokemonListItem } from "@/types/pokemon";

interface FavoritesContextValue {
  favorites: PokemonListItem[];
  isFavorite: (name: string) => boolean;
  toggleFavorite: (pokemon: PokemonListItem) => void;
}

interface FavoritesProviderProps {
  children: ReactNode;
}

const FAVORITES_STORAGE_KEY = "@pokedex_lite_favorites";

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined,
);

const isPokemonListItem = (value: unknown): value is PokemonListItem => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;
  return typeof item.name === "string" && typeof item.url === "string";
};

const parseFavorites = (value: string | null): PokemonListItem[] => {
  if (!value) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(isPokemonListItem) : [];
  } catch {
    return [];
  }
};

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<PokemonListItem[]>([]);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    const loadFavorites = async (): Promise<void> => {
      try {
        const storedFavorites = await AsyncStorage.getItem(
          FAVORITES_STORAGE_KEY,
        );
        setFavorites(parseFavorites(storedFavorites));
      } catch (error) {
        console.error("No se pudieron cargar los favoritos.", error);
      } finally {
        setStorageReady(true);
      }
    };

    void loadFavorites();
  }, []);

  useEffect(() => {
    if (!storageReady) {
      return;
    }

    const saveFavorites = async (): Promise<void> => {
      try {
        await AsyncStorage.setItem(
          FAVORITES_STORAGE_KEY,
          JSON.stringify(favorites),
        );
      } catch (error) {
        console.error("No se pudieron guardar los favoritos.", error);
      }
    };

    void saveFavorites();
  }, [favorites, storageReady]);

  const isFavorite = (name: string): boolean =>
    favorites.some((favorite) => favorite.name === name);

  const toggleFavorite = (pokemon: PokemonListItem): void => {
    setFavorites((currentFavorites) => {
      const alreadyFavorite = currentFavorites.some(
        (favorite) => favorite.name === pokemon.name,
      );

      if (alreadyFavorite) {
        return currentFavorites.filter(
          (favorite) => favorite.name !== pokemon.name,
        );
      }

      return [...currentFavorites, pokemon];
    });
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextValue => {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites debe usarse dentro de FavoritesProvider.");
  }

  return context;
};
