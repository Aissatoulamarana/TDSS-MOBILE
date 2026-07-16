import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BrandColors, BrandGradient } from "../constants/theme";
import apiService from "../services/apiService";
import { Employee } from "../types/index";

type ScanMode = "qr" | "passport";
const CARD_NUMBER_LENGTH = 16;

interface Props {
  initialMode?: ScanMode;
  onCardScanned: (employee: Employee) => void;
  onGoBack: () => void;
}

const extractCardNumberFromQr = (rawValue: string) => {
  const value = rawValue.trim();
  const formatCardNumber = (cardNumber: string) =>
    cardNumber.trim().slice(0, CARD_NUMBER_LENGTH);

  if (!value) return "";

  try {
    const parsed = JSON.parse(value);
    const cardNumber =
      parsed.card_number ??
      parsed.cardNumber ??
      parsed.numero ??
      parsed.number ??
      parsed.id;

    if (cardNumber !== undefined && cardNumber !== null) {
      return formatCardNumber(String(cardNumber));
    }
  } catch {
    // Le QR n'est pas du JSON, on continue avec les autres formats.
  }

  try {
    const url = new URL(value);
    const cardNumber =
      url.searchParams.get("card_number") ??
      url.searchParams.get("cardNumber") ??
      url.searchParams.get("numero") ??
      url.searchParams.get("number") ??
      url.searchParams.get("id");

    if (cardNumber) return formatCardNumber(cardNumber);
  } catch {
    // Le QR n'est pas une URL valide, on garde la valeur brute.
  }

  const labeledNumber = value.match(
    /(?:card_number|cardNumber|numero|number|id)\s*[:=]\s*([A-Za-z0-9_-]+)/i,
  );

  if (labeledNumber?.[1]) {
    return formatCardNumber(labeledNumber[1]);
  }

  return formatCardNumber(value);
};

