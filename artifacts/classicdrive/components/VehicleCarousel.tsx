import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

export type Vehicle = {
  id: number;
  year: string;
  name: string;
  price: string;
  priceNum: number;
  tag: string;
  image: any;
};

export const VEHICLES: Vehicle[] = [
  {
    id: 1,
    year: "1969",
    name: "Ford Mustang Fastback",
    price: "R$220",
    priceNum: 220,
    tag: "VEÍCULO CLÁSSICO",
    image: require("@/assets/images/mustang.png"),
  },
  {
    id: 2,
    year: "1957",
    name: "Chevrolet Bel Air",
    price: "R$280",
    priceNum: 280,
    tag: "VEÍCULO CLÁSSICO",
    image: require("@/assets/images/belair.png"),
  },
  {
    id: 3,
    year: "1965",
    name: "Porsche 356 C",
    price: "R$350",
    priceNum: 350,
    tag: "ESPORTIVO",
    image: require("@/assets/images/porsche.png"),
  },
];

const { width } = Dimensions.get("window");
const CARD_W = width - 72;
const CARD_H = 300;

type Props = {
  activeIndex: number;
  onActiveChange: (i: number) => void;
};

export default function VehicleCarousel({ activeIndex, onActiveChange }: Props) {
  const colors = useColors();
  const flatRef = useRef<FlatList>(null);

  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const heartScales = useRef(VEHICLES.map(() => new Animated.Value(1))).current;

  function toggleFavorite(id: number, index: number) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    // Bounce animation
    Animated.sequence([
      Animated.spring(heartScales[index], {
        toValue: 1.4,
        useNativeDriver: true,
        speed: 400,
        bounciness: 0,
      }),
      Animated.spring(heartScales[index], {
        toValue: 1,
        useNativeDriver: true,
        speed: 150,
        bounciness: 8,
      }),
    ]).start();
  }

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        onActiveChange(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  return (
    <View>
      <FlatList
        ref={flatRef}
        data={VEHICLES}
        horizontal
        pagingEnabled={false}
        snapToInterval={CARD_W + 14}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          gap: 14,
          paddingBottom: 8,
          paddingTop: 8,
        }}
        keyExtractor={(item) => String(item.id)}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item, index }) => {
          const selected = activeIndex === index;
          const isFav = favorites.has(item.id);

          return (
            <TouchableOpacity
              activeOpacity={0.93}
              onPress={() => onActiveChange(index)}
              style={[styles.card, { width: CARD_W, height: CARD_H }]}
            >
              <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
              <View style={styles.overlay} />

              {/* Tag badge – top left */}
              <View style={[styles.badge, { backgroundColor: colors.gold }]}>
                <Text style={styles.badgeText}>{item.tag}</Text>
              </View>

              {/* Heart button – top right */}
              <TouchableOpacity
                style={styles.heartBtn}
                onPress={() => toggleFavorite(item.id, index)}
                activeOpacity={0.85}
                hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <Animated.View
                  style={{ transform: [{ scale: heartScales[index] }] }}
                >
                  <AntDesign
                    name={isFav ? "heart" : "hearto"}
                    size={19}
                    color={isFav ? colors.gold : "rgba(255,255,255,0.85)"}
                  />
                </Animated.View>
              </TouchableOpacity>

              {/* Bottom content */}
              <View style={styles.cardContent}>
                <Text style={styles.cardYear}>{item.year}</Text>
                <Text style={styles.cardName}>{item.name}</Text>
                <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}>
                  <Text style={[styles.cardPrice, { color: colors.goldLight }]}>
                    {item.price}
                  </Text>
                  <Text style={styles.cardPriceSub}>/hora</Text>
                </View>
              </View>

              {selected && (
                <View
                  style={[styles.selectionRing, { borderColor: colors.gold }]}
                  pointerEvents="none"
                />
              )}
            </TouchableOpacity>
          );
        }}
      />

      {/* Pagination dots */}
      <View style={styles.dots}>
        {VEHICLES.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              flatRef.current?.scrollToIndex({ index: i, animated: true });
              onActiveChange(i);
            }}
            style={[
              styles.dot,
              {
                width: activeIndex === i ? 20 : 6,
                backgroundColor: activeIndex === i ? colors.gold : "#D8D0C4",
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  selectionRing: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    borderWidth: 3,
  },
  cardImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  badge: {
    position: "absolute",
    top: 16,
    left: 16,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  heartBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.38)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  cardYear: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 2,
  },
  cardName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 26,
    marginBottom: 6,
  },
  cardPrice: {
    fontSize: 20,
    fontWeight: "700",
  },
  cardPriceSub: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
