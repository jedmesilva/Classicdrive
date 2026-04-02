import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { Route } from "@/context/BookingContext";

type Props = {
  route: Route;
  accentColor: string;
};

export default function RouteMapPreview({ route, accentColor }: Props) {
  return (
    <View style={[styles.placeholder, { backgroundColor: "#12121e" }]}>
      <Feather name="map" size={22} color={accentColor} />
      <Text style={[styles.text, { color: accentColor }]}>
        {route.stops} paradas · {route.distance}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    width: "100%",
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  text: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
