import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import apiService from "../services/apiService";
import { Card } from "../types/index";

export default function QRScannerScreen({ onCardScanned, onGoBack }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flashMode, setFlashMode] = useState("off");

  useEffect(() => {
    requestPermission();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;

    setScanned(true);
    setLoading(true);

    try {
      // Appeler le service pour valider le QR code
      const card: Card = await apiService.validateQRCode(data);

      // Passer à l'écran des détails de la carte
      onCardScanned(card);
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error.message || "Impossible de valider le code QR",
        [
          {
            text: "Réessayer",
            onPress: () => setScanned(false),
          },
        ],
      );
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Demande de permission pour la caméra...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.permissionGradient}
        >
          <View style={styles.permissionContent}>
            <Text style={styles.permissionTitle}>Permission Caméra</Text>
            <Text style={styles.permissionText}>
              Nous avons besoin d'accéder à votre caméra pour scanner les codes
              QR
            </Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestPermission}
            >
              <Text style={styles.permissionButtonText}>Autoriser</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scanner QR</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          style={styles.camera}
          enableTorch={flashMode === "on"}
        >
          {/* Overlay du scanner */}
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerFrame} />
            <Text style={styles.scannerText}>Positionner le code QR</Text>
          </View>
        </CameraView>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            flashMode === "on" && styles.controlButtonActive,
          ]}
          onPress={() => setFlashMode(flashMode === "on" ? "off" : "on")}
        >
          <Text style={styles.controlButtonIcon}>🔦</Text>
          <Text style={styles.controlButtonText}>
            {flashMode === "on" ? "Flash ON" : "Flash OFF"}
          </Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Validation du code QR...</Text>
        </View>
      )}

      {scanned && !loading && (
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.scanButtonText}>Scanner à nouveau</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
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
  cameraContainer: {
    flex: 1,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scannerOverlay: {
    alignItems: "center",
    justifyContent: "center",
  },
  scannerFrame: {
    width: 280,
    height: 280,
    borderWidth: 3,
    borderColor: "#667eea",
    borderRadius: 20,
    backgroundColor: "rgba(102, 126, 234, 0.05)",
  },
  scannerText: {
    marginTop: 20,
    fontSize: 16,
    color: "#667eea",
    fontWeight: "600",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 12,
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  controlButtonActive: {
    backgroundColor: "#667eea",
  },
  controlButtonIcon: {
    fontSize: 18,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  scanButton: {
    backgroundColor: "#667eea",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  permissionContainer: {
    flex: 1,
  },
  permissionGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionContent: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
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
  permissionButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#667eea",
  },
});
