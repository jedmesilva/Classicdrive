import React, { memo, useMemo } from "react";
import { Platform, StyleSheet } from "react-native";
import MapView, { Polyline, PROVIDER_DEFAULT } from "react-native-maps";
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

function RouteMapPreview({ route, accentColor }: Props) {
  const region = useMemo(
    () => getRegionForCoordinates(route.coordinates),
    [route.id]
  );

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_DEFAULT}
      initialRegion={region}
      scrollEnabled={false}
      zoomEnabled={false}
      pitchEnabled={false}
      rotateEnabled={false}
      pointerEvents="none"
      liteMode={Platform.OS === "android"}
      moveOnMarkerPress={false}
    >
      <Polyline
        coordinates={route.coordinates}
        strokeColor={accentColor}
        strokeWidth={3.5}
        lineCap="round"
        lineJoin="round"
      />
    </MapView>
  );
}

export default memo(RouteMapPreview);

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: 150,
  },
});
