import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Polyline,
  Rect,
  Stop,
} from "react-native-svg";
import type { Route } from "@/context/BookingContext";

const W = 360;
const H = 150;
const PAD = 28;

function normalize(coords: Route["coordinates"]) {
  const lats = coords.map((c) => c.latitude);
  const lngs = coords.map((c) => c.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latRange = maxLat - minLat || 0.001;
  const lngRange = maxLng - minLng || 0.001;

  const drawW = W - PAD * 2;
  const drawH = H - PAD * 2;
  const scale = Math.min(drawW / lngRange, drawH / latRange);
  const offX = (drawW - lngRange * scale) / 2 + PAD;
  const offY = (drawH - latRange * scale) / 2 + PAD;

  return coords.map((c) => ({
    x: (c.longitude - minLng) * scale + offX,
    y: (maxLat - c.latitude) * scale + offY,
  }));
}

type Props = { route: Route; accentColor: string };

function RouteMapPreview({ route, accentColor }: Props) {
  const pts = useMemo(() => normalize(route.coordinates), [route.id]);
  const pointsStr = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const start = pts[0];
  const end = pts[pts.length - 1];
  const mid = pts.slice(1, -1);

  return (
    <View style={styles.container}>
      <Svg
        width="100%"
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <Defs>
          <LinearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#111827" />
            <Stop offset="1" stopColor="#0d1117" />
          </LinearGradient>
        </Defs>

        {/* Background */}
        <Rect width={W} height={H} fill="url(#bg)" />

        {/* Subtle grid */}
        {[0.25, 0.5, 0.75].map((t) => (
          <React.Fragment key={t}>
            <Line
              x1={0}
              y1={H * t}
              x2={W}
              y2={H * t}
              stroke="#ffffff"
              strokeWidth={0.4}
              strokeOpacity={0.06}
            />
            <Line
              x1={W * t}
              y1={0}
              x2={W * t}
              y2={H}
              stroke="#ffffff"
              strokeWidth={0.4}
              strokeOpacity={0.06}
            />
          </React.Fragment>
        ))}

        {/* Glow shadow */}
        <Polyline
          points={pointsStr}
          fill="none"
          stroke={accentColor}
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.18}
        />

        {/* Main route line */}
        <Polyline
          points={pointsStr}
          fill="none"
          stroke={accentColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Intermediate stops */}
        {mid.map((p, i) => (
          <React.Fragment key={i}>
            <Circle cx={p.x} cy={p.y} r={5} fill={accentColor} opacity={0.2} />
            <Circle cx={p.x} cy={p.y} r={2.5} fill="#ffffff" opacity={0.8} />
          </React.Fragment>
        ))}

        {/* Start dot */}
        <Circle cx={start.x} cy={start.y} r={7} fill={accentColor} opacity={0.25} />
        <Circle cx={start.x} cy={start.y} r={4} fill={accentColor} />
        <Circle cx={start.x} cy={start.y} r={2} fill="#fff" />

        {/* End dot */}
        <Circle cx={end.x} cy={end.y} r={7} fill={accentColor} opacity={0.25} />
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
  },
});
