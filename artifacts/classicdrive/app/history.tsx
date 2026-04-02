import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

type Status = "concluida" | "confirmada" | "cancelada";
type Modalidade = "Rota Livre" | "Exposição" | "Rota Pública";

type Solicitacao = {
  id: string;
  veiculo: string;
  modalidade: Modalidade;
  data: string;
  hora: string;
  origem?: string;
  destino?: string;
  local?: string;
  duracao?: string;
  rota?: string;
  valor: string;
  status: Status;
};

const SOLICITACOES: Solicitacao[] = [
  {
    id: "1",
    veiculo: "Ford Mustang 1967",
    modalidade: "Rota Livre",
    data: "28 Mar 2026",
    hora: "14:00",
    origem: "Rua Havaí 350, Centro",
    destino: "Av. Paulista 1000, Bela Vista",
    valor: "R$ 480,00",
    status: "concluida",
  },
  {
    id: "2",
    veiculo: "Chevrolet Bel Air 1957",
    modalidade: "Exposição",
    data: "15 Mar 2026",
    hora: "10:00",
    local: "Centro de Convenções Frei Caneca",
    duracao: "4 horas",
    valor: "R$ 620,00",
    status: "concluida",
  },
  {
    id: "3",
    veiculo: "Ford Mustang 1967",
    modalidade: "Rota Pública",
    data: "5 Abr 2026",
    hora: "09:00",
    origem: "Av. Brigadeiro Faria Lima",
    rota: "Rota Histórica SP",
    valor: "R$ 390,00",
    status: "confirmada",
  },
  {
    id: "4",
    veiculo: "Dodge Charger 1970",
    modalidade: "Rota Livre",
    data: "10 Fev 2026",
    hora: "16:30",
    origem: "Shopping Iguatemi",
    destino: "Hotel Unique",
    valor: "R$ 350,00",
    status: "cancelada",
  },
  {
    id: "5",
    veiculo: "Chevrolet Camaro 1969",
    modalidade: "Exposição",
    data: "22 Jan 2026",
    hora: "08:00",
    local: "Parque Ibirapuera – Pavilhão das Culturas Brasileiras",
    duracao: "6 horas",
    valor: "R$ 780,00",
    status: "concluida",
  },
];

const STATUS_CONFIG: Record<Status, { label: string; bg: string; text: string; icon: React.ComponentProps<typeof Feather>["name"] }> = {
  concluida:  { label: "Concluída",  bg: "#E8F5E9", text: "#2E7D32", icon: "check-circle" },
  confirmada: { label: "Confirmada", bg: "#FFF8E1", text: "#A07800", icon: "clock"        },
  cancelada:  { label: "Cancelada",  bg: "#FDECEA", text: "#B71C1C", icon: "x-circle"     },
};

const MODALITY_ICON: Record<Modalidade, React.ComponentProps<typeof Feather>["name"]> = {
  "Rota Livre":   "navigation",
  "Exposição":    "star",
  "Rota Pública": "map",
};

type FilterTab = "todas" | Status;
const FILTERS: { id: FilterTab; label: string }[] = [
  { id: "todas",     label: "Todas"     },
  { id: "confirmada", label: "Confirmadas" },
  { id: "concluida",  label: "Concluídas"  },
  { id: "cancelada",  label: "Canceladas"  },
];

