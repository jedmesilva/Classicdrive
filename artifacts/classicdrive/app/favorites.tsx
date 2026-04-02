import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { VEHICLES, type Vehicle } from "@/components/VehicleCarousel";

const FAVORITED_IDS = new Set([1, 2]);
const FAVORITES: Vehicle[] = VEHICLES.filter((v) => FAVORITED_IDS.has(v.id));

export default function FavoritesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Math.max(insets.bottom, 16);

  function handleContratar(vehicle: Vehicle) {
    const index = VEHICLES.findIndex((v) => v.id === vehicle.id);
    router.push({ pathname: "/", params: { vehicleIndex: String(index) } });
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background ?? colors.sheet }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.divider, paddingTop: topPad + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.foreground }]}>Favoritos</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {FAVORITES.length} {FAVORITES.length === 1 ? "veículo salvo" : "veículos salvos"}
          </Text>
        </View>
      </View>

      {/* List */}
      <ScrollView
        style={styles.listScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPad + 16 }]}
      >
        {FAVORITES.length === 0 ? (
          <View style={styles.emptyState}>
            <AntDesign name="hearto" size={44} color={colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Nenhum favorito ainda
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
              Toque no coração de um veículo para adicioná-lo aqui.
            </Text>
          </View>
        ) : (
          FAVORITES.map((vehicle) => (
            <View
              key={vehicle.id}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.divider }]}
            >
              {/* Image */}
              <View style={styles.imageWrapper}>
                <Image source={vehicle.image} style={styles.image} resizeMode="cover" />
                <View style={styles.imageOverlay} />
                <View style={[styles.tagBadge, { backgroundColor: colors.gold }]}>
                  <Text style={styles.tagText}>{vehicle.tag}</Text>
                </View>
                <View style={[styles.heartBadge, { backgroundColor: "rgba(0,0,0,0.38)" }]}>
                  <AntDesign name="heart" size={16} color={colors.gold} />
                </View>
              </View>

              {/* Info */}
              <View style={styles.info}>
                <View style={styles.infoTop}>
                  <View style={styles.infoText}>
                    <Text style={[styles.vehicleYear, { color: colors.mutedForeground }]}>
                      {vehicle.year}
                    </Text>
                    <Text style={[styles.vehicleName, { color: colors.foreground }]}>
                      {vehicle.name}
                    </Text>
                  </View>
                  <View style={styles.priceBlock}>
                    <Text style={[styles.price, { color: colors.gold }]}>{vehicle.price}</Text>
                    <Text style={[styles.priceSub, { color: colors.mutedForeground }]}>/hora</Text>
                  </View>
                </View>

                <View style={[styles.infoFooter, { borderTopColor: colors.divider }]}>
                  <TouchableOpacity
                    onPress={() => handleContratar(vehicle)}
                    activeOpacity={0.85}
                    style={[styles.ctaBtn, { backgroundColor: colors.gold }]}
                  >
                    <Feather name="calendar" size={15} color="#fff" />
                    <Text style={styles.ctaText}>Contratar este veículo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    gap: 14,
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },

  listScroll: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    gap: 16,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    gap: 12,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  imageWrapper: {
    width: "100%",
    height: 200,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  tagBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    fontFamily: "Inter_700Bold",
  },
  heartBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  info: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  infoTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  infoText: {
    flex: 1,
    gap: 2,
  },
  vehicleYear: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  vehicleName: {
    fontSize: 19,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
    lineHeight: 24,
  },
  priceBlock: {
    alignItems: "flex-end",
    gap: 1,
  },
  price: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  priceSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },

  infoFooter: {
    borderTopWidth: 1,
    paddingVertical: 12,
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
  },
  ctaText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
});
