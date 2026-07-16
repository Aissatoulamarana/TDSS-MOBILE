import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BrandColors, BrandGradient } from "../constants/theme";
import { Employee } from "../types/index";

interface CardDetailsScreenProps {
  employee: Employee;
  onGoBack: () => void;
  onViewHistory: (employeeReference: string) => void;
}

export default function CardDetailsScreen({
  employee,
  onGoBack,
  onViewHistory,
}: CardDetailsScreenProps) {
  const animatedY = useRef(new Animated.Value(30)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  const employeeName = [employee.first, employee.last]
    .filter(Boolean)
    .join(" ");

  const isValid = ["validated", "printed", "delivered"].includes(
    employee.status,
  );

  const status = useMemo(() => {
    switch (employee.status) {
      case "validated":
      case "printed":
      case "delivered":
        return {
          color: "#22C55E",
          bg: "#F0FDF4",
          border: "#BBF7D0",
          label: employee.status_display || "Valide",
          icon: "✓",
        };
      case "processing":
        return {
          color: "#F59E0B",
          bg: "#FFFBEB",
          border: "#FDE68A",
          label: employee.status_display || "En traitement",
          icon: "⏳",
        };
      case "rejected":
        return {
          color: "#EF4444",
          bg: "#FEF2F2",
          border: "#FECACA",
          label: employee.status_display || "Rejetée",
          icon: "✕",
        };
      default:
        return {
          color: BrandColors.navy,
          bg: BrandColors.mist,
          border: "#C9DCE2",
          label: employee.status_display || employee.status || "Inconnu",
          icon: "?",
        };
    }
  }, [employee.status, employee.status_display]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [animatedY, animatedOpacity]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero — photo + identité */}
        <Animated.View
          style={[
            styles.heroCard,
            {
              opacity: animatedOpacity,
              transform: [{ translateY: animatedY }],
            },
          ]}
        >
          <LinearGradient
            colors={BrandGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            {/* Photo */}
            <View style={styles.avatarWrapper}>
              {employee.picture ? (
                <Image
                  source={{ uri: employee.picture }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitials}>
                    {[employee.first?.[0], employee.last?.[0]]
                      .filter(Boolean)
                      .join("")
                      .toUpperCase() || "?"}
                  </Text>
                </View>
              )}

              {/* Badge statut superposé */}
              <View
                style={[styles.statusBadge, { backgroundColor: status.color }]}
              >
                <Text style={styles.statusBadgeText}>{status.icon}</Text>
              </View>
            </View>

            {/* Nom & infos rapides */}
            <Text style={styles.heroName}>{employeeName || "—"}</Text>
            <Text style={styles.heroJob}>{employee.job?.name || "—"}</Text>

            <View style={styles.heroMeta}>
              <View style={styles.heroMetaItem}>
                <Text style={styles.heroMetaLabel}>Passeport</Text>
                <Text style={styles.heroMetaValue}>
                  {employee.passport_number || "—"}
                </Text>
              </View>
              <View style={styles.heroMetaSep} />
              <View style={styles.heroMetaItem}>
                <Text style={styles.heroMetaLabel}>Nationalité</Text>
                <Text style={styles.heroMetaValue}>
                  {employee.nationality || "—"}
                </Text>
              </View>
              <View style={styles.heroMetaSep} />
              <View style={styles.heroMetaItem}>
                <Text style={styles.heroMetaLabel}>Sexe</Text>
                <Text style={styles.heroMetaValue}>
                  {employee.sexe_display || employee.sexe || "—"}
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* Bandeau statut sous le gradient */}
          {/* <View
            style={[
              styles.statusStrip,
              { backgroundColor: status.bg, borderColor: status.border },
            ]}
          >
            <Text style={[styles.statusStripText, { color: status.color }]}>
              {status.label}
            </Text>
          </View> */}
        </Animated.View>

        {/* Carte */}
        <Section title="Carte">
          <Row
            label="Numéro"
            value={formatCardNumber(employee.card_number)}
            mono
          />
          <Row label="Type" value={employee.type_display || employee.type} />
          <Row
            label="Référence"
            value={employee.reference || employee.slug}
            mono
          />
          <Row label="Déclaration" value={employee.declaration_number} />
        </Section>

        {/* Validité */}
        <Section title="Validité">
          <View style={styles.datesRow}>
            <DateBox
              label="Émission"
              value={formatDate(employee.card_issued_at)}
              accent={BrandColors.orange}
              bg={BrandColors.cream}
            />
            <DateBox
              label="Expiration"
              value={formatDate(employee.card_expires_at)}
              accent={isValid ? "#22C55E" : "#EF4444"}
              bg={isValid ? "#F0FDF4" : "#FEF2F2"}
            />
          </View>
        </Section>

        {/* Employeur */}
        <Section title="Employeur">
          <Row label="Entreprise" value={employee.company_name} />
          <Row label="Sigle" value={employee.company_sigle} />
          <Row label="Adresse" value={employee.company_address} />
        </Section>

        {/* Contrat */}
        <Section title="Contrat">
          <Row label="Début" value={formatDate(employee.contract_starts_at)} />
          <Row
            label="Durée"
            value={
              employee.contract_duration
                ? `${employee.contract_duration} mois`
                : undefined
            }
          />
        </Section>

        {/* Anciens Permits */}
        {/* <Section title="Anciens Permits"> */}
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => onViewHistory(employee.employee_reference)}
        >
          <Text style={styles.historyButtonText}>Voir les anciens permis</Text>
          <Text style={styles.historyButtonArrow}>→</Text>
        </TouchableOpacity>
        {/* </Section> */}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── Sous-composants ─── */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, mono && styles.rowValueMono]}>
        {value || "—"}
      </Text>
    </View>
  );
}

