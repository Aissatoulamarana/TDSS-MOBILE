import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card } from "../types/index";

interface CardDetailsScreenProps {
  card: Card;
  onGoBack: () => void;
}

export default function CardDetailsScreen({
  card,
  onGoBack,
}: CardDetailsScreenProps) {
  const [statusColor, setStatusColor] = useState("#4CAF50");
  const [statusLabel, setStatusLabel] = useState("Valide");
  const animatedScale = new Animated.Value(0);

  useEffect(() => {
    // Déterminer la couleur et le label selon le statut
    switch (card.status) {
      case "valid":
        setStatusColor("#4CAF50");
        setStatusLabel("Valide");
        break;
      case "expired":
        setStatusColor("#FF9800");
        setStatusLabel("Expiré");
        break;
      case "invalid":
        setStatusColor("#F44336");
        setStatusLabel("Invalide");
        break;
      case "revoked":
        setStatusColor("#9C27B0");
        setStatusLabel("Révoquée");
        break;
    }

    // Animation d'entrée
    Animated.spring(animatedScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [card.status]);

  const isValid = card.status === "valid";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails de la Carte</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <Animated.View
          style={[
            styles.statusCard,
            {
              transform: [
                {
                  scale: animatedScale,
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={[statusColor, statusColor + "CC"]}
            style={styles.statusGradient}
          >
            <View style={styles.statusIcon}>
              <Text style={styles.statusIconText}>{isValid ? "✓" : "✕"}</Text>
            </View>
            <Text style={styles.statusText}>{statusLabel}</Text>
            <Text style={styles.statusDescription}>
              {isValid ? "Carte authentifiée" : "Carte non authentifiée"}
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Card Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informations de la Carte</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Type de Carte</Text>
              <Text style={styles.infoValue}>{card.cardType}</Text>
            </View>

            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>Numéro de Carte</Text>
              <Text style={styles.infoValue}>
                •••• •••• •••• {card.cardNumber.slice(-4)}
              </Text>
            </View>

            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>Titulaire</Text>
              <Text style={styles.infoValue}>{card.holderName}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID Carte</Text>
              <Text style={[styles.infoValue, styles.codeValue]}>
                {card.id.slice(0, 20)}...
              </Text>
            </View>
          </View>
        </View>

        {/* Validity Dates */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Validité</Text>

          <View style={styles.datesContainer}>
            <View style={[styles.dateBox, styles.issueDateBox]}>
              <Text style={styles.dateLabel}>Date d'Émission</Text>
              <Text style={styles.dateValue}>{formatDate(card.issueDate)}</Text>
            </View>

            <View style={[styles.dateBox, styles.expiryDateBox]}>
              <Text style={styles.dateLabel}>Date d'Expiration</Text>
              <Text
                style={[styles.dateValue, !isValid && styles.dateValueExpired]}
              >
                {formatDate(card.expiryDate)}
              </Text>
            </View>
          </View>
        </View>

        {/* Authenticity Badge */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Authentification</Text>

          <View style={[styles.infoCard, { paddingVertical: 20 }]}>
            <View style={styles.authenticityBadge}>
              <Text style={styles.badgeIcon}>🛡️</Text>
              <View style={styles.badgeContent}>
                <Text style={styles.badgeTitle}>
                  {isValid ? "Carte Authentifiée" : "Carte Non Vérifiée"}
                </Text>
                <Text style={styles.badgeDescription}>
                  {isValid
                    ? "Cette carte a été vérifiée par nos systèmes de sécurité"
                    : "Cette carte n'a pas pu être vérifiée"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              isValid ? styles.approveButton : styles.rejectButton,
            ]}
          >
            <Text style={styles.actionButtonText}>
              {isValid ? "✓ Accepter" : "✕ Refuser"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>📋 Rapport</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
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
  },
  dateValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  dateValueExpired: {
    color: "#F44336",
  },
  authenticityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  badgeIcon: {
    fontSize: 40,
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
