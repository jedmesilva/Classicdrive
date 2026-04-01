import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

const DOT_R = 12;
const LINE_W = 2;
const CARD_GAP = 16;

type Props = {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
  last?: boolean;
};

export default function BookingCard({ label, value, placeholder, onPress, last }: Props) {
  const colors = useColors();
  const isEmpty = !value || value === placeholder;

  return (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: last ? 0 : CARD_GAP,
        }}
      >
        <View
          style={{
            width: DOT_R,
            height: DOT_R,
            borderRadius: DOT_R / 2,
            backgroundColor: colors.gold,
            marginTop: 2,
          }}
        />
        {!last && (
          <View
            style={{
              flex: 1,
              width: LINE_W,
              marginTop: 5,
              backgroundColor: "transparent",
              borderLeftWidth: LINE_W,
              borderLeftColor: colors.gold,
              borderStyle: "dashed",
            }}
          />
        )}
      </View>

      <View style={{ flex: 1, paddingBottom: last ? 0 : CARD_GAP }}>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
        <TouchableOpacity
          onPress={onPress}
          style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}
          activeOpacity={0.85}
        >
          <Text style={[styles.value, { color: isEmpty ? colors.textPlaceholder : colors.foreground }]}>
            {value || placeholder}
          </Text>
          <Feather name="chevron-right" size={18} color={colors.textPlaceholder} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.2,
    marginBottom: 6,
    lineHeight: 16,
  },
  card: {
    borderRadius: 14,
    padding: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  value: {
    fontSize: 17,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
});