function DateBox({
  label,
  value,
  accent,
  bg,
}: {
  label: string;
  value: string;
  accent: string;
  bg: string;
}) {
  return (
    <View
      style={[styles.dateBox, { backgroundColor: bg, borderColor: accent }]}
    >
      <Text style={[styles.dateBoxLabel, { color: accent }]}>{label}</Text>
      <Text style={styles.dateBoxValue}>{value}</Text>
    </View>
  );
}

/* ─── Helpers ─── */

function formatCardNumber(cardNumber: string): string {
  if (!cardNumber) return "—";
  return cardNumber.replace(/(.{4})/g, "$1 ").trim();
}

function formatDate(dateString: string): string {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

/* ─── Styles ─── */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F7F8" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F5",
  },
  backButton: { padding: 8 },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: BrandColors.orange,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: BrandColors.navyDark },
  headerSpacer: { width: 60 },

  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  /* Hero */
  heroCard: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: BrandColors.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    backgroundColor: "#fff",
  },
  heroGradient: {
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: "center",
    paddingHorizontal: 20,
  },

  avatarWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.6)",
  },
  avatarFallback: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
  },
  statusBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },

  heroName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 4,
  },
  heroJob: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    marginBottom: 20,
  },

  heroMeta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
  },
  heroMetaItem: { flex: 1, alignItems: "center" },
  heroMetaLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  heroMetaValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  heroMetaSep: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  statusStrip: {
    paddingVertical: 10,
    alignItems: "center",
    borderTopWidth: 1,
  },
  statusStripText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  /* Sections */
  section: { marginHorizontal: 16, marginBottom: 20 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F5",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5FA",
  },
  rowLabel: { fontSize: 14, color: "#888", fontWeight: "500", flex: 1 },
  rowValue: {
    fontSize: 14,
    color: BrandColors.navyDark,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  rowValueMono: { fontFamily: "monospace", fontSize: 12 },

  /* Dates */
  datesRow: { flexDirection: "row", gap: 12 },
  dateBox: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  dateBoxLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  dateBoxValue: {
    fontSize: 14,
    fontWeight: "700",
    color: BrandColors.navyDark,
    textAlign: "center",
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginTop: 4,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BrandColors.orange,
    backgroundColor: "#fff",
    gap: 8,
  },
  historyButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: BrandColors.orange,
  },
  historyButtonArrow: {
    fontSize: 16,
    fontWeight: "700",
    color: BrandColors.orange,
  },
});
