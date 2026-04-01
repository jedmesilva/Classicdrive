import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

const DOT_R = 12;
const LINE_W = 2;
const CARD_GAP = 16;

const TIME_PRESETS = [15, 30, 45, 60, 90, 120];

export function cycleTime(current: number): number {
  const idx = TIME_PRESETS.indexOf(current);
  return TIME_PRESETS[(idx + 1) % TIME_PRESETS.length];
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h${m}`;
}

type Props = {
  index: number;
  total: number;
  address: string;
  minutes: number;
  onPressAddress: () => void;
  onCycleTime: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
};

export default function WaypointCard({
  index, total, address, minutes,
  onPressAddress, onCycleTime, onMoveUp, onMoveDown, onRemove,
}: Props) {
  const colors = useColors();
  const isEmpty = !address;

  return (
    <View style={styles.wrap}>
      {/* Timeline */}
      <View style={styles.timeline}>
        <View style={[styles.dot, { backgroundColor: colors.gold }]} />
        <View
          style={[
            styles.line,
            { borderLeftColor: colors.gold },
          ]}
        />
      </View>

      {/* Content */}
      <View style={[styles.content, { paddingBottom: CARD_GAP }]}>
        {/* Label row */}
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>
            Parada {index + 1}
          </Text>
          <View style={styles.controls}>
            <TouchableOpacity
              onPress={onMoveUp}
              disabled={index === 0}
              hitSlop={8}
              style={[styles.controlBtn, index === 0 && styles.controlBtnDisabled]}
            >
              <Feather name="chevron-up" size={16} color={index === 0 ? colors.textPlaceholder : colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onMoveDown}
              disabled={index === total - 1}
              hitSlop={8}
              style={[styles.controlBtn, index === total - 1 && styles.controlBtnDisabled]}
            >
              <Feather name="chevron-down" size={16} color={index === total - 1 ? colors.textPlaceholder : colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onRemove} hitSlop={8} style={styles.controlBtn}>
              <Feather name="x" size={15} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Address + time card */}
        <View style={[styles.card, { borderColor: isEmpty ? colors.border : `${colors.gold}50`, backgroundColor: colors.card }]}>
          <TouchableOpacity onPress={onPressAddress} style={styles.addressArea} activeOpacity={0.75}>
            <Text
              style={[styles.addressText, { color: isEmpty ? colors.textPlaceholder : colors.foreground }]}
              numberOfLines={1}
            >
              {address || "Selecionar local da parada"}
            </Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity onPress={onCycleTime} style={styles.timeChip} activeOpacity={0.75}>
            <Feather name="clock" size={13} color={colors.gold} />
            <Text style={[styles.timeText, { color: colors.gold }]}>
              {formatMinutes(minutes)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    gap: 12,
  },
  timeline: {
    alignItems: "center",
  },
  dot: {
    width: DOT_R,
    height: DOT_R,
    borderRadius: DOT_R / 2,
    marginTop: 2,
    flexShrink: 0,
  },
  line: {
    flex: 1,
    width: LINE_W,
    marginTop: 5,
    borderLeftWidth: LINE_W,
    borderStyle: "dashed",
  },
  content: {
    flex: 1,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  controlBtn: {
    padding: 4,
    borderRadius: 6,
  },
  controlBtnDisabled: {
    opacity: 0.35,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  addressArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  addressText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  divider: {
    width: 1,
    height: 28,
  },
  timeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  timeText: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
});
