import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AuthScreen from "../screens/AuthScreen";
import CardDetailsScreen from "../screens/CardDetailsScreen";
import QRScannerScreen from "../screens/QRScannerScreen";
import authService from "../services/authService";
import { Card, User } from "../types/index";

type ScreenState =
  | { type: "loading" }
  | { type: "auth" }
  | { type: "scanner" }
  | { type: "details"; card: Card };

export default function RootNavigator() {
  const [screenState, setScreenState] = useState<ScreenState>({
    type: "loading",
  });
  const [user, setUser] = useState<User | null>(null);

  // Vérifier si l'utilisateur est connecté au démarrage
  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const storedUser = await authService.restoreToken();
      if (storedUser) {
        setUser(storedUser);
        setScreenState({ type: "scanner" });
      } else {
        setScreenState({ type: "auth" });
      }
    } catch {
      setScreenState({ type: "auth" });
    }
  };

  const handleLoginSuccess = (newUser: User) => {
    setUser(newUser);
    setScreenState({ type: "scanner" });
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setScreenState({ type: "auth" });
  };

  const handleCardScanned = (card: Card) => {
    setScreenState({ type: "details", card });
  };

  const handleGoBack = () => {
    setScreenState({ type: "scanner" });
  };

  const handleReturnToScanner = () => {
    setScreenState({ type: "scanner" });
  };

  // Rendu du chargement
  if (screenState.type === "loading") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  // Rendu de l'écran d'authentification
  if (screenState.type === "auth") {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Rendu de l'écran du scanner QR
  if (screenState.type === "scanner") {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        <QRScannerScreen
          onCardScanned={handleCardScanned}
          onGoBack={handleLogout}
        />
      </View>
    );
  }

  // Rendu de l'écran des détails de la carte
  if (screenState.type === "details" && screenState.card) {
    return (
      <CardDetailsScreen
        card={screenState.card}
        onGoBack={handleReturnToScanner}
      />
    );
  }

  return null;
}
