import PermitHistoryScreen from "@/screens/PermitHistoryScreen";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { BrandColors } from "../constants/theme";
import AuthScreen from "../screens/AuthScreen";
import CardDetailsScreen from "../screens/CardDetailsScreen";
import HomeScreen from "../screens/HomeScreen";
import QRScannerScreen from "../screens/QRScannerScreen";
import authService from "../services/authService";
import { Employee, User } from "../types/index";

type ScreenState =
  | { type: "loading" }
  | { type: "auth" }
  | { type: "home" }
  | { type: "scanner"; mode: "qr" | "passport" }
  | { type: "details"; employee: Employee };

export default function RootNavigator() {
  const [screenState, setScreenState] = useState<ScreenState>({
    type: "loading",
  });
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<"details" | "history">("details");

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const storedUser = await authService.restoreToken();
      if (storedUser) {
        setUser(storedUser);
        setScreenState({ type: "home" });
      } else {
        setScreenState({ type: "auth" });
      }
    } catch {
      setScreenState({ type: "auth" });
    }
  };

  const handleLoginSuccess = (newUser: User) => {
    setUser(newUser);
    setScreenState({ type: "home" });
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setScreenState({ type: "auth" });
  };

  const handleEmployeeFound = (employee: Employee) => {
    setScreenState({ type: "details", employee });
  };

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
        <ActivityIndicator size="large" color={BrandColors.orange} />
      </View>
    );
  }

  if (screenState.type === "auth") {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  if (screenState.type === "home" && user) {
    return (
      <HomeScreen
        user={user}
        onScanQR={() => setScreenState({ type: "scanner", mode: "qr" })}
        onSearchPassport={() =>
          setScreenState({ type: "scanner", mode: "passport" })
        }
        onLogout={handleLogout}
      />
    );
  }

  if (screenState.type === "scanner") {
    return (
      <QRScannerScreen
        initialMode={screenState.mode}
        onCardScanned={handleEmployeeFound}
        onGoBack={() => setScreenState({ type: "home" })}
      />
    );
  }

  if (screenState.type === "details") {
    if (view === "history") {
      return (
        <PermitHistoryScreen
          employeeReference={screenState.employee.employee_reference}
          onGoBack={() => setView("details")}
        />
      );
    }

    return (
      <CardDetailsScreen
        employee={screenState.employee}
        onGoBack={() => setScreenState({ type: "home" })}
        onViewHistory={() => setView("history")}
      />
    );
  }

  return null;
}
