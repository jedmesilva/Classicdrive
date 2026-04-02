import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useBooking, type Route } from "@/context/BookingContext";
import RouteMapPreview from "@/components/RouteMapPreview";

const COMMUNITY_ROUTES: Route[] = [
  {
    id: 1,
    name: "Rota Art Déco de BH",
    duration: "2h",
    stops: 4,
    distance: "18km",
    author: "Carlos M.",
    stopNames: [
      "Praça Sete de Setembro",
      "Edifício Acaiaca",
      "Igreja São José",
      "Mercado Central",
    ],
    coordinates: [
      { latitude: -19.9232, longitude: -43.9469 },
      { latitude: -19.9195, longitude: -43.9456 },
      { latitude: -19.9187, longitude: -43.9406 },
      { latitude: -19.9221, longitude: -43.9377 },
    ],
  },
  {
    id: 2,
    name: "Circuito Gastronômico Savassi",
    duration: "1h30",
    stops: 3,
    distance: "9km",
    author: "Ana R.",
    stopNames: [
      "Praça da Savassi",
      "Restaurante Xapuri",
      "Bar do Salomão",
    ],
    coordinates: [
      { latitude: -19.9381, longitude: -43.9322 },
      { latitude: -19.9347, longitude: -43.9299 },
      { latitude: -19.9406, longitude: -43.939 },
    ],
  },
  {
    id: 3,
    name: "BH Modernista",
    duration: "3h",
    stops: 6,
    distance: "24km",
    author: "Pedro L.",
    stopNames: [
      "Praça da Liberdade",
      "Palácio das Artes",
      "Igreja São Francisco de Assis",
      "Casa do Baile",
      "Mineirão",
      "Mineirinho",
    ],
    coordinates: [
      { latitude: -19.9318, longitude: -43.9376 },
      { latitude: -19.9232, longitude: -43.9469 },
      { latitude: -19.882, longitude: -43.968 },
      { latitude: -19.8654, longitude: -43.972 },
      { latitude: -19.8588, longitude: -43.9726 },
      { latitude: -19.9167, longitude: -43.9345 },
    ],
  },
  {
    id: 4,
    name: "Volta à Pampulha",
    duration: "2h30",
    stops: 5,
    distance: "21km",
    author: "Julia F.",
    stopNames: [
      "Museu de Arte da Pampulha",
      "Igreja São Francisco de Assis",
      "Casa do Baile",
      "Iate Clube da Pampulha",
      "Estádio Mineirão",
    ],
    coordinates: [
      { latitude: -19.8558, longitude: -43.9669 },
      { latitude: -19.8588, longitude: -43.9726 },
      { latitude: -19.8624, longitude: -43.9742 },
      { latitude: -19.8654, longitude: -43.972 },
      { latitude: -19.868, longitude: -43.9732 },
    ],
  },
];

// ── Stop list timeline ────────────────────────────────────────────────────────

type StopListProps = {
  stops: string[];
  accentColor: string;
  mutedColor: string;
  borderColor: string;
};

function StopList({ stops, accentColor, mutedColor, borderColor }: StopListProps) {
  return (
    <View style={sl.wrapper}>
      {stops.map((name, i) => {
        const isFirst = i === 0;
        const isLast = i === stops.length - 1;
        return (
          <View key={i} style={sl.row}>
            {/* Timeline column */}
            <View style={sl.track}>
              {!isFirst && (
                <View style={[sl.lineTop, { backgroundColor: borderColor }]} />
              )}
              <View
                style={[
                  sl.dot,
                  isFirst || isLast
                    ? { backgroundColor: accentColor, width: 8, height: 8, borderRadius: 4 }
                    : { backgroundColor: mutedColor, width: 5, height: 5, borderRadius: 2.5 },
                ]}
              />
              {!isLast && (
                <View style={[sl.lineBottom, { backgroundColor: borderColor }]} />
              )}
            </View>
            {/* Stop name */}
            <Text
              style={[
                sl.stopName,
                {
                  color: isFirst || isLast ? accentColor : mutedColor,
                  fontWeight: isFirst || isLast ? "600" : "400",
                },
              ]}
              numberOfLines={1}
            >
              {name}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const sl = StyleSheet.create({
  wrapper: {
    marginTop: 10,
    marginBottom: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 22,
  },
  track: {
    width: 20,
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "center",
  },
  lineTop: {
    position: "absolute",
    top: 0,
    bottom: "50%",
    width: 1,
  },
  lineBottom: {
    position: "absolute",
    top: "50%",
    bottom: 0,
    width: 1,
  },
  dot: {
    zIndex: 1,
  },
  stopName: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginLeft: 8,
    paddingVertical: 3,
  },
});

// ── Main screen ───────────────────────────────────────────────────────────────

export default function RouteScreen() {
  const colors = useColors();
  const { route: selectedRoute, setRoute } = useBooking();

  function handleSelect(r: Route) {
    setRoute(r);
    router.back();
  }

  function renderItem({ item }: { item: Route }) {
    const isSel = selectedRoute?.id === item.id;
    return (
      <TouchableOpacity
        onPress={() => handleSelect(item)}
        activeOpacity={0.8}
        delayPressIn={50}
        style={[
          styles.card,
          {
            backgroundColor: isSel ? `${colors.gold}10` : colors.card,
            borderColor: isSel ? colors.gold : colors.border,
            borderWidth: isSel ? 1.5 : 1,
          },
        ]}
      >
        {/* Map preview */}
        <View style={styles.mapWrapper}>
          <RouteMapPreview route={item} accentColor={colors.gold} />
        </View>

        {/* Card body */}
        <View style={styles.content}>
          {/* Title row */}
          <View style={styles.cardTop}>
            <Text
              style={[styles.cardName, { color: colors.foreground }]}
              numberOfLines={2}
            >
              {item.name}
            </Text>
            <View
              style={[
                styles.radio,
                {
                  borderColor: isSel ? colors.gold : colors.border,
                  backgroundColor: isSel ? colors.gold : "transparent",
                },
              ]}
            >
              {isSel && <Feather name="check" size={11} color="#fff" />}
            </View>
          </View>

          {/* Meta */}
          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Feather name="clock" size={12} color={colors.textMuted} />
              <Text style={[styles.metaText, { color: colors.textMuted }]}>
                {item.duration}
              </Text>
            </View>
            <View style={styles.metaChip}>
              <Feather name="navigation" size={12} color={colors.textMuted} />
              <Text style={[styles.metaText, { color: colors.textMuted }]}>
                {item.distance}
              </Text>
            </View>
          </View>

          {/* Stop list */}
          <StopList
            stops={item.stopNames}
            accentColor={colors.gold}
            mutedColor={colors.textMuted}
            borderColor={colors.border}
          />

          <Text style={[styles.author, { color: colors.textTertiary }]}>
            por {item.author}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.sheet }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Rotas públicas
        </Text>
        <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
          Percursos curados por entusiastas
        </Text>
      </View>

      <FlatList
        data={COMMUNITY_ROUTES}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        overScrollMode="never"
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
    paddingBottom: Platform.OS === "ios" ? 16 : 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
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
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
  },
  mapWrapper: {
    height: 150,
  },
  content: {
    padding: 14,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 8,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    flex: 1,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  metaRow: {
    flexDirection: "row",
    gap: 14,
    flexWrap: "wrap",
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  author: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 10,
  },
});
