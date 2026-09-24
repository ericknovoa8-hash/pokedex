import { Link } from "expo-router";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

import { useFavorites } from "@/context/FavoritesContext";
import { usePokemonList } from "@/hooks/usePokemonList";
import { PokemonListItem } from "@/types/pokemon";

const PokemonListScreen = () => {
  const { pokemon, loading, error } = usePokemonList(20);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { width } = useWindowDimensions();
  const columns = width > 600 ? 3 : width > 380 ? 2 : 1;

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Cargando Pokemon...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  const renderPokemon = ({ item }: { item: PokemonListItem }) => {
    const favorite = isFavorite(item.name);

    return (
      <View style={styles.pokemonItem}>
        <Link
          href={{ pathname: "/pokemon/[name]", params: { name: item.name } }}
          asChild
        >
          <Pressable style={styles.cardContent}>
            <Image
              source={{
                uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.url
                  .split("/")
                  .filter(Boolean)
                  .pop()}.png`,
              }}
              style={styles.pokemonImage}
            />
            <Text style={styles.pokemonName}>{item.name}</Text>
          </Pressable>
        </Link>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            favorite
              ? `Quitar ${item.name} de favoritos`
              : `Agregar ${item.name} a favoritos`
          }
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

  const listHeader = (
    <View style={styles.header}>
      <Text style={styles.title}>Pokedex Lite</Text>
      <Link href="/favoritos" asChild>
        <Pressable style={styles.favoritesLink}>
          <Text style={styles.favoritesLinkText}>Ver favoritos</Text>
        </Pressable>
      </Link>
    </View>
  );

  return (
    <FlatList
      key={columns}
      data={pokemon}
      renderItem={renderPokemon}
      keyExtractor={(item) => item.name}
      numColumns={columns}
      contentContainerStyle={styles.list}
      ListHeaderComponent={listHeader}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 12,
    backgroundColor: "#f8fafc",
  },
  title: {
    color: "#172033",
    fontSize: 30,
    fontWeight: "700",
  },
  header: {
    marginBottom: 12,
    paddingHorizontal: 6,
  },
  favoritesLink: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingVertical: 4,
  },
  favoritesLinkText: {
    color: "#2563eb",
    fontSize: 16,
    fontWeight: "600",
  },
  pokemonItem: {
    flex: 1,
    minHeight: 170,
    margin: 6,
    borderRadius: 16,
    backgroundColor: "#ffffff",
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
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
  },
  error: {
    color: "#b91c1c",
    fontSize: 16,
    textAlign: "center",
  },
});

export default PokemonListScreen;
