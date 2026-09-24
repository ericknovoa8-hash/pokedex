import { Stack } from "expo-router";
import "react-native-reanimated";

import { FavoritesProvider } from "@/context/FavoritesContext";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Pokedex Lite" }} />
        <Stack.Screen name="pokemon/[name]" options={{ title: "Pokemon" }} />
        <Stack.Screen name="favoritos" options={{ title: "Favoritos" }} />
      </Stack>
    </FavoritesProvider>
  );
}
