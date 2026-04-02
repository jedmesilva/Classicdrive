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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { PAYMENT_METHODS, type PaymentMethod } from "@/context/BookingContext";

const BRAND_ICON: Record<string, React.ComponentProps<typeof Feather>["name"]> = {
  cc1: "credit-card",
  cc2: "credit-card",
  pix: "zap",
};

const BRAND_COLOR: Record<string, string> = {
  cc1: "#EB5757",
  cc2: "#1A56DB",
  pix: "#32BCAD",
};

export default function PaymentMethodsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Math.max(insets.bottom, 16);

  const [defaultId, setDefaultId] = useState<string>(PAYMENT_METHODS[0].id);
  const [methods, setMethods] = useState<PaymentMethod[]>(PAYMENT_METHODS);

  function removeMethod(id: string) {
    const remaining = methods.filter((m) => m.id !== id);
    setMethods(remaining);
    if (defaultId === id && remaining.length > 0) {
      setDefaultId(remaining[0].id);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background ?? colors.sheet }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.divider, paddingTop: topPad + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.foreground }]}>Métodos de Pagamento</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {methods.length} {methods.length === 1 ? "método salvo" : "métodos salvos"}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.listScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPad + 16 }]}
      >
        {/* Section title */}
        {methods.length > 0 && (
          <Text style={[styles.sectionLabel, { color: colors.textBadge }]}>SEUS MÉTODOS</Text>
        )}

        {/* Payment method cards */}
        {methods.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="credit-card" size={44} color={colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Nenhum método salvo
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
              Adicione um cartão ou configure seu Pix para pagar suas locações.
            </Text>
          </View>
        ) : (
          <View style={[styles.cardsGroup, { backgroundColor: colors.card, borderColor: colors.divider }]}>
            {methods.map((method, index) => {
              const isDefault = defaultId === method.id;
              const iconName = BRAND_ICON[method.id] ?? "credit-card";
              const iconColor = BRAND_COLOR[method.id] ?? colors.gold;
              const isLast = index === methods.length - 1;

              return (
                <View key={method.id}>
                  <View style={styles.methodRow}>
                    {/* Icon */}
                    <View style={[styles.methodIcon, { backgroundColor: `${iconColor}15` }]}>
                      <Feather name={iconName} size={20} color={iconColor} />
                    </View>

                    {/* Info */}
                    <View style={styles.methodInfo}>
                      <View style={styles.methodNameRow}>
                        <Text style={[styles.methodLabel, { color: colors.foreground }]}>
                          {method.label}
                        </Text>
                        {isDefault && (
                          <View style={[styles.defaultBadge, { backgroundColor: `${colors.gold}18`, borderColor: `${colors.gold}40` }]}>
                            <Text style={[styles.defaultBadgeText, { color: colors.gold }]}>
                              Padrão
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.methodDetail, { color: colors.mutedForeground }]}>
                        {method.detail}
                      </Text>
                    </View>

                    {/* Actions */}
                    <View style={styles.methodActions}>
                      {!isDefault && (
                        <TouchableOpacity
                          onPress={() => setDefaultId(method.id)}
                          activeOpacity={0.7}
                          style={[styles.actionBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
                        >
                          <Text style={[styles.actionBtnText, { color: colors.mutedForeground }]}>
                            Definir
                          </Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        onPress={() => removeMethod(method.id)}
                        activeOpacity={0.7}
                        style={styles.removeBtn}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Feather name="trash-2" size={16} color={colors.destructive ?? "#B71C1C"} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {!isLast && (
                    <View style={[styles.divider, { backgroundColor: colors.divider, marginLeft: 70 }]} />
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Add card button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.addBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
        >
          <View style={[styles.addIcon, { backgroundColor: `${colors.gold}14` }]}>
            <Feather name="plus" size={18} color={colors.gold} />
          </View>
          <View style={styles.addText}>
            <Text style={[styles.addLabel, { color: colors.foreground }]}>Adicionar cartão</Text>
            <Text style={[styles.addSubLabel, { color: colors.mutedForeground }]}>
              Crédito ou débito
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.textPlaceholder} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.addBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
        >
          <View style={[styles.addIcon, { backgroundColor: "#32BCAD18" }]}>
            <Feather name="zap" size={18} color="#32BCAD" />
          </View>
          <View style={styles.addText}>
            <Text style={[styles.addLabel, { color: colors.foreground }]}>Configurar Pix</Text>
            <Text style={[styles.addSubLabel, { color: colors.mutedForeground }]}>
              CPF, e-mail ou telefone
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.textPlaceholder} />
        </TouchableOpacity>

        {/* Info note */}
        <View style={[styles.infoBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Feather name="lock" size={14} color={colors.textTertiary} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            Seus dados de pagamento são criptografados e armazenados com segurança.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    gap: 14,
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },

  listScroll: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    gap: 12,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.1,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },

  cardsGroup: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  methodRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  methodIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  methodInfo: {
    flex: 1,
    gap: 2,
  },
  methodNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  methodLabel: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  defaultBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
    borderWidth: 1,
  },
  defaultBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  methodDetail: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  methodActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  removeBtn: {
    padding: 4,
  },
  divider: {
    height: 1,
  },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  addIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  addText: {
    flex: 1,
    gap: 2,
  },
  addLabel: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  addSubLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },

  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginTop: 4,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
});
