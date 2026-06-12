import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Employee } from "../types/index";

interface CardDetailsScreenProps {
  employee: Employee;
  onGoBack: () => void;
}

export default function CardDetailsScreen({
  employee,
  onGoBack,
}: CardDetailsScreenProps) {
  const animatedScale = useRef(new Animated.Value(0)).current;
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
          color: "#4CAF50",
          label: employee.status_display || "Valide",
          description: "Carte authentifiée",
        };
      case "processing":
        return {
          color: "#FF9800",
          label: employee.status_display || "En traitement",
          description: "Carte en cours de validation",
        };
      case "rejected":
        return {
          color: "#F44336",
          label: employee.status_display || "Rejetée",
          description: "Carte non authentifiée",
        };
      default:
        return {
          color: "#667eea",
          label: employee.status_display || employee.status || "Statut inconnu",
          description: "Statut reçu du backend",
        };
    }
  }, [employee.status, employee.status_display]);

  useEffect(() => {
    Animated.spring(animatedScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [animatedScale]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails de la carte</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.statusCard,
            {
              transform: [{ scale: animatedScale }],
            },
          ]}
        >
          <LinearGradient
            colors={[status.color, `${status.color}CC`]}
            style={styles.statusGradient}
          >
            <View style={styles.statusIcon}>
              <Text style={styles.statusIconText}>{isValid ? "✓" : "✕"}</Text>
            </View>
            <Text style={styles.statusText}>{status.label}</Text>
            <Text style={styles.statusDescription}>{status.description}</Text>
          </LinearGradient>
        </Animated.View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informations de la carte</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Type de déclaration</Text>
              <Text style={styles.infoValue}>
                {employee.type_display || employee.type || "-"}
              </Text>
            </View>

            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>Numéro de carte</Text>
              <Text style={styles.infoValue}>
                {formatCardNumber(employee.card_number)}
              </Text>
            </View>

            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>Titulaire</Text>
              <Text style={styles.infoValue}>{employeeName || "-"}</Text>
            </View>

            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>Passeport</Text>
              <Text style={styles.infoValue}>
                {employee.passport_number || "-"}
              </Text>
            </View>

            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>Fonction</Text>
              <Text style={styles.infoValue}>{employee.job?.name || "-"}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Référence</Text>
              <Text style={[styles.infoValue, styles.codeValue]}>
                {employee.reference || employee.slug || "-"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Employeur</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Entreprise</Text>
              <Text style={styles.infoValue}>
                {employee.company_name || "-"}
              </Text>
            </View>

            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>Sigle</Text>
              <Text style={styles.infoValue}>
                {employee.company_sigle || "-"}
              </Text>
            </View>

            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>Déclaration</Text>
              <Text style={styles.infoValue}>
                {employee.declaration_number || "-"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Validité</Text>

          <View style={styles.datesContainer}>
            <View style={[styles.dateBox, styles.issueDateBox]}>
              <Text style={styles.dateLabel}>{"Date d'émission"}</Text>
              <Text style={styles.dateValue}>
                {formatDate(employee.card_issued_at)}
              </Text>
            </View>

            <View style={[styles.dateBox, styles.expiryDateBox]}>
              <Text style={styles.dateLabel}>{"Date d'expiration"}</Text>
              <Text
                style={[styles.dateValue, !isValid && styles.dateValueExpired]}
              >
                {formatDate(employee.card_expires_at)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Contrat</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Début</Text>
              <Text style={styles.infoValue}>
                {formatDate(employee.contract_starts_at)}
              </Text>
            </View>

            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>Durée</Text>
              <Text style={styles.infoValue}>
                {formatContractDuration(employee.contract_duration)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Authentification</Text>

          <View style={[styles.infoCard, styles.authCard]}>
            <View style={styles.authenticityBadge}>
              <Text style={styles.badgeIcon}>{isValid ? "✓" : "!"}</Text>
              <View style={styles.badgeContent}>
                <Text style={styles.badgeTitle}>
                  {isValid ? "Carte authentifiée" : "Carte non vérifiée"}
                </Text>
                <Text style={styles.badgeDescription}>
                  {isValid
                    ? "Cette carte a été vérifiée par le système."
                    : "Cette carte n'a pas encore un statut validé."}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionsSection}>
          {/* <TouchableOpacity
            style={[
              styles.actionButton,
              isValid ? styles.approveButton : styles.rejectButton,
            ]}
          >
            <Text style={styles.actionButtonText}>
              {isValid ? "Accepter" : "Refuser"}
            </Text>
          </TouchableOpacity> */}

          {/* <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Rapport</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatCardNumber(cardNumber: string): string {
  if (!cardNumber) return "-";

  return cardNumber.replace(/(.{4})/g, "$1 ").trim();
}

function formatContractDuration(duration: number): string {
  if (!duration) return "-";

  return `${duration} mois`;
}

function formatDate(dateString: string): string {
  if (!dateString) return "-";

  try {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#667eea",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 30,
  },
  statusCard: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  statusGradient: {
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  statusIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statusIconText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  statusText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  infoRowBorder: {
    borderTopWidth: 1,
    borderTopColor: "#e8e8e8",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    textAlign: "right",
  },
  codeValue: {
    fontSize: 12,
    fontFamily: "monospace",
  },
  datesContainer: {
    flexDirection: "row",
    gap: 12,
  },
  dateBox: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  issueDateBox: {
    backgroundColor: "#e8f5e9",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  expiryDateBox: {
    backgroundColor: "#fff3e0",
    borderWidth: 1,
    borderColor: "#FF9800",
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  dateValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  dateValueExpired: {
    color: "#F44336",
  },
  authCard: {
    paddingVertical: 20,
  },
  authenticityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 16,
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#667eea",
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 40,
  },
  badgeContent: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  actionsSection: {
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  approveButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  secondaryButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#667eea",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#667eea",
  },
});
