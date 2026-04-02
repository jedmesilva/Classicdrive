import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Polyline, Marker, PROVIDER_DEFAULT } from "react-native-maps";
import type { Route } from "@/context/BookingContext";

function getRegionForCoordinates(coords: Route["coordinates"]) {
  const lats = coords.map((c) => c.latitude);
  const lngs = coords.map((c) => c.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const padding = 0.35;
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(maxLat - minLat, 0.01) * (1 + padding),
    longitudeDelta: Math.max(maxLng - minLng, 0.01) * (1 + padding),
  };
}

type Props = {
  route: Route;
  accentColor: string;
};

export default function RouteMapPreview({ route, accentColor }: Props) {
  const region = useMemo(
    () => getRegionForCoordinates(route.coordinates),
    [route.coordinates]
  );

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_DEFAULT}
      region={region}
      scrollEnabled={false}
      zoomEnabled={false}
      pitchEnabled={false}
      rotateEnabled={false}
      pointerEvents="none"
    >
      <Polyline
        coordinates={route.coordinates}
        strokeColor={accentColor}
        strokeWidth={3}
      />
      {route.coordinates.map((coord, index) => {
        const isEndpoint =
          index === 0 || index === route.coordinates.length - 1;
        return (
          <Marker
            key={index}
            coordinate={coord}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View
              style={[
                styles.dot,
                isEndpoint
                  ? { backgroundColor: accentColor, borderColor: accentColor }
                  : styles.dotMid,
              ]}
            />
          </Marker>
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: 150,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#ffffff",
    backgroundColor: "#ffffff",
  },
  dotMid: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#aaa",
    backgroundColor: "#ffffff",
  },
});
