import React, { useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useBooking } from "@/context/BookingContext";
import { formatMinutes } from "@/components/WaypointCard";
import { VEHICLES } from "@/components/VehicleCarousel";

const DOT_R = 12;
const LINE_W = 2;

function parseRouteDurationHours(s: string): number {
  const match = s.match(/(\d+)h(\d+)?/);
  if (!match) return 2;
  const h = parseInt(match[1]);
  const m = match[2] ? parseInt(match[2]) : 0;
  return h + m / 60;
}

type ConfirmRowProps = {
  label: string;
  value: string;
  onEdit: () => void;
  last?: boolean;
};

function ConfirmRow({ label, value, onEdit, last }: ConfirmRowProps) {
  const colors = useColors();
  return (
    <View style={styles.rowWrap}>
      <View style={styles.rowTimeline}>
        <View style={[styles.dot, { backgroundColor: colors.gold }]} />
        {!last && (
          <View
            style={[
              styles.line,
              {
                backgroundImage: undefined,
                borderLeftWidth: LINE_W,
                borderLeftColor: colors.gold,
                borderStyle: "dashed",
              },
            ]}
          />
        )}
      </View>
      <View style={[styles.rowContent, last ? {} : { paddingBottom: 16 }]}>
        <Text style={[styles.rowLabel, { color: colors.mutedForeground }]}>{label}</Text>
        <View style={[styles.rowCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={[styles.rowValue, { color: colors.foreground }]} numberOfLines={1}>
            {value}
          </Text>
          <TouchableOpacity onPress={onEdit} hitSlop={8} style={styles.editBtn}>
            <Feather name="edit-2" size={15} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function ConfirmScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    modality, when, from, to, location, duration, route, waypoints,
    activeVehicleIndex, payment,
  } = useBooking();

  const [note, setNote] = useState("");
  const [noteFocused, setNoteFocused] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const vehicle = VEHICLES[activeVehicleIndex] ?? VEHICLES[0];

  let hours = 2;
  if (modality === "exposicao" && duration) {
    hours = duration.hours;
  } else if (modality === "rota" && route) {
    hours = parseRouteDurationHours(route.duration);
  } else if (modality === "rotalivre") {
    const stopMins   = waypoints.reduce((s, w) => s + w.minutes, 0);
    const travelMins = (waypoints.length + 1) * 15;
    hours = Math.max(1, (stopMins + travelMins) / 60);
  }
  const hoursDisplay = Number.isInteger(hours) ? `${hours}h` : `${Math.round(hours * 10) / 10}h`;
  const total = Math.round(vehicle.priceNum * hours);

  const modalityMeta: Record<string, { label: string; icon: string }> = {
    rotalivre: { label: "Rota Livre",         icon: "navigation" },
    exposicao: { label: "Exposição",          icon: "star"       },
    rota:      { label: "Rota da Comunidade", icon: "map"        },
  };
  const meta = modalityMeta[modality];

  const rows: { label: string; value: string }[] = [];
  if (when) rows.push({ label: "Quando", value: when });

  if (modality === "rotalivre") {
    if (from) rows.push({ label: "De onde", value: from });
    waypoints.forEach((wp, i) => {
      if (wp.address) rows.push({ label: `Parada ${i + 1} · ${formatMinutes(wp.minutes)}`, value: wp.address });
    });
    if (to) rows.push({ label: "Para onde", value: to });
  }

  if (modality === "exposicao") {
    if (location) rows.push({ label: "Local da exposição", value: location });
    if (duration) rows.push({ label: "Duração",            value: duration.label });
  }

  if (modality === "rota") {
    if (from)  rows.push({ label: "De onde",   value: from });
    if (route) rows.push({ label: "Rota",      value: route.name });
    if (to)    rows.push({ label: "Para onde", value: to });
  }

  const topPad    = Platform.OS === "web" ? 52 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  if (confirmed) {
    return (
      <View style={[styles.successContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.successIcon, { borderColor: colors.gold, backgroundColor: `${colors.gold}18` }]}>
          <Feather name="check" size={36} color={colors.gold} />
        </View>
        <Text style={[styles.successTitle, { color: colors.foreground }]}>Pedido confirmado!</Text>
        <Text style={[styles.successSub, { color: colors.textMuted }]}>
          Seu {vehicle.name} está reservado.
        </Text>
        <Text style={[styles.successDetail, { color: colors.textTertiary }]}>
          {meta.label} · {when}
        </Text>
        <TouchableOpacity
          style={[styles.successCta, { backgroundColor: colors.gold }]}
          onPress={() => router.replace("/")}
          activeOpacity={0.88}
        >
          <Text style={styles.successCtaText}>Voltar ao início</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: bottomPad + 120 }}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: topPad + 8 }]}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Feather name="chevron-left" size={22} color={colors.foreground} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerSub, { color: colors.textMuted }]}>Revise seu pedido</Text>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>Confirmar contratação</Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* Modality badge */}
          <View style={[styles.badge, { backgroundColor: `${colors.gold}18`, borderColor: `${colors.gold}50` }]}>
            <Feather name={meta.icon as any} size={14} color={colors.goldDark} />
            <Text style={[styles.badgeText, { color: colors.goldDark }]}>{meta.label}</Text>
          </View>

          {/* Vehicle card */}
          <View style={[styles.vehicleCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <View style={styles.vehicleImageWrap}>
              <Image source={vehicle.image} style={styles.vehicleImage} resizeMode="cover" />
              <View style={styles.vehicleImageFade} />
            </View>
            <View style={styles.vehicleInfo}>
              <View style={[styles.vehicleTag, { backgroundColor: colors.gold }]}>
                <Text style={styles.vehicleTagText}>{vehicle.tag}</Text>
              </View>
              <Text style={[styles.vehicleYear, { color: colors.textMuted }]}>{vehicle.year}</Text>
              <Text style={[styles.vehicleName, { color: colors.foreground }]}>{vehicle.name}</Text>
              <View style={{ flexDirection: "row", alignItems: "baseline", gap: 3 }}>
                <Text style={[styles.vehiclePrice, { color: colors.gold }]}>{vehicle.price}</Text>
                <Text style={[styles.vehiclePriceSub, { color: colors.textMuted }]}>/hora</Text>
              </View>
            </View>
          </View>

          {/* Details */}
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Detalhes</Text>
          <View style={styles.rowsContainer}>
            {rows.map((row, i) => (
              <ConfirmRow
                key={row.label}
                label={row.label}
                value={row.value}
                onEdit={() => router.back()}
                last={i === rows.length - 1}
              />
            ))}
          </View>

          {/* Price estimate */}
          <View style={[styles.priceBox, { backgroundColor: `${colors.gold}10`, borderColor: `${colors.gold}30` }]}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted, marginBottom: 14 }]}>
              Estimativa de valor
            </Text>
            <View style={styles.priceRow}>
              <Text style={[styles.priceRowLabel, { color: colors.mutedForeground }]}>
                {modality === "exposicao" ? "Duração" : modality === "rota" ? "Duração da rota" : "Duração estimada"}
              </Text>
              <Text style={[styles.priceRowValue, { color: colors.foreground }]}>~{hoursDisplay}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={[styles.priceRowLabel, { color: colors.mutedForeground }]}>Valor por hora</Text>
              <Text style={[styles.priceRowValue, { color: colors.foreground }]}>{vehicle.price}</Text>
            </View>
            <View style={[styles.priceDivider, { backgroundColor: `${colors.gold}35` }]} />
            <View style={styles.priceTotalRow}>
              <Text style={[styles.priceTotalLabel, { color: colors.foreground }]}>
                {modality === "exposicao" ? "Total" : "Total estimado"}
              </Text>
              <Text style={[styles.priceTotalValue, { color: colors.gold }]}>R${total}</Text>
            </View>
            <Text style={[styles.priceNote, { color: colors.textMuted }]}>
              {modality === "exposicao"
                ? "Valor fixo pela duração contratada"
                : "Cobrado por hora efetivamente utilizada"}
            </Text>
          </View>

          {/* Payment */}
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Pagamento</Text>
          <TouchableOpacity
            style={[styles.paymentRow, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push("/payment")}
            activeOpacity={0.8}
          >
            <View style={[styles.paymentIcon, { backgroundColor: `${colors.gold}18` }]}>
              <Text style={styles.paymentEmoji}>{payment.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.paymentLabel, { color: colors.foreground }]}>{payment.label}</Text>
              <Text style={[styles.paymentDetail, { color: colors.textMuted }]}>{payment.detail}</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Notes */}
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
            Observações{" "}
            <Text style={[styles.sectionLabelOpt, { color: colors.textTertiary }]}>(opcional)</Text>
          </Text>
          <View
            style={[
              styles.notesBox,
              {
                backgroundColor: colors.card,
                borderColor: noteFocused ? colors.gold : colors.border,
                borderWidth: noteFocused ? 1.5 : 1,
              },
            ]}
          >
            <TextInput
              value={note}
              onChangeText={setNote}
              onFocus={() => setNoteFocused(true)}
              onBlur={() => setNoteFocused(false)}
              placeholder="Ex: Por favor, aguarde na entrada principal..."
              placeholderTextColor={colors.textPlaceholder}
              multiline
              numberOfLines={3}
              style={[styles.notesInput, { color: colors.foreground }]}
            />
          </View>
        </View>
      </ScrollView>

      {/* Fixed bottom CTA */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: bottomPad + 16, backgroundColor: colors.background },
        ]}
      >
        <TouchableOpacity
          style={[styles.ctaBtn, { backgroundColor: colors.gold }]}
          onPress={() => setConfirmed(true)}
          activeOpacity={0.88}
        >
          <Text style={styles.ctaBtnText}>Confirmar e contratar</Text>
          <Text style={styles.ctaBtnPrice}>R${total}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  headerSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
    lineHeight: 28,
  },

  body: { paddingHorizontal: 24 },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 7,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },

  vehicleCard: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 28,
  },
  vehicleImageWrap: {
    width: 110,
    height: 120,
  },
  vehicleImage: {
    width: "100%",
    height: "100%",
  },
  vehicleImageFade: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: 32,
  },
  vehicleInfo: {
    flex: 1,
    padding: 14,
    paddingLeft: 12,
    justifyContent: "center",
  },
  vehicleTag: {
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 7,
  },
  vehicleTagText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  vehicleYear: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 1,
  },
  vehicleName: {
    fontSize: 17,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
    lineHeight: 22,
    marginBottom: 5,
  },
  vehiclePrice: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  vehiclePriceSub: { fontSize: 12 },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  sectionLabelOpt: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "Inter_400Regular",
    letterSpacing: 0,
    textTransform: "none",
  },

  rowsContainer: { marginBottom: 28 },
  rowWrap: { flexDirection: "row", gap: 12 },
  rowTimeline: { alignItems: "center" },
  dot: {
    width: DOT_R,
    height: DOT_R,
    borderRadius: DOT_R / 2,
    marginTop: 2,
    flexShrink: 0,
  },
  line: {
    flex: 1,
    marginTop: 5,
    marginBottom: 5,
  },
  rowContent: { flex: 1 },
  rowLabel: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
    marginBottom: 6,
  },
  rowCard: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowValue: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
    flex: 1,
    paddingRight: 8,
  },
  editBtn: { padding: 4 },

  priceBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 28,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceRowLabel: { fontSize: 14 },
  priceRowValue: { fontSize: 14, fontWeight: "700", fontFamily: "Inter_700Bold" },
  priceDivider: { height: 1, marginBottom: 10, marginTop: 2 },
  priceTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  priceTotalLabel: { fontSize: 15, fontWeight: "700", fontFamily: "Inter_700Bold" },
  priceTotalValue: { fontSize: 26, fontWeight: "800", fontFamily: "Inter_700Bold" },
  priceNote: { fontSize: 12 },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 28,
  },
  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  paymentEmoji: { fontSize: 22 },
  paymentLabel: { fontSize: 15, fontWeight: "700", fontFamily: "Inter_700Bold" },
  paymentDetail: { fontSize: 13, marginTop: 2 },

  notesBox: {
    borderRadius: 14,
    padding: 14,
  },
  notesInput: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    minHeight: 72,
    textAlignVertical: "top",
  },

  bottomBar: {
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 0,
  },
  ctaBtn: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ctaBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.3,
  },
  ctaBtnPrice: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
  },

  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: 8,
  },
  successSub: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 4,
  },
  successDetail: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 40,
  },
  successCta: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
  },
  successCtaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
});
