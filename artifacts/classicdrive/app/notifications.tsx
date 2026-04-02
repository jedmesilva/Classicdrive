import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

type NotificationItem = {
  id: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: "booking" | "promo" | "system";
};

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    icon: "check-circle",
    title: "Reserva confirmada!",
    body: "Seu Ford Mustang 1967 está confirmado para 5 Abr às 09:00.",
    time: "Há 2 horas",
    read: false,
    type: "booking",
  },
  {
    id: "2",
    icon: "star",
    title: "Oferta exclusiva para você",
    body: "20% de desconto no Chevrolet Bel Air este fim de semana. Use o código CLASSIC20.",
    time: "Há 5 horas",
    read: false,
    type: "promo",
  },
  {
    id: "3",
    icon: "clock",
    title: "Lembrete de locação",
    body: "Sua locação do Porsche 356 começa em 1 hora. Prepare-se!",
    time: "Ontem, 13:00",
    read: true,
    type: "booking",
  },
  {
    id: "4",
    icon: "shield",
    title: "Verificação pendente",
    body: "Complete a verificação de identidade para desbloquear todos os veículos.",
    time: "Ontem, 09:30",
    read: true,
    type: "system",
  },
  {
    id: "5",
    icon: "star",
    title: "Avalie sua última locação",
    body: "Como foi a experiência com o Chevrolet Bel Air em 15 Mar? Deixe sua avaliação.",
    time: "28 Mar",
    read: true,
    type: "booking",
  },
  {
    id: "6",
    icon: "info",
    title: "Atualização dos Termos de Uso",
    body: "Atualizamos nossos Termos de Uso e Política de Privacidade. Acesse para conferir.",
    time: "20 Mar",
    read: true,
    type: "system",
  },
];

type PreferenceItem = {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ComponentProps<typeof Feather>["name"];
};

const PREFERENCES: PreferenceItem[] = [
  { id: "bookings",  label: "Reservas e locações",   sublabel: "Confirmações, lembretes e atualizações", icon: "calendar"  },
  { id: "promos",    label: "Ofertas e promoções",    sublabel: "Descontos exclusivos e novidades",       icon: "tag"       },
  { id: "system",    label: "Avisos do sistema",      sublabel: "Segurança, atualizações e suporte",      icon: "bell"      },
  { id: "email",     label: "Notificações por e-mail", sublabel: "Resumos e comunicações por e-mail",     icon: "mail"      },
];

const TYPE_COLOR: Record<NotificationItem["type"], string> = {
  booking: "#1A56DB",
  promo:   "#B45309",
  system:  "#2E7D32",
};

const TYPE_BG: Record<NotificationItem["type"], string> = {
  booking: "#EBF5FF",
  promo:   "#FFF8E1",
  system:  "#E8F5E9",
};

