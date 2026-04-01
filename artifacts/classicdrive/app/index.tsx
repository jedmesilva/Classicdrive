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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useBooking, type Modality, type Waypoint } from "@/context/BookingContext";
import VehicleCarousel, { VEHICLES } from "@/components/VehicleCarousel";
import BookingCard from "@/components/BookingCard";
import WaypointCard, { cycleTime } from "@/components/WaypointCard";

const MODALITIES: { id: Modality; label: string; icon: string }[] = [
  { id: "rotalivre", label: "Rota Livre", icon: "navigation" },
  { id: "exposicao", label: "Exposição",  icon: "star"       },
  { id: "rota",      label: "Rota pública", icon: "map"        },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    modality, setModality,
    when, from, to, location, duration, route,
    waypoints, setWaypoints,
    activeVehicleIndex: activeIndex, setActiveVehicleIndex: setActiveIndex,
  } = useBooking();

  const topPad    = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  function switchModality(m: Modality) {
    setModality(m);
  }

  function addWaypoint() {
    const newWp: Waypoint = {
      id: `wp-${Date.now()}`,
      address: "",
      minutes: 30,
    };
    setWaypoints([...waypoints, newWp]);
  }

  function removeWaypoint(id: string) {
    setWaypoints(waypoints.filter(w => w.id !== id));
  }

  function moveWaypoint(index: number, direction: "up" | "down") {
    const next = [...waypoints];
    const swap = direction === "up" ? index - 1 : index + 1;
    [next[index], next[swap]] = [next[swap], next[index]];
    setWaypoints(next);
  }

  function cycleWaypointTime(id: string) {
    setWaypoints(waypoints.map(w => w.id === id ? { ...w, minutes: cycleTime(w.minutes) } : w));
  }

  const canContract =
    modality === "rotalivre" ? (!!from && !!to) :
    modality === "exposicao" ? (!!location && !!duration) :
    modality === "rota"      ? (!!route && !!from) : false;

  function renderFields() {
    if (modality === "rotalivre") {
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

          {/* Waypoints */}
          {waypoints.map((wp, i) => (
            <WaypointCard
              key={wp.id}
              index={i}
              total={waypoints.length}
              address={wp.address}
              minutes={wp.minutes}
              onPressAddress={() =>
                router.push({
                  pathname: "/address",
                  params: { field: "waypoint", waypointId: wp.id, waypointIndex: String(i) },
                })
              }
              onCycleTime={() => cycleWaypointTime(wp.id)}
              onMoveUp={() => moveWaypoint(i, "up")}
              onMoveDown={() => moveWaypoint(i, "down")}
              onRemove={() => removeWaypoint(wp.id)}
            />
          ))}

          {/* Add waypoint button */}
          <View style={styles.addWpRow}>
            <View style={styles.addWpTimeline}>
              <View style={[styles.addWpLine, { borderLeftColor: colors.border }]} />
            </View>
            <TouchableOpacity
              style={[styles.addWpBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
              onPress={addWaypoint}
              activeOpacity={0.8}
            >
              <Feather name="plus" size={15} color={colors.gold} />
              <Text style={[styles.addWpText, { color: colors.gold }]}>Adicionar parada</Text>
            </TouchableOpacity>
          </View>

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
            label="De onde?"
            value={from}
            placeholder="Selecionar origem"
            onPress={() => router.push({ pathname: "/address", params: { field: "from" } })}
          />
          <BookingCard
            label="Rota"
            value={route?.name ?? ""}
            placeholder="Escolher rota"
            onPress={() => router.push("/route")}
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
                <View style={styles.tabContent}>
                  <Feather
                    name={m.icon as any}
                    size={15}
                    color={isActive ? colors.gold : colors.textTertiary}
                  />
                  <Text
                    style={[
                      styles.tabLabel,
                      { color: isActive ? colors.foreground : colors.textTertiary },
                      isActive && styles.tabLabelActive,
                    ]}
                  >
                    {m.label}
                  </Text>
                </View>
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
            onPress={() => canContract && router.push("/confirm")}
          >
            <Text
              style={[
                styles.ctaText,
                { color: canContract ? "#fff" : colors.textPlaceholder },
              ]}
            >
              {canContract
                ? `Contratar · ${VEHICLES[activeIndex].name}`
                : "Preencha os campos para continuar"}
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
  carouselWrapper: { marginBottom: 20 },
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
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 10,
  },
  tabLabel: {
    fontSize: 13,
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

  addWpRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 0,
  },
  addWpTimeline: {
    width: 12,
    alignItems: "center",
    paddingVertical: 6,
  },
  addWpLine: {
    flex: 1,
    borderLeftWidth: 2,
    borderStyle: "dashed",
  },
  addWpBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 16,
  },
  addWpText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },

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
