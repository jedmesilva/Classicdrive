import React, { memo, useMemo, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Image } from "expo-image";
import Svg, { Circle, Polyline } from "react-native-svg";
import type { Route } from "@/context/BookingContext";

const CARD_H = 150;
// list has paddingHorizontal:16 on each side
const SIDE_PAD = 32;

// ── Mercator helpers ──────────────────────────────────────────────────────────

function wx(lng: number, z: number): number {
  return ((lng + 180) / 360) * Math.pow(2, z) * 256;
}
function wy(lat: number, z: number): number {
  const r = (lat * Math.PI) / 180;
  return (
    ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) *
    Math.pow(2, z) *
    256
  );
}

/** Pick zoom so the whole route bounding box fits inside ONE tile (×85% margin) */
function pickZoom(coords: Route["coordinates"]): number {
  const lats = coords.map((c) => c.latitude);
  const lngs = coords.map((c) => c.longitude);
  const span = Math.max(
    Math.max(...lats) - Math.min(...lats),
    Math.max(...lngs) - Math.min(...lngs)
  );
  for (let z = 15; z >= 9; z--) {
    if (span < (360 / Math.pow(2, z)) * 0.82) return z;
  }
  return 9;
}

function buildTile(coords: Route["coordinates"]) {
  const lats = coords.map((c) => c.latitude);
  const lngs = coords.map((c) => c.longitude);
  const clat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const clng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
  const z = pickZoom(coords);

  const tx = Math.floor(((clng + 180) / 360) * Math.pow(2, z));
  const cr = (clat * Math.PI) / 180;
  const ty = Math.floor(
    ((1 - Math.log(Math.tan(cr) + 1 / Math.cos(cr)) / Math.PI) / 2) *
      Math.pow(2, z)
  );

  // Carto dark basemap – free, no API key needed
  const url = `https://basemaps.cartocdn.com/dark_all/${z}/${tx}/${ty}@2x.png`;
  return { z, tx, ty, url };
}

/**
 * Project coords onto display space.
 * contentFit="fill" stretches the square tile to W×CARD_H,
 * so x and y are projected independently (no crop, no letterbox).
 *   px = ((worldX - tileOriginX) / 256) * W
 *   py = ((worldY - tileOriginY) / 256) * CARD_H
 */
function projectCoords(
  coords: Route["coordinates"],
  z: number,
  tx: number,
  ty: number,
  W: number
) {
  const ox = tx * 256;
  const oy = ty * 256;
  return coords.map((c) => ({
    x: ((wx(c.longitude, z) - ox) / 256) * W,
    y: ((wy(c.latitude, z) - oy) / 256) * CARD_H,
  }));
}

// ── Component ─────────────────────────────────────────────────────────────────

type Props = { route: Route; accentColor: string };

function RouteMapPreview({ route, accentColor }: Props) {
  const { width: screenW } = useWindowDimensions();
  const W = screenW - SIDE_PAD;

  const { z, tx, ty, url } = useMemo(() => buildTile(route.coordinates), [route.id]);
  const pts = useMemo(
    () => projectCoords(route.coordinates, z, tx, ty, W),
    [route.id, W]
  );

  const [mapReady, setMapReady] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);

  const pStr = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const s = pts[0];
  const e = pts[pts.length - 1];
  const mid = pts.slice(1, -1);

  return (
    <View style={[styles.container, { width: W }]}>
      {/* Carto dark tile – fill stretches the square tile to W×CARD_H */}
      {!mapFailed && (
        <Image
          source={{ uri: url }}
          style={StyleSheet.absoluteFill}
          contentFit="fill"
          cachePolicy="memory-disk"
          transition={300}
          onLoad={() => setMapReady(true)}
          onError={() => setMapFailed(true)}
        />
      )}

      {/* Vignette overlay – lighter once map is visible */}
      <View
        style={[
          styles.vignette,
          mapReady
            ? { backgroundColor: "rgba(0,0,0,0.25)" }
            : { backgroundColor: "rgba(10,14,23,0.94)" },
        ]}
      />

      {/* SVG route – Mercator-projected to align with the tile */}
      <Svg
        style={StyleSheet.absoluteFill}
        viewBox={`0 0 ${W} ${CARD_H}`}
        preserveAspectRatio="none"
      >
        {/* Glow */}
        <Polyline
          points={pStr}
          fill="none"
          stroke={accentColor}
          strokeWidth={10}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.22}
        />
        {/* Route line */}
        <Polyline
          points={pStr}
          fill="none"
          stroke={accentColor}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Mid stops */}
        {mid.map((p, i) => (
          <React.Fragment key={i}>
            <Circle cx={p.x} cy={p.y} r={5} fill={accentColor} opacity={0.25} />
            <Circle cx={p.x} cy={p.y} r={2.5} fill="#fff" opacity={0.9} />
          </React.Fragment>
        ))}
        {/* Start */}
        <Circle cx={s.x} cy={s.y} r={9} fill={accentColor} opacity={0.2} />
        <Circle cx={s.x} cy={s.y} r={5} fill={accentColor} />
        <Circle cx={s.x} cy={s.y} r={2.5} fill="#fff" />
        {/* End */}
        <Circle cx={e.x} cy={e.y} r={9} fill={accentColor} opacity={0.2} />
        <Circle cx={e.x} cy={e.y} r={5} fill={accentColor} />
      </Svg>
    </View>
  );
}

export default memo(RouteMapPreview);

const styles = StyleSheet.create({
  container: {
    height: CARD_H,
    overflow: "hidden",
    backgroundColor: "#0a0e17",
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
  },
});