export default function HistoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Math.max(insets.bottom, 16);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("todas");

  const filtered = activeFilter === "todas"
    ? SOLICITACOES
    : SOLICITACOES.filter(s => s.status === activeFilter);

  function renderDetail(solicitacao: Solicitacao) {
    if (solicitacao.modalidade === "Rota Livre") {
      return (
        <>
          <DetailRow icon="circle" label={solicitacao.origem ?? ""} small />
          <View style={styles.detailLine} />
          <DetailRow icon="map-pin" label={solicitacao.destino ?? ""} small />
        </>
      );
    }
    if (solicitacao.modalidade === "Exposição") {
      return (
        <>
          <DetailRow icon="map-pin" label={solicitacao.local ?? ""} small />
          <DetailRow icon="clock"   label={solicitacao.duracao ?? ""} small />
        </>
      );
    }
    if (solicitacao.modalidade === "Rota Pública") {
      return (
        <>
          <DetailRow icon="circle" label={solicitacao.origem ?? ""} small />
          <DetailRow icon="flag"   label={solicitacao.rota ?? ""} small />
        </>
      );
    }
    return null;
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
          <Text style={[styles.title, { color: colors.foreground }]}>Meu Histórico</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {SOLICITACOES.length} solicitações no total
          </Text>
        </View>
      </View>

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.filterScroll, { borderBottomColor: colors.divider }]}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map(f => {
          const isActive = activeFilter === f.id;
          return (
            <TouchableOpacity
              key={f.id}
              onPress={() => setActiveFilter(f.id)}
              activeOpacity={0.7}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isActive ? colors.gold : colors.surface,
                  borderColor: isActive ? colors.gold : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterLabel,
                  { color: isActive ? "#fff" : colors.mutedForeground },
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPad + 16 }]}
      >
        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="inbox" size={40} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Nenhuma solicitação aqui
            </Text>
          </View>
        )}

        {filtered.map(s => {
          const statusCfg = STATUS_CONFIG[s.status];
          const modalIcon = MODALITY_ICON[s.modalidade];

          return (
            <TouchableOpacity
              key={s.id}
              activeOpacity={0.85}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.divider }]}
            >
              {/* Card header */}
              <View style={styles.cardHeader}>
                <View style={[styles.modalBadge, { backgroundColor: `${colors.gold}14` }]}>
                  <Feather name={modalIcon} size={13} color={colors.gold} />
                  <Text style={[styles.modalLabel, { color: colors.gold }]}>
                    {s.modalidade}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
                  <Feather name={statusCfg.icon} size={11} color={statusCfg.text} />
                  <Text style={[styles.statusLabel, { color: statusCfg.text }]}>
                    {statusCfg.label}
                  </Text>
                </View>
              </View>

              {/* Vehicle */}
              <Text style={[styles.vehicleName, { color: colors.foreground }]}>
                {s.veiculo}
              </Text>

              {/* Date/time */}
              <View style={styles.dateRow}>
                <Feather name="calendar" size={13} color={colors.textTertiary} />
                <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                  {s.data} · {s.hora}
                </Text>
              </View>

              {/* Divider */}
              <View style={[styles.cardDivider, { backgroundColor: colors.divider }]} />

              {/* Detail rows */}
              <View style={styles.detailsBlock}>
                {renderDetail(s)}
              </View>

              {/* Footer */}
              <View style={[styles.cardFooter, { borderTopColor: colors.divider }]}>
                <Text style={[styles.valorLabel, { color: colors.mutedForeground }]}>Valor</Text>
                <Text style={[styles.valorValue, { color: colors.gold }]}>{s.valor}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  small,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  small?: boolean;
}) {
  const colors = useColors();
  return (
    <View style={styles.detailRow}>
      <Feather name={icon} size={small ? 12 : 14} color={colors.textTertiary} />
      <Text
        style={[styles.detailText, { color: colors.textSecondary, fontSize: small ? 13 : 14 }]}
        numberOfLines={1}
      >
        {label}
      </Text>
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

  filterScroll: {
    flexGrow: 0,
    borderBottomWidth: 1,
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    flexDirection: "row",
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },

  listContent: {
    padding: 20,
    gap: 14,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  modalBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },

  vehicleName: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },

  cardDivider: {
    height: 1,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  detailsBlock: {
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  detailLine: {
    width: 1,
    height: 10,
    backgroundColor: "#E0D9D0",
    marginLeft: 6,
  },

  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  valorLabel: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  valorValue: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
});