type Tab = "inbox" | "preferences";

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Math.max(insets.bottom, 16);

  const [activeTab, setActiveTab] = useState<Tab>("inbox");
  const [items, setItems] = useState(NOTIFICATIONS);
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    bookings: true,
    promos: true,
    system: true,
    email: false,
  });

  const unreadCount = items.filter((n) => !n.read).length;

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  function togglePref(id: string) {
    setPrefs((prev) => ({ ...prev, [id]: !prev[id] }));
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
          <View style={styles.headerTitleRow}>
            <Text style={[styles.title, { color: colors.foreground }]}>Notificações</Text>
            {unreadCount > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: colors.gold }]}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
        {activeTab === "inbox" && unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead} activeOpacity={0.7}>
            <Text style={[styles.markAllText, { color: colors.gold }]}>Marcar todas</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { borderBottomColor: colors.divider }]}>
        {(["inbox", "preferences"] as Tab[]).map((tab) => {
          const isActive = activeTab === tab;
          const label = tab === "inbox" ? "Caixa de entrada" : "Preferências";
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
              style={styles.tab}
            >
              <Text style={[styles.tabLabel, { color: isActive ? colors.foreground : colors.textTertiary }, isActive && styles.tabLabelActive]}>
                {label}
              </Text>
              <View style={[styles.tabIndicator, { backgroundColor: isActive ? colors.gold : "transparent", width: isActive ? 20 : 0 }]} />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Inbox ── */}
      {activeTab === "inbox" && (
        <ScrollView
          style={styles.listScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.listContent, { paddingBottom: bottomPad + 16 }]}
        >
          {items.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="bell-off" size={44} color={colors.textTertiary} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Tudo em dia!</Text>
              <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
                Você não tem nenhuma notificação no momento.
              </Text>
            </View>
          ) : (
            items.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => markRead(item.id)}
                activeOpacity={0.8}
                style={[
                  styles.notifCard,
                  {
                    backgroundColor: item.read ? colors.card : `${colors.gold}06`,
                    borderColor: item.read ? colors.divider : `${colors.gold}30`,
                  },
                ]}
              >
                {/* Icon */}
                <View style={[styles.notifIcon, { backgroundColor: TYPE_BG[item.type] }]}>
                  <Feather name={item.icon} size={18} color={TYPE_COLOR[item.type]} />
                </View>

                {/* Content */}
                <View style={styles.notifContent}>
                  <View style={styles.notifTitleRow}>
                    <Text
                      style={[
                        styles.notifTitle,
                        { color: colors.foreground },
                        !item.read && styles.notifTitleUnread,
                      ]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    {!item.read && (
                      <View style={[styles.unreadDot, { backgroundColor: colors.gold }]} />
                    )}
                  </View>
                  <Text style={[styles.notifBody, { color: colors.mutedForeground }]} numberOfLines={2}>
                    {item.body}
                  </Text>
                  <Text style={[styles.notifTime, { color: colors.textTertiary }]}>{item.time}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      {/* ── Preferences ── */}
      {activeTab === "preferences" && (
        <ScrollView
          style={styles.listScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.listContent, { paddingBottom: bottomPad + 16 }]}
        >
          <Text style={[styles.sectionLabel, { color: colors.textBadge }]}>
            TIPOS DE NOTIFICAÇÃO
          </Text>

          <View style={[styles.prefsGroup, { backgroundColor: colors.card, borderColor: colors.divider }]}>
            {PREFERENCES.map((pref, index) => {
              const isLast = index === PREFERENCES.length - 1;
              return (
                <View key={pref.id}>
                  <View style={styles.prefRow}>
                    <View style={[styles.prefIcon, { backgroundColor: `${colors.gold}14` }]}>
                      <Feather name={pref.icon} size={18} color={colors.gold} />
                    </View>
                    <View style={styles.prefText}>
                      <Text style={[styles.prefLabel, { color: colors.foreground }]}>{pref.label}</Text>
                      <Text style={[styles.prefSublabel, { color: colors.mutedForeground }]}>{pref.sublabel}</Text>
                    </View>
                    <Switch
                      value={prefs[pref.id] ?? false}
                      onValueChange={() => togglePref(pref.id)}
                      trackColor={{ false: colors.border, true: `${colors.gold}60` }}
                      thumbColor={prefs[pref.id] ? colors.gold : colors.surface}
                    />
                  </View>
                  {!isLast && (
                    <View style={[styles.prefDivider, { backgroundColor: colors.divider, marginLeft: 66 }]} />
                  )}
                </View>
              );
            })}
          </View>

          <View style={[styles.infoBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Feather name="info" size={14} color={colors.textTertiary} />
            <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
              Você pode desativar as notificações a qualquer momento. Algumas notificações de segurança não podem ser desativadas.
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

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
  headerText: { flex: 1 },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  unreadBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  markAllText: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },

  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 0,
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    paddingVertical: 12,
  },
  tabLabelActive: {
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  tabIndicator: {
    height: 3,
    borderRadius: 2,
  },

  listScroll: { flex: 1 },
  listContent: {
    padding: 20,
    gap: 10,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
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

  notifCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  notifIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  notifContent: { flex: 1, gap: 3 },
  notifTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  notifTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  notifTitleUnread: {
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  notifBody: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  notifTime: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.1,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  prefsGroup: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  prefRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  prefIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  prefText: { flex: 1, gap: 2 },
  prefLabel: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  prefSublabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  prefDivider: { height: 1 },

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