export default function QRScannerScreen({
  initialMode = "qr",
  onCardScanned,
  onGoBack,
}: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<ScanMode>(initialMode);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flashMode, setFlashMode] = useState<"on" | "off">("off");
  const [passportNumber, setPassportNumber] = useState("");
  const [scannedCardNumber, setScannedCardNumber] = useState("");

  const handleSearch = async (value: string) => {
    if (!value.trim()) return;
    setLoading(true);
    try {
      const employee = await apiService.getEmployeeByPassport(value.trim());
      onCardScanned(employee);
    } catch (error: any) {
      Alert.alert(
        "Introuvable",
        error.message || "Aucun employé trouvé pour ce numéro de passeport",
        [{ text: "OK" }],
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    const cardNumber = extractCardNumberFromQr(data);

    if (!cardNumber) {
      Alert.alert("Erreur", "Le code QR scanné ne contient aucun numéro.", [
        { text: "Réessayer" },
      ]);
      return;
    }

    setScanned(true);
    setScannedCardNumber(cardNumber);
  };

  const handleConfirmCardNumber = async () => {
    if (!scannedCardNumber) return;

    setLoading(true);
    try {
      const employee =
        await apiService.getEmployeeByCardNumber(scannedCardNumber);
      onCardScanned(employee);
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error.message || "Impossible de valider le code QR",
        [{ text: "Réessayer", onPress: handleScanAgain }],
      );
    } finally {
      setLoading(false);
    }
  };

  const handleScanAgain = () => {
    setScanned(false);
    setScannedCardNumber("");
  };

  // Demande de permission caméra
  if (mode === "qr" && !permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={BrandColors.orange} />
        <Text style={styles.infoText}>Vérification des permissions...</Text>
      </View>
    );
  }

  if (mode === "qr" && !permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <LinearGradient
          colors={BrandGradient}
          style={styles.permissionGradient}
        >
          <View style={styles.permissionContent}>
            <Text style={styles.permissionTitle}>Permission Caméra</Text>
            <Text style={styles.permissionText}>
              Nous avons besoin d&apos;accéder à votre caméra pour scanner les codes
              QR
            </Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestPermission}
            >
              <Text style={styles.permissionButtonText}>Autoriser</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.permissionButton,
                {
                  marginTop: 12,
                  backgroundColor: "transparent",
                  borderWidth: 1,
                  borderColor: "#fff",
                },
              ]}
              onPress={() => setMode("passport")}
            >
              <Text style={[styles.permissionButtonText, { color: "#fff" }]}>
                Saisir un numéro de passeport
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === "qr" ? "Scanner QR" : "Numéro Passeport"}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Toggle mode */}
      <View style={styles.modeToggle}>
        <TouchableOpacity
          style={[styles.modeButton, mode === "qr" && styles.modeButtonActive]}
          onPress={() => {
            setMode("qr");
            handleScanAgain();
          }}
        >
          <Text
            style={[
              styles.modeButtonText,
              mode === "qr" && styles.modeButtonTextActive,
            ]}
          >
            📷 Scanner QR
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeButton,
            mode === "passport" && styles.modeButtonActive,
          ]}
          onPress={() => setMode("passport")}
        >
          <Text
            style={[
              styles.modeButtonText,
              mode === "passport" && styles.modeButtonTextActive,
            ]}
          >
            🪪 Passeport
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenu selon le mode */}
      {mode === "qr" ? (
        <View style={styles.cameraContainer}>
          <CameraView
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            style={StyleSheet.absoluteFillObject}
            enableTorch={flashMode === "on"}
          />
          {/* Overlay positionné en absolu, en dehors de CameraView */}
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerFrame} />
            <Text style={styles.scannerText}>
              Positionner le code QR dans le cadre
            </Text>
          </View>

          {/* Bouton flash */}
          <View style={styles.flashContainer}>
            <TouchableOpacity
              style={[
                styles.flashButton,
                flashMode === "on" && styles.flashButtonActive,
              ]}
              onPress={() => setFlashMode(flashMode === "on" ? "off" : "on")}
            >
              <Text style={styles.flashButtonText}>
                {flashMode === "on" ? "🔦 Flash ON" : "🔦 Flash OFF"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.passportContainer}
        >
          <View style={styles.passportCard}>
            <Text style={styles.passportLabel}>Numéro de passeport</Text>
            <TextInput
              style={styles.passportInput}
              placeholder="Ex: A1234567"
              placeholderTextColor="#aaa"
              value={passportNumber}
              onChangeText={setPassportNumber}
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="search"
              onSubmitEditing={() => handleSearch(passportNumber)}
            />
            <TouchableOpacity
              style={[
                styles.searchButton,
                (!passportNumber.trim() || loading) &&
                  styles.searchButtonDisabled,
              ]}
              onPress={() => handleSearch(passportNumber)}
              disabled={!passportNumber.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.searchButtonText}>Rechercher</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* Loading overlay pour le mode QR */}
      {mode === "qr" && loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={BrandColors.orange} />
          <Text style={styles.loadingText}>Validation en cours...</Text>
        </View>
      )}

      {/* Bouton rescanner */}
      {mode === "qr" && scanned && !loading && (
        <View style={styles.bottomButtons}>
          <Text style={styles.cardNumberLabel}>Numéro de carte scanné</Text>
          <Text style={styles.cardNumberValue}>{scannedCardNumber}</Text>
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleConfirmCardNumber}
            disabled={!scannedCardNumber}
          >
            <Text style={styles.scanButtonText}>Vérifier ce numéro</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={handleScanAgain}
          >
            <Text style={styles.scanAgainButtonText}>Scanner à nouveau</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  infoText: { marginTop: 12, color: BrandColors.orange, fontSize: 14 },
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
  backButton: { padding: 8 },
  backButtonText: { fontSize: 16, fontWeight: "600", color: BrandColors.orange },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#333" },
  headerSpacer: { width: 60 },
  modeToggle: {
    flexDirection: "row",
    margin: 16,
    backgroundColor: "#f0f0f5",
    borderRadius: 12,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  modeButtonActive: { backgroundColor: BrandColors.orange },
  modeButtonText: { fontSize: 14, fontWeight: "600", color: "#666" },
  modeButtonTextActive: { color: "#fff" },
  cameraContainer: { flex: 1, position: "relative", overflow: "hidden" },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  scannerFrame: {
    width: 260,
    height: 260,
    borderWidth: 3,
    borderColor: BrandColors.orange,
    borderRadius: 20,
    backgroundColor: "rgba(233, 120, 26, 0.08)",
  },
  scannerText: {
    marginTop: 20,
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  flashContainer: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  flashButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  flashButtonActive: { backgroundColor: BrandColors.orange },
  flashButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  passportContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  passportCard: {
    backgroundColor: BrandColors.mist,
    borderRadius: 16,
    padding: 24,
    shadowColor: BrandColors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  passportLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  passportInput: {
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
    marginBottom: 16,
    letterSpacing: 1,
  },
  searchButton: {
    backgroundColor: BrandColors.orange,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  searchButtonDisabled: { backgroundColor: "#F7C891" },
  searchButtonText: { fontSize: 16, fontWeight: "700", color: "#fff" },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  bottomButtons: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 12,
    backgroundColor: "#f9f9f9",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  cardNumberLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginBottom: 6,
  },
  cardNumberValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#222",
    textAlign: "center",
    marginBottom: 14,
  },
  verifyButton: {
    backgroundColor: BrandColors.orange,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  scanButtonText: { fontSize: 16, fontWeight: "700", color: "#fff" },
  scanAgainButton: {
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BrandColors.orange,
    backgroundColor: "#fff",
  },
  scanAgainButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: BrandColors.orange,
  },
  permissionContainer: { flex: 1 },
  permissionGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionContent: { alignItems: "center", paddingHorizontal: 24 },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
  },
  permissionText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  permissionButtonText: { fontSize: 16, fontWeight: "700", color: BrandColors.navy },
});
