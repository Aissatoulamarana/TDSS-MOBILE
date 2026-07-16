import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BrandColors } from "../constants/theme";
import apiService from "../services/apiService";
import { EmployeePermitHistoryItem } from "../types/index";

interface PermitHistoryScreenProps {
  employeeReference: string;
  onGoBack: () => void;
}

export default function PermitHistoryScreen({
  employeeReference,
  onGoBack,
}: PermitHistoryScreenProps) {
  const [items, setItems] = useState<EmployeePermitHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      try {
        const data =
          await apiService.getEmployeePermitHistory(employeeReference);

        // Normalize response: API may return an array or an object with a `results` array
        const itemsData: EmployeePermitHistoryItem[] = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.results)
            ? (data as any).results
            : [];
        setItems(itemsData);
      } catch (err: any) {
        setError(err.message || "Impossible de charger l'historique");
        setItems([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [employeeReference],
  );

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Anciens permis</Text>
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={BrandColors.orange} />
          <Text style={styles.infoText}>
            Chargement de l&apos;historique...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchHistory()}
          >
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Aucun permis antérieur trouvé</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.slug}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchHistory(true)}
              tintColor={BrandColors.orange}
            />
          }
          renderItem={({ item }) => <PermitItem item={item} />}
        />
      )}
    </SafeAreaView>
  );
}

function PermitItem({ item }: { item: EmployeePermitHistoryItem }) {
  const statusStyle = getStatusStyle(item.status);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardNumber}>
          {formatCardNumber(item.card_number)}
        </Text>
        <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusPillText, { color: statusStyle.color }]}>
            {item.status_display || item.status}
          </Text>
        </View>
      </View>

      <Row label="Type" value={item.type_display || item.type} />
      <Row label="Fonction" value={item.job?.name} />
      <Row label="Entreprise" value={item.company_name} />
      <Row label="Émission" value={formatDate(item.card_issued_at)} />
      <Row label="Expiration" value={formatDate(item.card_expires_at)} />
    </View>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value || "—"}</Text>
    </View>
  );
}

function getStatusStyle(status: string) {
  switch (status) {
    case "validated":
    case "printed":
    case "delivered":
      return { color: "#22C55E", bg: "#F0FDF4" };
    case "processing":
      return { color: "#F59E0B", bg: "#FFFBEB" };
    case "rejected":
      return { color: "#EF4444", bg: "#FEF2F2" };
    default:
      return { color: BrandColors.navy, bg: BrandColors.mist };
  }
}

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
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: BrandColors.navyDark,
  },
  headerSpacer: { width: 60 },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  infoText: { marginTop: 12, color: BrandColors.orange, fontSize: 14 },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  emptyText: { color: "#888", fontSize: 14, textAlign: "center" },
  retryButton: {
    backgroundColor: BrandColors.orange,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  listContent: { padding: 16, gap: 12 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F0F0F5",
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardNumber: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "monospace",
    color: BrandColors.navyDark,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPillText: { fontSize: 11, fontWeight: "700" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  rowLabel: { fontSize: 13, color: "#888", fontWeight: "500" },
  rowValue: {
    fontSize: 13,
    color: BrandColors.navyDark,
    fontWeight: "600",
    textAlign: "right",
    flexShrink: 1,
    marginLeft: 12,
  },
});
