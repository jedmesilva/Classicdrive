import React from "react";
import {
  Image,
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

type MenuItem = {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  sublabel?: string;
  onPress?: () => void;
  danger?: boolean;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 16);

  const sections: MenuSection[] = [
    {
      title: "Atividade",
      items: [
        { icon: "clock", label: "Minhas Viagens", sublabel: "3 viagens realizadas" },
        { icon: "heart", label: "Veículos Favoritos", sublabel: "Mustang, Bel Air" },
      ],
    },
    {
      title: "Conta",
      items: [
        { icon: "credit-card", label: "Métodos de Pagamento", sublabel: "Visa •••• 4242" },
        { icon: "map-pin", label: "Endereços Salvos", sublabel: "2 endereços" },
        { icon: "bell", label: "Notificações" },
      ],
    },
    {
      title: "Suporte",
      items: [
        { icon: "help-circle", label: "Ajuda & Suporte" },
        { icon: "info", label: "Sobre o ClassicDrive", sublabel: "Versão 1.0.0" },
        { icon: "file-text", label: "Termos e Privacidade" },
      ],
    },
    {
      title: "",
      items: [
        { icon: "log-out", label: "Sair da conta", danger: true },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.sheet }]}>
      {/* Profile hero */}
      <View style={[styles.hero, { borderBottomColor: colors.divider }]}>
        <View style={styles.avatarWrapper}>
          <View style={[styles.avatarRing, { borderColor: colors.gold }]}>
            <Image
              source={{ uri: "https://i.pravatar.cc/200?img=11" }}
              style={styles.avatar}
            />
          </View>
          <TouchableOpacity
            style={[styles.editBadge, { backgroundColor: colors.gold }]}
          >
            <Feather name="camera" size={12} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroInfo}>
          <Text style={[styles.heroName, { color: colors.foreground }]}>Lucas Mendes</Text>
          <Text style={[styles.heroEmail, { color: colors.mutedForeground }]}>
            lucas@email.com
          </Text>
          <View style={[styles.heroBadge, { backgroundColor: `${colors.gold}18`, borderColor: `${colors.gold}40` }]}>
            <Feather name="star" size={11} color={colors.gold} />
            <Text style={[styles.heroBadgeText, { color: colors.gold }]}>Membro Gold</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.editBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
        >
          <Feather name="edit-2" size={15} color={colors.mutedForeground} />
          <Text style={[styles.editBtnText, { color: colors.mutedForeground }]}>Editar</Text>
        </TouchableOpacity>
      </View>

      {/* Stat row */}
      <View style={[styles.statRow, { borderBottomColor: colors.divider }]}>
        {[
          { value: "3", label: "Viagens" },
          { value: "2", label: "Favoritos" },
          { value: "4.9★", label: "Avaliação" },
        ].map((s, i) => (
          <View key={i} style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Menu */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: bottomPad + 16 }}
      >
        {sections.map((section, si) => (
          <View key={si} style={styles.section}>
            {section.title ? (
              <Text style={[styles.sectionTitle, { color: colors.textBadge }]}>
                {section.title.toUpperCase()}
              </Text>
            ) : null}
            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.divider }]}>
              {section.items.map((item, ii) => (
                <React.Fragment key={ii}>
                  {ii > 0 && (
                    <View style={[styles.itemDivider, { backgroundColor: colors.divider }]} />
                  )}
                  <TouchableOpacity
                    onPress={item.onPress ?? (() => {})}
                    style={styles.menuItem}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.menuIcon,
                        {
                          backgroundColor: item.danger
                            ? `${colors.destructive}12`
                            : `${colors.gold}14`,
                        },
                      ]}
                    >
                      <Feather
                        name={item.icon}
                        size={18}
                        color={item.danger ? colors.destructive : colors.gold}
                      />
                    </View>
                    <View style={styles.menuText}>
                      <Text
                        style={[
                          styles.menuLabel,
                          { color: item.danger ? colors.destructive : colors.foreground },
                        ]}
                      >
                        {item.label}
                      </Text>
                      {item.sublabel ? (
                        <Text style={[styles.menuSublabel, { color: colors.mutedForeground }]}>
                          {item.sublabel}
                        </Text>
                      ) : null}
                    </View>
                    {!item.danger && (
                      <Feather name="chevron-right" size={16} color={colors.textPlaceholder} />
                    )}
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  avatarWrapper: {
    position: "relative",
    flexShrink: 0,
  },
  avatarRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    padding: 2,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 32,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  heroInfo: {
    flex: 1,
    gap: 2,
  },
  heroName: {
    fontSize: 18,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
  },
  heroEmail: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    flexShrink: 0,
  },
  editBtnText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  statRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  menuText: { flex: 1, gap: 2 },
  menuLabel: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  menuSublabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  itemDivider: {
    height: 1,
    marginLeft: 68,
  },
});
