import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import type { Route } from "@/context/BookingContext";

const CARD_H = 150;
const TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? "";

/**
 * Builds a Mapbox Static Images URL that renders the route directly on the map.
 * Uses the GeoJSON overlay + `auto` viewport so Mapbox fits the image to the
 * route bounding box automatically.
 * Returns 720×300 px (displayed at 360×150 dp on 2× retina devices).
 */
function buildUrl(coords: Route["coordinates"], accentColor: string): string {
  const lineCoords = coords.map((c) => [c.longitude, c.latitude]);

  const geojson = {
    type: "FeatureCollection",
    features: [
      // Route line
      {
        type: "Feature",
        properties: {
          stroke: accentColor,
          "stroke-width": 4,
          "stroke-opacity": 0.95,
        },
        geometry: { type: "LineString", coordinates: lineCoords },
      },
      // Start pin
      {
        type: "Feature",
        properties: {
          "marker-color": accentColor,
          "marker-size": "small",
          "marker-symbol": "",
        },
        geometry: { type: "Point", coordinates: lineCoords[0] },
      },
      // End pin
      {
        type: "Feature",
        properties: {
          "marker-color": accentColor,
          "marker-size": "small",
          "marker-symbol": "",
        },
        geometry: {
          type: "Point",
          coordinates: lineCoords[lineCoords.length - 1],
        },
      },
    ],
  };

  const encoded = encodeURIComponent(JSON.stringify(geojson));

  return (
    `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static` +
    `/geojson(${encoded})` +
    `/auto/720x300` +
    `?padding=48,48,48,48` +
    `&access_token=${TOKEN}`
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

type Props = { route: Route; accentColor: string };

function RouteMapPreview({ route, accentColor }: Props) {
  const url = useMemo(
    () => buildUrl(route.coordinates, accentColor),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [route.id]
  );

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: url }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={250}
      />
    </View>
  );
}

export default memo(RouteMapPreview);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: CARD_H,
    overflow: "hidden",
    backgroundColor: "#0d1117",
  },
});
