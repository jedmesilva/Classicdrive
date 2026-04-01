import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useBooking } from "@/context/BookingContext";

const DURATION_SUGGESTIONS = [
  { label: "30 min", hours: 0.5 },
  { label: "1h",     hours: 1   },
  { label: "2h",     hours: 2   },
  { label: "3h",     hours: 3   },
  { label: "4h",     hours: 4   },
  { label: "6h",     hours: 6   },
  { label: "8h",     hours: 8   },
  { label: "10h",    hours: 10  },
];

const MIN_MINUTES = 30;
const MAX_MINUTES = 600;

function hoursToDisplay(h: number): string {
  if (!h || h <= 0) return "0 min";
  const totalMin = Math.round(h * 60);
  const hrs  = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (hrs === 0)  return `${mins} min`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}min`;
}

export default function DurationScreen() {
  const colors  = useColors();
  const { duration, setDuration } = useBooking();

  const [minutes, setMinutes] = useState(
    duration ? Math.round(duration.hours * 60) : 60
  );

  function adjust(delta: number) {
    setMinutes((m) => Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, m + delta)));
  }

  function handleSelect(mins: number) {
    setMinutes(mins);
  }

  function handleConfirm() {
    const hours = minutes / 60;
    setDuration({ label: hoursToDisplay(hours), hours });
    router.back();
  }

  const hours       = minutes / 60;
  const displayVal  = hoursToDisplay(hours);
  const pct         = (minutes - MIN_MINUTES) / (MAX_MINUTES - MIN_MINUTES);

  const canDecrement = minutes > MIN_MINUTES;
  const canIncrement = minutes < MAX_MINUTES;

  return (
    <View style={[styles.container, { backgroundColor: colors.sheet }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Por quanto tempo?
        </Text>
        <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
          Mínimo de 30 minutos
        </Text>
      </View>

      {/* Stepper */}
      <View style={styles.stepperSection}>
        <View style={styles.stepperRow}>
          {/* Minus */}
          <TouchableOpacity
            onPress={() => adjust(-30)}
            disabled={!canDecrement}
            activeOpacity={0.7}
            style={[
              styles.stepBtn,
              {
                borderColor: canDecrement ? colors.border : colors.border,
                backgroundColor: canDecrement ? colors.card : colors.muted,
              },
            ]}
          >
            <Text
              style={[
                styles.stepBtnText,
                { color: canDecrement ? colors.foreground : colors.textPlaceholder },
              ]}
            >
              −
            </Text>
          </TouchableOpacity>

          {/* Value */}
          <View style={styles.stepperValue}>
            <Text style={[styles.valueText, { color: colors.foreground }]}>
              {displayVal}
            </Text>
          </View>

          {/* Plus */}
          <TouchableOpacity
            onPress={() => adjust(30)}
            disabled={!canIncrement}
            activeOpacity={0.7}
            style={[
              styles.stepBtn,
              {
                borderColor: canIncrement ? colors.border : colors.border,
                backgroundColor: canIncrement ? colors.card : colors.muted,
              },
            ]}
          >
            <Text
              style={[
                styles.stepBtnText,
                { color: canIncrement ? colors.foreground : colors.textPlaceholder },
              ]}
            >
              +
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        <View style={[styles.progressBg, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${pct * 100}%` as any,
                backgroundColor: colors.gold,
              },
            ]}
          />
        </View>
        <View style={styles.progressLabels}>
          <Text style={[styles.progressLabel, { color: colors.textPlaceholder }]}>30 min</Text>
          <Text style={[styles.progressLabel, { color: colors.textPlaceholder }]}>10h</Text>
        </View>
      </View>

      {/* Shortcuts */}
      <View style={styles.shortcutsSection}>
        <Text style={[styles.shortcutsTitle, { color: colors.textTertiary }]}>
          ATALHOS
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.shortcutsRow}
        >
          {DURATION_SUGGESTIONS.map((s) => {
            const isSel = Math.round(s.hours * 60) === minutes;
            return (
              <TouchableOpacity
                key={s.label}
                onPress={() => handleSelect(Math.round(s.hours * 60))}
                style={[
                  styles.shortcutChip,
                  {
                    borderColor: isSel ? colors.gold : colors.border,
                    backgroundColor: isSel ? `${colors.gold}15` : colors.card,
                  },
                ]}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.shortcutText,
                    { color: isSel ? colors.gold : colors.mutedForeground },
                    isSel && { fontFamily: "Inter_700Bold" },
                  ]}
                >
                  {s.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* CTA */}
      <View style={styles.ctaWrapper}>
        <TouchableOpacity
          onPress={handleConfirm}
          style={[styles.ctaBtn, { backgroundColor: colors.gold }]}
          activeOpacity={0.88}
        >
          <Feather name="check" size={18} color="#fff" />
          <Text style={styles.ctaText}>Confirmar · {displayVal}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    paddingBottom: Platform.OS === "ios" ? 16 : 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 2,
    fontFamily: "Inter_700Bold",
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  stepperSection: {
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  stepBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBtnText: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "300",
    includeFontPadding: false,
  },
  stepperValue: {
    flex: 1,
    alignItems: "center",
  },
  valueText: {
    fontSize: 44,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
    lineHeight: 52,
  },
  progressBg: {
    height: 3,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  progressLabel: {
    fontSize: 10,
  },
  shortcutsSection: {
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  shortcutsTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 10,
    fontFamily: "Inter_700Bold",
  },
  shortcutsRow: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  shortcutChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  shortcutText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  ctaWrapper: { paddingHorizontal: 24 },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 17,
    borderRadius: 16,
  },
  ctaText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.3,
  },
});
