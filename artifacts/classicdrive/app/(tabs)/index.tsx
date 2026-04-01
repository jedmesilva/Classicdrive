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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import VehicleCarousel from "@/components/VehicleCarousel";
import BookingCard from "@/components/BookingCard";
import AddressSheet from "@/components/AddressSheet";
import ScheduleSheet from "@/components/ScheduleSheet";

type SheetType = null | "when" | "from" | "to";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const [sheet, setSheet] = useState<SheetType>(null);

  const [when, setWhen] = useState("Hoje, Agora");
  const [from, setFrom] = useState("Rua Havaí 350, Centro - ...");
  const [to, setTo] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad + 40 }}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: topPad + 12 }]}>
          <View style={styles.avatarRow}>
            <View style={[styles.avatar, { borderColor: colors.gold }]}>
              <Image
                source={{ uri: "https://i.pravatar.cc/88?img=11" }}
                style={styles.avatarImg}
              />
            </View>
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

        {/* Booking section */}
        <View style={styles.bookingSection}>
          <BookingCard
            label="Para quando?"
            value={when}
            placeholder="Selecionar data e hora"
            onPress={() => setSheet("when")}
          />
          <BookingCard
            label="De onde?"
            value={from}
            placeholder="Selecionar origem"
            onPress={() => setSheet("from")}
          />
          <BookingCard
            label="Para onde?"
            value={to}
            placeholder="Selecionar destino"
            onPress={() => setSheet("to")}
            last
          />
        </View>

        {/* CTA */}
        <View style={styles.ctaWrapper}>
          <TouchableOpacity
            style={[styles.cta, { backgroundColor: colors.gold }]}
            activeOpacity={0.88}
          >
            <Text style={styles.ctaText}>Contratar agora</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ScheduleSheet
        visible={sheet === "when"}
        onConfirm={(display) => {
          setWhen(display);
          setSheet(null);
        }}
        onClose={() => setSheet(null)}
      />

      <AddressSheet
        visible={sheet === "from" || sheet === "to"}
        label={sheet === "from" ? "De onde?" : "Para onde?"}
        onSelect={(addr) => {
          if (sheet === "from") setFrom(addr);
          else setTo(addr);
          setSheet(null);
        }}
        onClose={() => setSheet(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  avatarImg: {
    width: "100%",
    height: "100%",
  },
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
  carouselWrapper: {
    marginBottom: 28,
  },
  bookingSection: {
    paddingHorizontal: 24,
  },
  ctaWrapper: {
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  cta: {
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.3,
  },
});
