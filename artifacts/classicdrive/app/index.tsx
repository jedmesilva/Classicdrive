import React, { useState } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useBooking, type Modality } from "@/context/BookingContext";
import VehicleCarousel from "@/components/VehicleCarousel";
import BookingCard from "@/components/BookingCard";

const MODALITIES: { id: Modality; label: string }[] = [
  { id: "transfer",  label: "Transfer"  },
  { id: "exposicao", label: "Exposição" },
  { id: "rota",      label: "Rota"      },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    modality, setModality,
    when, from, to, location, duration, route,
  } = useBooking();
  const [activeIndex, setActiveIndex] = useState(0);

  const topPad    = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  function switchModality(m: Modality) {
    setModality(m);
  }

  const canContract =
    modality === "transfer"  ? !!to :
    modality === "exposicao" ? (!!location && !!duration) :
    modality === "rota"      ? (!!route && !!from) : false;

  function renderFields() {
    if (modality === "transfer") {
      return (
        <>
          <BookingCard
            label="Para quando?"
            value={when}
            placeholder="Selecionar data e hora"
            onPress={() => router.push("/schedule")}
          />
          <BookingCard
            label="De onde?"
            value={from}
            placeholder="Selecionar origem"
            onPress={() => router.push({ pathname: "/address", params: { field: "from" } })}
          />
          <BookingCard
            label="Para onde?"
            value={to}
            placeholder="Selecionar destino"
            onPress={() => router.push({ pathname: "/address", params: { field: "to" } })}
            last
          />
        </>
      );
    }

    if (modality === "exposicao") {
      return (
        <>
          <BookingCard
            label="Para quando?"
            value={when}
            placeholder="Selecionar data e hora"
            onPress={() => router.push("/schedule")}
          />
          <BookingCard
            label="Local da exposição"
            value={location}
            placeholder="Selecionar local"
            onPress={() => router.push({ pathname: "/address", params: { field: "location" } })}
          />
          <BookingCard
            label="Por quanto tempo?"
            value={duration?.label ?? ""}
            placeholder="Selecionar duração"
            onPress={() => router.push("/duration")}
            last
          />
        </>
      );
    }

    if (modality === "rota") {
      return (
        <>
          <BookingCard
            label="Para quando?"
            value={when}
            placeholder="Selecionar data e hora"
            onPress={() => router.push("/schedule")}
          />
          <BookingCard
            label="Rota"
            value={route?.name ?? ""}
            placeholder="Escolher rota"
            onPress={() => router.push("/route")}
          />
          <BookingCard
            label="De onde?"
            value={from}
            placeholder="Selecionar origem"
            onPress={() => router.push({ pathname: "/address", params: { field: "from" } })}
          />
          <BookingCard
            label="Para onde?"
            value={to}
            placeholder="Destino (opcional)"
            onPress={() => router.push({ pathname: "/address", params: { field: "to" } })}
            last
          />
        </>
      );
    }

    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad + 40 }}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: topPad + 12 }]}>
          <View style={styles.avatarRow}>
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              activeOpacity={0.8}
              style={[styles.avatar, { borderColor: colors.gold }]}
            >
              <Image
                source={{ uri: "https://i.pravatar.cc/88?img=11" }}
                style={styles.avatarImg}
              />
            </TouchableOpacity>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
              Olá, Lucas!
            </Text>
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Contrate um Clássico agora
          </Text>
        </View>

        {/* Carousel */}
        <View style={styles.carouselWrapper}>
          <VehicleCarousel activeIndex={activeIndex} onActiveChange={setActiveIndex} />
        </View>

        {/* Modality Tabs */}
        <View style={[styles.tabsWrapper, { borderBottomColor: colors.border }]}>
          {MODALITIES.map((m) => {
            const isActive = modality === m.id;
            return (
              <TouchableOpacity
                key={m.id}
                onPress={() => switchModality(m.id)}
                style={styles.tab}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isActive ? colors.foreground : colors.textTertiary },
                    isActive && styles.tabLabelActive,
                  ]}
                >
                  {m.label}
                </Text>
                <View
                  style={[
                    styles.tabIndicator,
                    {
                      backgroundColor: isActive ? colors.gold : colors.border,
                      width: isActive ? 18 : 4,
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Dynamic booking fields */}
        <View style={styles.bookingSection} key={modality}>
          {renderFields()}
        </View>

        {/* CTA */}
        <View style={styles.ctaWrapper}>
          <TouchableOpacity
            style={[
              styles.cta,
              { backgroundColor: canContract ? colors.gold : colors.border },
            ]}
            activeOpacity={canContract ? 0.88 : 1}
            disabled={!canContract}
          >
            <Text
              style={[
                styles.ctaText,
                { color: canContract ? "#fff" : colors.textPlaceholder },
              ]}
            >
              {canContract ? "Contratar agora" : "Preencha os campos para continuar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 2,
  },
  avatarImg: { width: "100%", height: "100%" },
  greeting: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
    fontFamily: "Inter_700Bold",
  },
  carouselWrapper: { marginBottom: 4 },
  tabsWrapper: {
    flexDirection: "row",
    marginHorizontal: 24,
    marginBottom: 24,
    borderBottomWidth: 0,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 0,
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  tabLabelActive: {
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  tabIndicator: {
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  bookingSection: { paddingHorizontal: 24 },
  ctaWrapper: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  cta: {
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.3,
  },
});
