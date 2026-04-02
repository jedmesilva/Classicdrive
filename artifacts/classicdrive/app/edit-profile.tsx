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

type Field = {
  key: string;
  label: string;
  value: string;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words";
};

export default function EditProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Math.max(insets.bottom, 16);

  const [name, setName] = useState("Lucas Mendes");
  const [email, setEmail] = useState("lucas@email.com");
  const [phone, setPhone] = useState("(11) 99999-1234");
  const [cpf, setCpf] = useState("•••.•••.•••-12");

  const fields: (Field & { setter: (v: string) => void; stateValue: string })[] = [
    {
      key: "name",
      label: "Nome completo",
      value: name,
      stateValue: name,
      setter: setName,
      placeholder: "Seu nome completo",
      autoCapitalize: "words",
      keyboardType: "default",
    },
    {
      key: "email",
      label: "E-mail",
      value: email,
      stateValue: email,
      setter: setEmail,
      placeholder: "seu@email.com",
      keyboardType: "email-address",
      autoCapitalize: "none",
    },
    {
      key: "phone",
      label: "Telefone",
      value: phone,
      stateValue: phone,
      setter: setPhone,
      placeholder: "(11) 99999-0000",
      keyboardType: "phone-pad",
      autoCapitalize: "none",
    },
    {
      key: "cpf",
      label: "CPF",
      value: cpf,
      stateValue: cpf,
      setter: setCpf,
      placeholder: "000.000.000-00",
      keyboardType: "default",
      autoCapitalize: "none",
    },
  ];

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
          <Text style={[styles.title, { color: colors.foreground }]}>Editar Perfil</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.saveBtn, { backgroundColor: colors.gold }]}
          onPress={() => router.back()}
        >
          <Text style={styles.saveBtnText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 16 }]}
      >
        {/* Avatar section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatarRing, { borderColor: colors.gold }]}>
              <Image
                source={{ uri: "https://i.pravatar.cc/200?img=11" }}
                style={styles.avatar}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.cameraBadge, { backgroundColor: colors.gold }]}
            >
              <Feather name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.avatarHint, { color: colors.mutedForeground }]}>
            Toque para alterar sua foto
          </Text>
        </View>

        {/* Fields */}
        <Text style={[styles.sectionLabel, { color: colors.textBadge }]}>INFORMAÇÕES PESSOAIS</Text>

        <View style={[styles.fieldsGroup, { backgroundColor: colors.card, borderColor: colors.divider }]}>
          {fields.map((field, index) => {
            const isLast = index === fields.length - 1;
            return (
              <View key={field.key}>
                <View style={styles.fieldRow}>
                  <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
                    {field.label}
                  </Text>
                  <TextInput
                    style={[styles.fieldInput, { color: colors.foreground }]}
                    value={field.stateValue}
                    onChangeText={field.setter}
                    placeholder={field.placeholder}
                    placeholderTextColor={colors.textPlaceholder}
                    keyboardType={field.keyboardType ?? "default"}
                    autoCapitalize={field.autoCapitalize ?? "sentences"}
                    returnKeyType="done"
                  />
                </View>
                {!isLast && (
                  <View style={[styles.fieldDivider, { backgroundColor: colors.divider, marginLeft: 16 }]} />
                )}
              </View>
            );
          })}
        </View>

        {/* Password section */}
        <Text style={[styles.sectionLabel, { color: colors.textBadge }]}>SEGURANÇA</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.securityRow, { backgroundColor: colors.card, borderColor: colors.divider }]}
        >
          <View style={[styles.securityIcon, { backgroundColor: `${colors.gold}14` }]}>
            <Feather name="lock" size={18} color={colors.gold} />
          </View>
          <View style={styles.securityText}>
            <Text style={[styles.securityLabel, { color: colors.foreground }]}>Alterar senha</Text>
            <Text style={[styles.securitySublabel, { color: colors.mutedForeground }]}>
              Última alteração há 3 meses
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.textPlaceholder} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.securityRow, { backgroundColor: colors.card, borderColor: colors.divider }]}
        >
          <View style={[styles.securityIcon, { backgroundColor: `${colors.gold}14` }]}>
            <Feather name="smartphone" size={18} color={colors.gold} />
          </View>
          <View style={styles.securityText}>
            <Text style={[styles.securityLabel, { color: colors.foreground }]}>
              Verificação em dois fatores
            </Text>
            <Text style={[styles.securitySublabel, { color: colors.mutedForeground }]}>
              Não configurado
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.textPlaceholder} />
        </TouchableOpacity>

        {/* Delete account */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.deleteRow, { borderColor: `${colors.destructive ?? "#B71C1C"}30` }]}
        >
          <Feather name="trash-2" size={15} color={colors.destructive ?? "#B71C1C"} />
          <Text style={[styles.deleteText, { color: colors.destructive ?? "#B71C1C" }]}>
            Excluir minha conta
          </Text>
        </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
  },
  saveBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },

  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 12,
  },

  avatarSection: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 10,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2.5,
    padding: 3,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 44,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarHint: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.1,
    fontFamily: "Inter_700Bold",
    marginTop: 8,
    marginBottom: 2,
  },

  fieldsGroup: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  fieldRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  fieldInput: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    padding: 0,
  },
  fieldDivider: {
    height: 1,
  },

  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  securityIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  securityText: {
    flex: 1,
    gap: 2,
  },
  securityLabel: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  securitySublabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },

  deleteRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 8,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
});
