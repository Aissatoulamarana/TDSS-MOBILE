import { LinearGradient } from "expo-linear-gradient";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BrandColors, BrandGradient } from "../constants/theme";
import { User } from "../types/index";

interface Props {
  user: User;
  onScanQR: () => void;
  onSearchPassport: () => void;
  onLogout: () => void;
}

export default function HomeScreen({
  user,
  onScanQR,
  onSearchPassport,
  onLogout,
}: Props) {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Header gradient */}
      <LinearGradient colors={BrandGradient} style={styles.header}>
        <SafeAreaView edges={["top"]}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Bonjour 👋</Text>
              <Text style={styles.userEmail}>{user.email || "Agent TDSS"}</Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Text style={styles.logoutText}>Déconnexion</Text>
            </TouchableOpacity>
          </View>

          {/* Hero */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>
              Vérification{"\n"}des permits de travail
            </Text>
            <Text style={styles.heroSubtitle}>
              Choisissez votre méthode de vérification
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        {/* QR Scanner Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={onScanQR}
          activeOpacity={0.85}
        >
          <View
            style={[styles.cardIconContainer, { backgroundColor: BrandColors.cream }]}
          >
            <Text style={styles.cardIcon}>📷</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Scanner QR Code</Text>
            <Text style={styles.cardDescription}>
              Scannez le QR code sur la carte de l&apos;employé pour une
              vérification instantanée
            </Text>
          </View>
          <View style={[styles.cardArrow, { backgroundColor: BrandColors.orange }]}>
            <Text style={styles.cardArrowText}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Passport Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={onSearchPassport}
          activeOpacity={0.85}
        >
          <View
            style={[styles.cardIconContainer, { backgroundColor: BrandColors.mist }]}
          >
            <Text style={styles.cardIcon}>🪪</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Numéro de Passeport</Text>
            <Text style={styles.cardDescription}>
              Saisissez manuellement le numéro de passeport pour rechercher un
              employé
            </Text>
          </View>
          <View style={[styles.cardArrow, { backgroundColor: BrandColors.navy }]}>
            <Text style={styles.cardArrowText}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Info banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoIcon}>🔒</Text>
          <Text style={styles.infoText}>
            Toutes les vérifications sont sécurisées et tracées
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4F7F8" },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
    paddingTop: 8,
  },
  greeting: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
  },
  userEmail: { fontSize: 16, color: "#fff", fontWeight: "700", marginTop: 2 },
  logoutButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  logoutText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  heroSection: { paddingBottom: 8 },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.75)",
    marginTop: 8,
    fontWeight: "400",
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    gap: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: BrandColors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  cardIcon: { fontSize: 26 },
  cardContent: { flex: 1 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: BrandColors.navyDark,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: "#888",
    lineHeight: 18,
  },
  cardArrow: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cardArrowText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  infoIcon: { fontSize: 18 },
  infoText: { flex: 1, fontSize: 13, color: "#888", lineHeight: 18 },
});
