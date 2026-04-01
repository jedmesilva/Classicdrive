import React, { useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function nowTimeStr() {
  const n = new Date();
  return `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
}

function formatDate(s: string): string {
  if (!s) return "";
  const [y, m, d] = s.split("-");
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tom = new Date(today);
  tom.setDate(today.getDate() + 1);
  if (date.getTime() === today.getTime()) return "Hoje";
  if (date.getTime() === tom.getTime()) return "Amanhã";
  return date.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTime(s: string): string {
  if (!s) return "";
  const [h, m] = s.split(":");
  return `${h}:${m}`;
}

function buildDayChips() {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const str = d.toISOString().split("T")[0];
    const label =
      i === 0
        ? "Hoje"
        : i === 1
        ? "Amanhã"
        : d.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric" });
    return { str, label };
  });
}

const TIME_SLOTS = [
  "06:00","07:00","08:00","09:00","10:00","11:00",
  "12:00","13:00","14:00","15:00","16:00","17:00",
  "18:00","19:00","20:00","21:00","22:00",
];

type Props = {
  visible: boolean;
  onConfirm: (display: string) => void;
  onClose: () => void;
};

export default function ScheduleSheet({ visible, onConfirm, onClose }: Props) {
  const colors = useColors();
  const today = todayStr();
  const [date, setDate] = useState(today);
  const [time, setTime] = useState(nowTimeStr());

  const currentTime = nowTimeStr();
  const isToday = date === today;
  const isNow =
    isToday &&
    Math.abs(
      parseInt(time.replace(":", "")) -
        parseInt(currentTime.replace(":", ""))
    ) <= 5;

  function handleNow() {
    setDate(today);
    setTime(nowTimeStr());
  }

  function handleConfirm() {
    const display = isNow ? "Agora" : `${formatDate(date)} às ${formatTime(time)}`;
    onConfirm(display);
  }

  const dayChips = buildDayChips();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={[styles.sheet, { backgroundColor: colors.sheet }]}>
        <View style={styles.handleWrapper}>
          <View style={[styles.handle, { backgroundColor: colors.sheetHandle }]} />
        </View>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Para quando?</Text>
          <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
            Escolha dia e horário de retirada
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dayChips}
        >
          <TouchableOpacity
            onPress={handleNow}
            style={[
              styles.chip,
              {
                borderColor: isNow ? colors.gold : colors.border,
                backgroundColor: isNow ? `${colors.gold}18` : colors.card,
              },
            ]}
          >
            <Text style={[styles.chipText, { color: isNow ? colors.gold : colors.mutedForeground }]}>
              Agora
            </Text>
          </TouchableOpacity>
          {dayChips.map((chip) => {
            const sel = !isNow && date === chip.str;
            return (
              <TouchableOpacity
                key={chip.str}
                onPress={() => setDate(chip.str)}
                style={[
                  styles.chip,
                  {
                    borderColor: sel ? colors.gold : colors.border,
                    backgroundColor: sel ? `${colors.gold}18` : colors.card,
                  },
                ]}
              >
                <Text style={[styles.chipText, { color: sel ? colors.gold : colors.mutedForeground }]}>
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.timePickerContainer}>
          <View style={[styles.triggerCard, { backgroundColor: colors.surface, borderColor: date ? `${colors.gold}40` : "transparent" }]}>
            <View style={[styles.triggerIcon, { backgroundColor: date ? `${colors.gold}22` : "#EDEAE4" }]}>
              <Feather name="calendar" size={20} color={date ? colors.gold : colors.textTertiary} />
            </View>
            <View style={styles.triggerText}>
              <Text style={[styles.triggerLabel, { color: colors.textTertiary }]}>DIA</Text>
              <Text style={[styles.triggerValue, { color: colors.foreground }]}>
                {isNow ? "Hoje" : formatDate(date)}
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textPlaceholder} />
          </View>

          <View style={[styles.triggerCard, { backgroundColor: colors.surface, borderColor: time ? `${colors.gold}40` : "transparent" }]}>
            <View style={[styles.triggerIcon, { backgroundColor: time ? `${colors.gold}22` : "#EDEAE4" }]}>
              <Feather name="clock" size={20} color={time ? colors.gold : colors.textTertiary} />
            </View>
            <View style={styles.triggerText}>
              <Text style={[styles.triggerLabel, { color: colors.textTertiary }]}>HORA</Text>
              <Text style={[styles.triggerValue, { color: colors.foreground }]}>
                {formatTime(time)}
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textPlaceholder} />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.timeSlots}
        >
          {TIME_SLOTS.map((slot) => {
            const sel = time === slot;
            return (
              <TouchableOpacity
                key={slot}
                onPress={() => { setTime(slot); }}
                style={[
                  styles.timeSlot,
                  {
                    borderColor: sel ? colors.gold : colors.border,
                    backgroundColor: sel ? `${colors.gold}18` : colors.card,
                  },
                ]}
              >
                <Text style={[styles.timeSlotText, { color: sel ? colors.gold : colors.mutedForeground }]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={[styles.confirmBanner, { backgroundColor: `${colors.gold}12`, borderColor: `${colors.gold}30` }]}>
          <Text style={[styles.confirmLabel, { color: colors.mutedForeground }]}>
            Confirmando agendamento para
          </Text>
          <Text style={[styles.confirmValue, { color: colors.foreground }]}>
            {isNow ? "Agora mesmo" : `${formatDate(date)} às ${formatTime(time)}`}
          </Text>
        </View>

        <View style={styles.ctaWrapper}>
          <TouchableOpacity
            onPress={handleConfirm}
            style={[styles.ctaBtn, { backgroundColor: colors.gold }]}
            activeOpacity={0.88}
          >
            <Feather name="check" size={18} color="#fff" />
            <Text style={styles.ctaText}>Confirmar horário</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.38)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  handleWrapper: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 8,
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
  dayChips: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 8,
    flexDirection: "row",
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  timePickerContainer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  triggerCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
  },
  triggerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  triggerText: {
    flex: 1,
  },
  triggerLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: 2,
    fontFamily: "Inter_600SemiBold",
  },
  triggerValue: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  timeSlots: {
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 16,
  },
  timeSlot: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  confirmBanner: {
    marginHorizontal: 24,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  confirmLabel: {
    fontSize: 13,
    marginBottom: 4,
    fontFamily: "Inter_400Regular",
  },
  confirmValue: {
    fontSize: 17,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
  },
  ctaWrapper: {
    paddingHorizontal: 24,
  },
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
