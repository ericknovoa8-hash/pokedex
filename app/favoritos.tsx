import { Link } from "expo-router";
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useFavorites } from "@/context/FavoritesContext";
import { PokemonListItem } from "@/types/pokemon";

const getPokemonImageUrl = (pokemon: PokemonListItem): string => {
  const id = pokemon.url.split("/").filter(Boolean).pop();

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};

const FavoritesScreen = () => {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No tienes favoritos todavía</Text>
        <Text style={styles.emptyMessage}>
          Marca un Pokemon con la estrella para verlo aquí.
        </Text>
        <Link href="/" asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backButtonText}>Volver a la lista</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  const renderFavorite = ({ item }: { item: PokemonListItem }) => {
    const favorite = isFavorite(item.name);

    return (
      <View style={styles.favoriteItem}>
        <Link
          href={{ pathname: "/pokemon/[name]", params: { name: item.name } }}
          asChild
        >
          <Pressable style={styles.cardContent}>
            <Image
              source={{ uri: getPokemonImageUrl(item) }}
              style={styles.pokemonImage}
            />
            <Text style={styles.pokemonName}>{item.name}</Text>
          </Pressable>
        </Link>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Quitar ${item.name} de favoritos`}
          onPress={() => toggleFavorite(item)}
          style={styles.favoriteButton}
        >
          <Text style={favorite ? styles.favoriteStar : styles.emptyStar}>
            {favorite ? "★" : "☆"}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <FlatList
      data={favorites}
      renderItem={renderFavorite}
      keyExtractor={(item) => item.name}
      contentContainerStyle={styles.list}
      ListHeaderComponent={<Text style={styles.title}>Mis favoritos</Text>}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 18,
    backgroundColor: "#a8ddd7",
  },
  title: {
    marginBottom: 12,
    color: "#172033",
    fontSize: 30,
    fontWeight: "700",
  },
  favoriteItem: {
    minHeight: 170,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#bfeee8",
    shadowColor: "#172033",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  pokemonImage: {
    width: 110,
    height: 110,
    marginBottom: 8,
  },
  pokemonName: {
    color: "#172033",
    fontSize: 17,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 4,
  },
  favoriteStar: {
    color: "#f59e0b",
    fontSize: 26,
  },
  emptyStar: {
    color: "#94a3b8",
    fontSize: 26,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#a8ddd7",
  },
  emptyTitle: {
    color: "#172033",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyMessage: {
    marginTop: 8,
    color: "#64748b",
    fontSize: 16,
    textAlign: "center",
  },
  backButton: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#0f766e",
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default FavoritesScreen;
