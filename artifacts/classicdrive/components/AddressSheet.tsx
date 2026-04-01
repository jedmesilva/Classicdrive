import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

const RECENT_ADDRESSES = [
  { id: 1, main: "Rua Havaí, 350", sub: "Centro, Belo Horizonte - MG", icon: "clock" },
  { id: 2, main: "Av. do Contorno, 6000", sub: "Funcionários, Belo Horizonte - MG", icon: "clock" },
  { id: 3, main: "Praça da Liberdade", sub: "Funcionários, Belo Horizonte - MG", icon: "clock" },
  { id: 4, main: "Shopping Diamond Mall", sub: "Gutierrez, Belo Horizonte - MG", icon: "clock" },
  { id: 5, main: "Aeroporto de Confins", sub: "Confins - MG", icon: "clock" },
];

const MOCK_SUGGESTIONS: Record<string, { id: number; main: string; sub: string; icon: string }[]> = {
  r: [
    { id: 10, main: "Rua da Bahia, 1148", sub: "Centro, Belo Horizonte - MG", icon: "pin" },
    { id: 11, main: "Rua Sergipe, 400", sub: "Funcionários, Belo Horizonte - MG", icon: "pin" },
    { id: 12, main: "Rua Curitiba, 832", sub: "Centro, Belo Horizonte - MG", icon: "pin" },
  ],
  av: [
    { id: 13, main: "Av. Afonso Pena, 1500", sub: "Centro, Belo Horizonte - MG", icon: "pin" },
    { id: 14, main: "Av. Getúlio Vargas, 300", sub: "Funcionários, Belo Horizonte - MG", icon: "pin" },
    { id: 15, main: "Av. Raja Gabaglia, 1000", sub: "Gutierrez, Belo Horizonte - MG", icon: "pin" },
  ],
  pr: [
    { id: 16, main: "Praça Sete de Setembro", sub: "Centro, Belo Horizonte - MG", icon: "pin" },
    { id: 17, main: "Praça da Estação", sub: "Centro, Belo Horizonte - MG", icon: "pin" },
  ],
};

function getSuggestions(query: string) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  for (const key of Object.keys(MOCK_SUGGESTIONS)) {
    if (q.startsWith(key)) return MOCK_SUGGESTIONS[key];
  }
  return [
    { id: 99, main: `${query}, 100`, sub: "Belo Horizonte - MG", icon: "pin" },
    { id: 98, main: `${query} - Centro`, sub: "Belo Horizonte - MG", icon: "pin" },
  ];
}

type AddressItem = { id: number; main: string; sub: string; icon: string };

function AddressRow({ item, onSelect }: { item: AddressItem; onSelect: (main: string) => void }) {
  const colors = useColors();
  const isClock = item.icon === "clock";

  return (
    <TouchableOpacity
      onPress={() => onSelect(item.main)}
      style={styles.row}
      activeOpacity={0.75}
    >
      <View
        style={[
          styles.rowIcon,
          {
            backgroundColor: isClock ? colors.muted : `${colors.gold}22`,
          },
        ]}
      >
        <Feather
          name={isClock ? "clock" : "map-pin"}
          size={17}
          color={isClock ? colors.textMuted : colors.gold}
        />
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.rowMain, { color: colors.foreground }]} numberOfLines={1}>
          {item.main}
        </Text>
        <Text style={[styles.rowSub, { color: colors.textMuted }]} numberOfLines={1}>
          {item.sub}
        </Text>
      </View>
      <Feather name="chevron-right" size={16} color={colors.textPlaceholder} />
    </TouchableOpacity>
  );
}

type Props = {
  visible: boolean;
  label: string;
  onSelect: (address: string) => void;
  onClose: () => void;
};

export default function AddressSheet({ visible, label, onSelect, onClose }: Props) {
  const colors = useColors();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [visible]);

  const showSuggestions = query.length >= 2;
  const list = showSuggestions ? getSuggestions(query) : RECENT_ADDRESSES;
  const listLabel = showSuggestions ? "SUGESTÕES" : "RECENTES";

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        pointerEvents="box-none"
      >
        <View style={[styles.sheet, { backgroundColor: colors.sheet }]}>
          <View style={styles.handleWrapper}>
            <View style={[styles.handle, { backgroundColor: colors.sheetHandle }]} />
          </View>

          <View style={styles.searchWrapper}>
            <Text style={[styles.sheetLabel, { color: colors.mutedForeground }]}>{label}</Text>
            <View
              style={[
                styles.searchBox,
                {
                  backgroundColor: colors.bgInput,
                  borderColor: focused ? colors.gold : "transparent",
                },
              ]}
            >
              <Feather name="search" size={18} color={colors.textMuted} />
              <TextInput
                ref={inputRef}
                value={query}
                onChangeText={setQuery}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Buscar endereço..."
                placeholderTextColor={colors.textPlaceholder}
                style={[styles.searchInput, { color: colors.foreground }]}
                returnKeyType="search"
              />
              <TouchableOpacity
                onPress={() => onSelect("Minha localização atual")}
                style={[styles.locationBtn, { borderLeftColor: colors.borderSubtle }]}
              >
                <Feather name="crosshair" size={20} color={colors.gold} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <Text style={[styles.sectionLabel, { color: colors.textBadge }]}>{listLabel}</Text>

          <FlatList
            data={list}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <AddressRow item={item} onSelect={onSelect} />}
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </View>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "88%",
    paddingBottom: 32,
  },
  handleWrapper: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  searchWrapper: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  sheetLabel: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
    fontFamily: "Inter_400Regular",
  },
  locationBtn: {
    paddingLeft: 12,
    paddingVertical: 6,
    borderLeftWidth: 1,
  },
  divider: {
    height: 1,
    marginHorizontal: 24,
    marginBottom: 0,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginHorizontal: 24,
    marginTop: 14,
    marginBottom: 4,
  },
  list: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 13,
    paddingHorizontal: 24,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  rowMain: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  rowSub: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: "Inter_400Regular",
  },
});
