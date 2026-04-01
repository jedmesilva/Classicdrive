import React, { useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useBooking } from "@/context/BookingContext";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function nowTime() {
  const n = new Date();
  return `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
}

function dateFromStr(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(s: string): string {
  if (!s) return "";
  const date = dateFromStr(s);
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

type PickerMode = "date" | "time" | null;

export default function ScheduleScreen() {
  const colors = useColors();
  const { setWhen } = useBooking();
  const today = todayStr();
  const [date, setDate] = useState(today);
  const [time, setTime] = useState(nowTime());
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const currentTime = nowTime();
  const isNow =
    date === today &&
    Math.abs(
      parseInt(time.replace(":", "")) - parseInt(currentTime.replace(":", ""))
    ) <= 5;

  function openDatePicker() {
    setTempDate(dateFromStr(date));
    setPickerMode("date");
  }

  function openTimePicker() {
    const [h, m] = time.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    setTempDate(d);
    setPickerMode("time");
  }

  function handleNow() {
    setDate(today);
    setTime(nowTime());
  }

  function handlePickerChange(event: DateTimePickerEvent, selected?: Date) {
    if (Platform.OS === "android") {
      setPickerMode(null);
      if (event.type === "dismissed" || !selected) return;
    }
    if (!selected) return;
    setTempDate(selected);
    if (Platform.OS === "android") applyPicker(selected);
  }

  function applyPicker(selected?: Date) {
    const d = selected ?? tempDate;
    if (pickerMode === "date") {
      setDate(d.toISOString().split("T")[0]);
    } else {
      setTime(
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
      );
    }
    if (Platform.OS === "ios") setPickerMode(null);
  }

  function cancelPicker() {
    setPickerMode(null);
  }

  function handleConfirm() {
    const display = isNow ? "Agora" : `${formatDate(date)} às ${time}`;
    setWhen(display);
    router.back();
  }

  const dayChips = buildDayChips();

  return (
    <View style={[styles.container, { backgroundColor: colors.sheet }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Para quando?</Text>
        <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
          Escolha dia e horário de retirada
        </Text>
      </View>

      {/* Day chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollRow}
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

      {/* Trigger cards — tap to open native picker */}
      <View style={styles.triggerRow}>
        <TouchableOpacity
          onPress={openDatePicker}
          style={[styles.triggerCard, { backgroundColor: colors.surface, borderColor: `${colors.gold}40` }]}
          activeOpacity={0.75}
        >
          <View style={[styles.triggerIcon, { backgroundColor: `${colors.gold}22` }]}>
            <Feather name="calendar" size={20} color={colors.gold} />
          </View>
          <View style={styles.triggerText}>
            <Text style={[styles.triggerLabel, { color: colors.textTertiary }]}>DIA</Text>
            <Text style={[styles.triggerValue, { color: colors.foreground }]}>
              {isNow ? "Hoje" : formatDate(date)}
            </Text>
          </View>
          <Feather name="chevron-down" size={16} color={colors.textPlaceholder} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={openTimePicker}
          style={[styles.triggerCard, { backgroundColor: colors.surface, borderColor: `${colors.gold}40` }]}
          activeOpacity={0.75}
        >
          <View style={[styles.triggerIcon, { backgroundColor: `${colors.gold}22` }]}>
            <Feather name="clock" size={20} color={colors.gold} />
          </View>
          <View style={styles.triggerText}>
            <Text style={[styles.triggerLabel, { color: colors.textTertiary }]}>HORA</Text>
            <Text style={[styles.triggerValue, { color: colors.foreground }]}>{time}</Text>
          </View>
          <Feather name="chevron-down" size={16} color={colors.textPlaceholder} />
        </TouchableOpacity>
      </View>

      {/* Time slot chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollRow}
        contentContainerStyle={styles.timeSlots}
      >
        {TIME_SLOTS.map((slot) => {
          const sel = time === slot;
          return (
            <TouchableOpacity
              key={slot}
              onPress={() => setTime(slot)}
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

      {/* Confirm banner */}
      <View style={[styles.confirmBanner, { backgroundColor: `${colors.gold}12`, borderColor: `${colors.gold}30` }]}>
        <Text style={[styles.confirmLabel, { color: colors.mutedForeground }]}>
          Confirmando agendamento para
        </Text>
        <Text style={[styles.confirmValue, { color: colors.foreground }]}>
          {isNow ? "Agora mesmo" : `${formatDate(date)} às ${time}`}
        </Text>
      </View>

      {/* CTA */}
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

      {/* Android: renders as dialog, no modal needed */}
      {Platform.OS === "android" && pickerMode !== null && (
        <DateTimePicker
          value={tempDate}
          mode={pickerMode}
          display="default"
          onChange={handlePickerChange}
          minimumDate={pickerMode === "date" ? new Date() : undefined}
          locale="pt-BR"
        />
      )}

      {/* iOS: custom bottom modal with spinner */}
      {Platform.OS === "ios" && (
        <Modal
          visible={pickerMode !== null}
          transparent
          animationType="slide"
          onRequestClose={cancelPicker}
        >
          <TouchableOpacity
            style={styles.pickerBackdrop}
            activeOpacity={1}
            onPress={cancelPicker}
          />
          <View style={[styles.pickerSheet, { backgroundColor: colors.sheet }]}>
            <View style={[styles.pickerHeader, { borderBottomColor: colors.divider }]}>
              <TouchableOpacity onPress={cancelPicker} style={styles.pickerBtn}>
                <Text style={[styles.pickerBtnText, { color: colors.mutedForeground }]}>Cancelar</Text>
              </TouchableOpacity>
              <Text style={[styles.pickerTitle, { color: colors.foreground }]}>
                {pickerMode === "date" ? "Selecionar dia" : "Selecionar hora"}
              </Text>
              <TouchableOpacity onPress={() => applyPicker()} style={styles.pickerBtn}>
                <Text style={[styles.pickerBtnText, { color: colors.gold, fontWeight: "700" }]}>OK</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={tempDate}
              mode={pickerMode ?? "date"}
              display="spinner"
              onChange={handlePickerChange}
              minimumDate={pickerMode === "date" ? new Date() : undefined}
              locale="pt-BR"
              style={styles.picker}
            />
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Platform.OS === "ios" ? 16 : 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
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
  scrollRow: {
    flexGrow: 0,
    flexShrink: 0,
  },
  dayChips: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
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
  triggerRow: {
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
  triggerText: { flex: 1 },
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
    alignItems: "center",
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
  pickerBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  pickerSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  pickerBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  pickerBtnText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  picker: { width: "100%" },
});
