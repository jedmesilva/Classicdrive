import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import Svg, { Circle, Polyline } from "react-native-svg";
import type { Route } from "@/context/BookingContext";

const W = 360;
const H = 150;
const PAD = 24;
const IMG_W = 720;
const IMG_H = 300;

function getBoundingBox(coords: Route["coordinates"]) {
  const lats = coords.map((c) => c.latitude);
  const lngs = coords.map((c) => c.longitude);
  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
    centerLat: (Math.min(...lats) + Math.max(...lats)) / 2,
    centerLng: (Math.min(...lngs) + Math.max(...lngs)) / 2,
  };
}

function calcZoom(maxDelta: number): number {
  if (maxDelta > 0.1) return 12;
  if (maxDelta > 0.05) return 13;
  if (maxDelta > 0.02) return 14;
  return 15;
}

function buildMapUrl(coords: Route["coordinates"]): string {
  const bb = getBoundingBox(coords);
  const maxDelta = Math.max(bb.maxLat - bb.minLat, bb.maxLng - bb.minLng);
  const zoom = calcZoom(maxDelta);
  const path = coords.map((c) => `${c.latitude},${c.longitude}`).join("|");
  return (
    `https://staticmap.openstreetmap.de/staticmap.php` +
    `?center=${bb.centerLat},${bb.centerLng}` +
    `&zoom=${zoom}` +
    `&size=${IMG_W}x${IMG_H}` +
    `&maptype=osm` +
    `&path=color:0xC9A84Cff|weight:5|${path}`
  );
}

function normalize(coords: Route["coordinates"]) {
  const bb = getBoundingBox(coords);
  const latRange = bb.maxLat - bb.minLat || 0.001;
  const lngRange = bb.maxLng - bb.minLng || 0.001;
  const drawW = W - PAD * 2;
  const drawH = H - PAD * 2;
  const scale = Math.min(drawW / lngRange, drawH / latRange);
  const offX = (drawW - lngRange * scale) / 2 + PAD;
  const offY = (drawH - latRange * scale) / 2 + PAD;
  return coords.map((c) => ({
    x: (c.longitude - bb.minLng) * scale + offX,
    y: (bb.maxLat - c.latitude) * scale + offY,
  }));
}

type Props = { route: Route; accentColor: string };

function RouteMapPreview({ route, accentColor }: Props) {
  const mapUrl = useMemo(() => buildMapUrl(route.coordinates), [route.id]);
  const pts = useMemo(() => normalize(route.coordinates), [route.id]);
  const pointsStr = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const start = pts[0];
  const end = pts[pts.length - 1];
  const mid = pts.slice(1, -1);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: mapUrl }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={200}
      />
      <View style={styles.overlay} />
      <Svg
        style={StyleSheet.absoluteFill}
        width="100%"
        height={H}
        viewBox={`0 0 ${W} ${H}`}
      >
        <Polyline
          points={pointsStr}
          fill="none"
          stroke={accentColor}
          strokeWidth={10}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.22}
        />
        <Polyline
          points={pointsStr}
          fill="none"
          stroke={accentColor}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {mid.map((p, i) => (
          <React.Fragment key={i}>
            <Circle cx={p.x} cy={p.y} r={5} fill={accentColor} opacity={0.25} />
            <Circle cx={p.x} cy={p.y} r={2.5} fill="#fff" opacity={0.9} />
          </React.Fragment>
        ))}
        <Circle cx={start.x} cy={start.y} r={7} fill={accentColor} opacity={0.3} />
        <Circle cx={start.x} cy={start.y} r={4} fill={accentColor} />
        <Circle cx={start.x} cy={start.y} r={2} fill="#fff" />
        <Circle cx={end.x} cy={end.y} r={7} fill={accentColor} opacity={0.3} />
        <Circle cx={end.x} cy={end.y} r={4} fill={accentColor} />
      </Svg>
    </View>
  );
}

export default memo(RouteMapPreview);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: H,
    overflow: "hidden",
    backgroundColor: "#111827",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
});
