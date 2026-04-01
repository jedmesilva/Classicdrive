import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useBooking, PAYMENT_METHODS, type PaymentMethod } from "@/context/BookingContext";

export default function PaymentScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { payment, setPayment } = useBooking();

  function select(pm: PaymentMethod) {
    setPayment(pm);
    router.back();
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.sheet }]}>
      <View style={styles.grabber}>
        <View style={[styles.grabberBar, { backgroundColor: colors.border }]} />
      </View>

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Pagamento</Text>
        <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
          Escolha como deseja pagar
        </Text>
      </View>

      <FlatList
        data={PAYMENT_METHODS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 32 }]}
        renderItem={({ item }) => {
          const isSel = payment.id === item.id;
          return (
            <TouchableOpacity
              style={[
                styles.item,
                {
                  backgroundColor: isSel ? `${colors.gold}10` : colors.card,
                  borderColor: isSel ? colors.gold : colors.border,
                  borderWidth: isSel ? 1.5 : 1,
                },
              ]}
              onPress={() => select(item)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.itemIcon,
                  { backgroundColor: isSel ? `${colors.gold}22` : colors.surface },
                ]}
              >
                <Text style={styles.itemEmoji}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemLabel, { color: colors.foreground }]}>{item.label}</Text>
                <Text style={[styles.itemDetail, { color: colors.textMuted }]}>{item.detail}</Text>
              </View>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor: isSel ? colors.gold : colors.border,
                    backgroundColor: isSel ? colors.gold : "transparent",
                  },
                ]}
              >
                {isSel && <Feather name="check" size={12} color="#fff" />}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, borderRadius: 24 },
  grabber: { alignItems: "center", paddingTop: 12, paddingBottom: 4 },
  grabberBar: { width: 36, height: 4, borderRadius: 2 },

  header: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 20 },
  title: {
    fontSize: 20,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  subtitle: { fontSize: 13 },

  list: { paddingHorizontal: 24, gap: 10 },

  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 14,
    padding: 16,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  itemEmoji: { fontSize: 22 },
  itemLabel: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  itemDetail: { fontSize: 13, marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});
