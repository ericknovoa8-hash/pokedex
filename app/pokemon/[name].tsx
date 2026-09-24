import { useLocalSearchParams } from "expo-router";
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

import { useFavorites } from "@/context/FavoritesContext";
import { usePokemonDetail } from "@/hooks/usePokemonDetail";
import { PokemonListItem } from "@/types/pokemon";

const PokemonDetailScreen = () => {
  const { name } = useLocalSearchParams<{ name: string }>();
  const { pokemon, loading, error } = usePokemonDetail(name);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { width } = useWindowDimensions();
  const imageSize = width > 600 ? 220 : 150;

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

  if (!pokemon) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.message}>No se encontró el Pokemon.</Text>
      </View>
    );
  }

  const favorite = isFavorite(pokemon.name);
  const pokemonAsListItem: PokemonListItem = {
    name: pokemon.name,
    url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`,
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Pokemon #{pokemon.id}</Text>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{pokemon.name}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              favorite
                ? `Quitar ${pokemon.name} de favoritos`
                : `Agregar ${pokemon.name} a favoritos`
            }
            onPress={() => toggleFavorite(pokemonAsListItem)}
            style={styles.favoriteButton}
          >
            <Text style={favorite ? styles.favoriteStar : styles.emptyStar}>
              {favorite ? "★" : "☆"}
            </Text>
          </Pressable>
        </View>

        {pokemon.sprites.front_default ? (
          <Image
            source={{ uri: pokemon.sprites.front_default }}
            style={[
              styles.pokemonImage,
              { width: imageSize, height: imageSize },
            ]}
          />
        ) : (
          <Text style={styles.message}>Imagen no disponible.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipos</Text>
        <View style={styles.typeList}>
          {pokemon.types.map((pokemonType) => (
            <View key={pokemonType.slot} style={styles.typeTag}>
              <Text style={styles.typeText}>{pokemonType.type.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.measurements}>
        <View style={styles.measurementCard}>
          <Text style={styles.measurementLabel}>Altura</Text>
          <Text style={styles.measurementValue}>{pokemon.height / 10} m</Text>
        </View>
        <View style={styles.measurementCard}>
          <Text style={styles.measurementLabel}>Peso</Text>
          <Text style={styles.measurementValue}>{pokemon.weight / 10} kg</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estadísticas</Text>
        {pokemon.stats.map((pokemonStat) => (
          <View key={pokemonStat.stat.name} style={styles.statRow}>
            <View style={styles.statHeader}>
              <Text style={styles.statName}>{pokemonStat.stat.name}</Text>
              <Text style={styles.statValue}>{pokemonStat.base_stat}</Text>
            </View>
            <View style={styles.statTrack}>
              <View
                style={[
                  styles.statBar,
                  { width: `${Math.min(pokemonStat.base_stat, 100)}%` },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 18,
    backgroundColor: "#f8fafc",
  },
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    color: "#172033",
    fontSize: 34,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  hero: {
    alignItems: "center",
    paddingVertical: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  eyebrow: {
    marginBottom: 4,
    color: "#64748b",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  pokemonImage: {
    marginTop: 12,
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteStar: {
    color: "#f59e0b",
    fontSize: 30,
  },
  emptyStar: {
    color: "#94a3b8",
    fontSize: 30,
  },
  section: {
    width: "100%",
    marginTop: 18,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#ffffff",
  },
  sectionTitle: {
    marginBottom: 12,
    color: "#172033",
    fontSize: 20,
    fontWeight: "700",
  },
  typeList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#dbeafe",
  },
  typeText: {
    color: "#1d4ed8",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  measurements: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  measurementCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#172033",
  },
  measurementLabel: {
    color: "#cbd5e1",
    fontSize: 14,
  },
  measurementValue: {
    marginTop: 6,
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },
  detailText: {
    fontSize: 16,
    textTransform: "capitalize",
  },
  statRow: {
    marginBottom: 14,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  statName: {
    color: "#475569",
    fontSize: 14,
    textTransform: "capitalize",
  },
  statValue: {
    color: "#172033",
    fontSize: 14,
    fontWeight: "700",
  },
  statTrack: {
    height: 8,
    overflow: "hidden",
    borderRadius: 4,
    backgroundColor: "#e2e8f0",
  },
  statBar: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#2563eb",
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

export default PokemonDetailScreen;
