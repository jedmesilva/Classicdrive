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

type DocType = "rg" | "cnh" | "passport";
type VerificationStatus = "not_started" | "pending" | "verified";

const DOC_OPTIONS: { id: DocType; label: string; sublabel: string; icon: React.ComponentProps<typeof Feather>["name"] }[] = [
  { id: "rg",       label: "RG",             sublabel: "Registro Geral",           icon: "credit-card" },
  { id: "cnh",      label: "CNH",            sublabel: "Carteira Nacional de Habilitação", icon: "truck"        },
  { id: "passport", label: "Passaporte",     sublabel: "Documento internacional",  icon: "book-open"   },
];

type StepId = "doc_type" | "doc_front" | "doc_back" | "selfie" | "review";

const STEPS: { id: StepId; label: string }[] = [
  { id: "doc_type",  label: "Documento"  },
  { id: "doc_front", label: "Frente"     },
  { id: "doc_back",  label: "Verso"      },
  { id: "selfie",    label: "Selfie"     },
  { id: "review",    label: "Revisão"    },
];

const STATUS: VerificationStatus = "not_started";

export default function IdentityVerificationScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Math.max(insets.bottom, 16);

  const [docType, setDocType] = useState<DocType | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  const currentStep = STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  function goNext() {
    if (!isLast) setStepIndex((i) => i + 1);
  }

  function goBack() {
    if (!isFirst) setStepIndex((i) => i - 1);
    else router.back();
  }

  const canAdvance =
    currentStep.id === "doc_type" ? docType !== null : true;

  return (
    <View style={[styles.container, { backgroundColor: colors.background ?? colors.sheet }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.divider, paddingTop: topPad + 8 }]}>
        <TouchableOpacity
          onPress={goBack}
          activeOpacity={0.7}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name={isFirst ? "arrow-left" : "chevron-left"} size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.foreground }]}>Verificação de Identidade</Text>
        </View>
      </View>

      {/* Step progress */}
      <View style={[styles.progressBar, { borderBottomColor: colors.divider }]}>
        {STEPS.map((step, i) => {
          const done    = i < stepIndex;
          const active  = i === stepIndex;
          return (
            <View key={step.id} style={styles.progressItem}>
              <View
                style={[
                  styles.stepDot,
                  {
                    backgroundColor: done
                      ? colors.gold
                      : active
                      ? `${colors.gold}30`
                      : colors.surface,
                    borderColor: done || active ? colors.gold : colors.border,
                  },
                ]}
              >
                {done ? (
                  <Feather name="check" size={10} color="#fff" />
                ) : (
                  <Text style={[styles.stepNum, { color: active ? colors.gold : colors.textTertiary }]}>
                    {i + 1}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  { color: active ? colors.foreground : done ? colors.gold : colors.textTertiary },
                  (active || done) && styles.stepLabelActive,
                ]}
              >
                {step.label}
              </Text>
              {i < STEPS.length - 1 && (
                <View style={[styles.stepLine, { backgroundColor: done ? colors.gold : colors.border }]} />
              )}
            </View>
          );
        })}
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad + 100 }]}
      >
        {/* ── Step: Escolha do documento ── */}
        {currentStep.id === "doc_type" && (
          <View style={styles.stepBody}>
            <View style={styles.stepIntro}>
              <View style={[styles.stepIconLarge, { backgroundColor: `${colors.gold}14` }]}>
                <Feather name="shield" size={32} color={colors.gold} />
              </View>
              <Text style={[styles.stepTitle, { color: colors.foreground }]}>
                Escolha o documento
              </Text>
              <Text style={[styles.stepDesc, { color: colors.mutedForeground }]}>
                Selecione o documento oficial que você usará para verificar sua identidade.
              </Text>
            </View>

            <View style={[styles.optionGroup, { backgroundColor: colors.card, borderColor: colors.divider }]}>
              {DOC_OPTIONS.map((doc, i) => {
                const selected = docType === doc.id;
                const isLast = i === DOC_OPTIONS.length - 1;
                return (
                  <View key={doc.id}>
                    <TouchableOpacity
                      onPress={() => setDocType(doc.id)}
                      activeOpacity={0.75}
                      style={[
                        styles.optionRow,
                        selected && { backgroundColor: `${colors.gold}08` },
                      ]}
                    >
                      <View style={[styles.optionIcon, { backgroundColor: selected ? `${colors.gold}18` : colors.surface }]}>
                        <Feather name={doc.icon} size={18} color={selected ? colors.gold : colors.textTertiary} />
                      </View>
                      <View style={styles.optionText}>
                        <Text style={[styles.optionLabel, { color: colors.foreground }]}>{doc.label}</Text>
                        <Text style={[styles.optionSublabel, { color: colors.mutedForeground }]}>{doc.sublabel}</Text>
                      </View>
                      <View
                        style={[
                          styles.radio,
                          {
                            borderColor: selected ? colors.gold : colors.border,
                            backgroundColor: selected ? colors.gold : "transparent",
                          },
                        ]}
                      >
                        {selected && <Feather name="check" size={11} color="#fff" />}
                      </View>
                    </TouchableOpacity>
                    {!isLast && <View style={[styles.optionDivider, { backgroundColor: colors.divider, marginLeft: 66 }]} />}
                  </View>
                );
              })}
            </View>

            <View style={[styles.infoBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Feather name="info" size={14} color={colors.textTertiary} />
              <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
                Seus documentos são processados com segurança e não são armazenados após a verificação.
              </Text>
            </View>
          </View>
        )}

        {/* ── Step: Frente do documento ── */}
        {currentStep.id === "doc_front" && (
          <CaptureStep
            colors={colors}
            icon="credit-card"
            title="Frente do documento"
            desc={`Fotografe a frente do seu ${DOC_OPTIONS.find(d => d.id === docType)?.label ?? "documento"} em um local bem iluminado.`}
            tips={["Documento inteiro visível", "Sem reflexos ou sombras", "Texto legível e nítido"]}
          />
        )}

        {/* ── Step: Verso do documento ── */}
        {currentStep.id === "doc_back" && (
          <CaptureStep
            colors={colors}
            icon="credit-card"
            title="Verso do documento"
            desc={`Agora fotografe o verso do seu ${DOC_OPTIONS.find(d => d.id === docType)?.label ?? "documento"}.`}
            tips={["Mesmo cuidado da frente", "Código de barras visível", "Sem reflexos"]}
          />
        )}

        {/* ── Step: Selfie ── */}
        {currentStep.id === "selfie" && (
          <CaptureStep
            colors={colors}
            icon="camera"
            title="Selfie com documento"
            desc="Segure o documento ao lado do rosto e tire uma foto. Certifique-se de que ambos estejam bem visíveis."
            tips={["Rosto e documento visíveis", "Sem óculos escuros", "Ambiente iluminado"]}
          />
        )}

        {/* ── Step: Revisão ── */}
        {currentStep.id === "review" && (
          <View style={styles.stepBody}>
            <View style={styles.stepIntro}>
              <View style={[styles.stepIconLarge, { backgroundColor: "#E8F5E918" }]}>
                <Feather name="check-circle" size={32} color="#2E7D32" />
              </View>
              <Text style={[styles.stepTitle, { color: colors.foreground }]}>
                Tudo pronto!
              </Text>
              <Text style={[styles.stepDesc, { color: colors.mutedForeground }]}>
                Suas fotos foram capturadas. Revise abaixo e envie para análise — o resultado sai em até 24 horas.
              </Text>
            </View>

            {[
              { label: `Frente do ${DOC_OPTIONS.find(d => d.id === docType)?.label ?? "documento"}`, icon: "credit-card" as const },
              { label: `Verso do ${DOC_OPTIONS.find(d => d.id === docType)?.label ?? "documento"}`, icon: "credit-card" as const },
              { label: "Selfie com documento", icon: "camera" as const },
            ].map((item, i) => (
              <View
                key={i}
                style={[styles.reviewRow, { backgroundColor: colors.card, borderColor: colors.divider }]}
              >
                <View style={[styles.reviewIcon, { backgroundColor: `${colors.gold}14` }]}>
                  <Feather name={item.icon} size={18} color={colors.gold} />
                </View>
                <Text style={[styles.reviewLabel, { color: colors.foreground }]}>{item.label}</Text>
                <Feather name="check-circle" size={18} color="#2E7D32" />
              </View>
            ))}

            <View style={[styles.infoBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Feather name="clock" size={14} color={colors.textTertiary} />
              <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
                A análise leva até 24 horas. Você receberá uma notificação com o resultado.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.footer, { borderTopColor: colors.divider, paddingBottom: bottomPad + 8 }]}>
        <TouchableOpacity
          onPress={isLast ? () => router.back() : goNext}
          activeOpacity={canAdvance ? 0.85 : 1}
          disabled={!canAdvance}
          style={[
            styles.ctaBtn,
            { backgroundColor: canAdvance ? colors.gold : colors.border },
          ]}
        >
          <Text style={[styles.ctaText, { color: canAdvance ? "#fff" : colors.textPlaceholder }]}>
            {isLast ? "Enviar para análise" : "Continuar"}
          </Text>
          {!isLast && <Feather name="arrow-right" size={18} color={canAdvance ? "#fff" : colors.textPlaceholder} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ── Sub-component: capture step ── */
function CaptureStep({
  colors,
  icon,
  title,
  desc,
  tips,
}: {
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  desc: string;
  tips: string[];
}) {
  const [captured, setCaptured] = useState(false);

  return (
    <View style={styles.stepBody}>
      <View style={styles.stepIntro}>
        <View style={[styles.stepIconLarge, { backgroundColor: `${colors.gold}14` }]}>
          <Feather name={icon} size={32} color={colors.gold} />
        </View>
        <Text style={[styles.stepTitle, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.stepDesc, { color: colors.mutedForeground }]}>{desc}</Text>
      </View>

      {/* Capture area */}
      <TouchableOpacity
        onPress={() => setCaptured(true)}
        activeOpacity={0.8}
        style={[
          styles.captureArea,
          {
            borderColor: captured ? colors.gold : colors.border,
            backgroundColor: captured ? `${colors.gold}08` : colors.surface,
          },
        ]}
      >
        {captured ? (
          <View style={styles.capturedContent}>
            <Feather name="check-circle" size={36} color="#2E7D32" />
            <Text style={[styles.capturedText, { color: "#2E7D32" }]}>Foto capturada</Text>
            <Text style={[styles.capturedRetake, { color: colors.mutedForeground }]}>
              Toque para tirar novamente
            </Text>
          </View>
        ) : (
          <View style={styles.capturedContent}>
            <View style={[styles.cameraCircle, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <Feather name="camera" size={28} color={colors.textTertiary} />
            </View>
            <Text style={[styles.capturePrompt, { color: colors.foreground }]}>
              Toque para abrir a câmera
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Tips */}
      <View style={[styles.tipsBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.tipsTitle, { color: colors.foreground }]}>Dicas para uma boa foto</Text>
        {tips.map((tip, i) => (
          <View key={i} style={styles.tipRow}>
            <Feather name="check" size={13} color={colors.gold} />
            <Text style={[styles.tipText, { color: colors.mutedForeground }]}>{tip}</Text>
          </View>
        ))}
      </View>
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
  title: {
    fontSize: 18,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
  },

  progressBar: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  progressItem: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  stepNum: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  stepLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  stepLabelActive: {
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
  },
  stepLine: {
    position: "absolute",
    top: 12,
    left: "62%",
    right: "-62%",
    height: 1.5,
    zIndex: -1,
  },

  scroll: { flex: 1 },
  scrollContent: { padding: 20 },

  stepBody: { gap: 16 },
  stepIntro: { alignItems: "center", gap: 10, paddingVertical: 8 },
  stepIconLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  stepDesc: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 8,
  },

  optionGroup: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  optionText: { flex: 1, gap: 2 },
  optionLabel: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  optionSublabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  optionDivider: { height: 1 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },

  captureArea: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 18,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  capturedContent: { alignItems: "center", gap: 10 },
  cameraCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  capturePrompt: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  capturedText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  capturedRetake: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },

  tipsBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tipText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },

  reviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  reviewIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  reviewLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
});
