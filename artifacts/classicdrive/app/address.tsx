import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useBooking } from "@/context/BookingContext";

const RECENT_ADDRESSES = [
  { id: 1, main: "Rua Havaí, 350", sub: "Centro, Belo Horizonte - MG", icon: "clock" },
  { id: 2, main: "Av. do Contorno, 6000", sub: "Funcionários, Belo Horizonte - MG", icon: "clock" },
  { id: 3, main: "Praça da Liberdade", sub: "Funcionários, Belo Horizonte - MG", icon: "clock" },
  { id: 4, main: "Shopping Diamond Mall", sub: "Gutierrez, Belo Horizonte - MG", icon: "clock" },
  { id: 5, main: "Aeroporto de Confins", sub: "Confins - MG", icon: "clock" },
];

const MOCK_SUGGESTIONS: Record<string, { id: number; main: string; sub: string; icon: string }[]> = {
  r: [
    { id: 10, main: "Rua da Bahia, 1148", sub: "Centro, Belo Horizonte - MG", icon: "pin" },
    { id: 11, main: "Rua Sergipe, 400", sub: "Funcionários, Belo Horizonte - MG", icon: "pin" },
    { id: 12, main: "Rua Curitiba, 832", sub: "Centro, Belo Horizonte - MG", icon: "pin" },
  ],
  av: [
    { id: 13, main: "Av. Afonso Pena, 1500", sub: "Centro, Belo Horizonte - MG", icon: "pin" },
    { id: 14, main: "Av. Getúlio Vargas, 300", sub: "Funcionários, Belo Horizonte - MG", icon: "pin" },
    { id: 15, main: "Av. Raja Gabaglia, 1000", sub: "Gutierrez, Belo Horizonte - MG", icon: "pin" },
  ],
  pr: [
    { id: 16, main: "Praça Sete de Setembro", sub: "Centro, Belo Horizonte - MG", icon: "pin" },
    { id: 17, main: "Praça da Estação", sub: "Centro, Belo Horizonte - MG", icon: "pin" },
  ],
};

function getSuggestions(query: string) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  for (const key of Object.keys(MOCK_SUGGESTIONS)) {
    if (q.startsWith(key)) return MOCK_SUGGESTIONS[key];
  }
  return [
    { id: 99, main: `${query}, 100`, sub: "Belo Horizonte - MG", icon: "pin" },
    { id: 98, main: `${query} - Centro`, sub: "Belo Horizonte - MG", icon: "pin" },
  ];
}

type AddressItem = { id: number; main: string; sub: string; icon: string };

export default function AddressScreen() {
  const colors = useColors();
  const { field } = useLocalSearchParams<{ field: "from" | "to" }>();
  const { setFrom, setTo } = useBooking();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const showSuggestions = query.length >= 2;
  const list = showSuggestions ? getSuggestions(query) : RECENT_ADDRESSES;
  const listLabel = showSuggestions ? "SUGESTÕES" : "RECENTES";
  const label = field === "from" ? "De onde?" : "Para onde?";

  function handleSelect(address: string) {
    if (field === "from") setFrom(address);
    else setTo(address);
    router.back();
  }

  function renderItem({ item }: { item: AddressItem }) {
    const isClock = item.icon === "clock";
    return (
      <TouchableOpacity
        onPress={() => handleSelect(item.main)}
        style={styles.row}
        activeOpacity={0.75}
      >
        <View style={[styles.rowIcon, { backgroundColor: isClock ? colors.muted : `${colors.gold}22` }]}>
          <Feather name={isClock ? "clock" : "map-pin"} size={17} color={isClock ? colors.textMuted : colors.gold} />
        </View>
        <View style={styles.rowText}>
          <Text style={[styles.rowMain, { color: colors.foreground }]} numberOfLines={1}>
            {item.main}
          </Text>
          <Text style={[styles.rowSub, { color: colors.textMuted }]} numberOfLines={1}>
            {item.sub}
          </Text>
        </View>
        <Feather name="chevron-right" size={16} color={colors.textPlaceholder} />
      </TouchableOpacity>
    );
  }

  const subtitle =
    field === "from"
      ? "Digite ou selecione o ponto de partida"
      : "Digite ou selecione o destino da viagem";

  return (
    <View style={[styles.container, { backgroundColor: colors.sheet }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>{label}</Text>
        <Text style={[styles.subtitle, { color: colors.textTertiary }]}>{subtitle}</Text>
      </View>
      <View style={styles.searchWrapper}>
        <View style={[
          styles.searchBox,
          { backgroundColor: colors.bgInput, borderColor: focused ? colors.gold : "transparent" },
        ]}>
          <Feather name="search" size={18} color={colors.textMuted} />
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Buscar endereço..."
            placeholderTextColor={colors.textPlaceholder}
            style={[styles.searchInput, { color: colors.foreground }]}
            returnKeyType="search"
          />
          <TouchableOpacity
            onPress={() => handleSelect("Minha localização atual")}
            style={[styles.locationBtn, { borderLeftColor: colors.borderSubtle }]}
          >
            <Feather name="crosshair" size={20} color={colors.gold} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.divider }]} />

      <Text style={[styles.sectionLabel, { color: colors.textBadge }]}>{listLabel}</Text>

      <FlatList
        data={list}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 2,
    fontFamily: "Inter_700Bold",
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  searchWrapper: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
    fontFamily: "Inter_400Regular",
  },
  locationBtn: {
    paddingLeft: 12,
    paddingVertical: 6,
    borderLeftWidth: 1,
  },
  divider: { height: 1, marginHorizontal: 24 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginHorizontal: 24,
    marginTop: 14,
    marginBottom: 4,
    fontFamily: "Inter_700Bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 13,
    paddingHorizontal: 24,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowText: { flex: 1, minWidth: 0 },
  rowMain: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  rowSub: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: "Inter_400Regular",
  },
});
