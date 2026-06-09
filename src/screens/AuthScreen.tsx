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
import authService from "../services/authService";

export default function AuthScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      const user = await authService.login(email, password);
      Alert.alert("Succès", `Bienvenue ${user.fullName}!`);
      onLoginSuccess(user);
    } catch (error: any) {
      Alert.alert(
        "Erreur de connexion",
        error.message || "Identifiants invalides",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.gradient}>
        <View style={styles.content}>
          {/* En-tête */}
          <View style={styles.header}>
            <Text style={styles.appName}>TDSS Declaration</Text>
            <Text style={styles.subtitle}>Vérification de Cartes</Text>
          </View>

          {/* Formulaire */}
          <View style={styles.form}>
            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="votre@email.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mot de passe</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="••••••••"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <Text style={styles.eyeIcon}>
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Boutton Login */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                loading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Se Connecter</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2026 TDSS - Tous droits réservés
            </Text>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  header: {
    marginTop: "15%",
    marginBottom: 40,
    alignItems: "center",
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  form: {
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 0,
    margin: 0,
  },
  eyeIcon: {
    fontSize: 20,
  },
  loginButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#667eea",
    letterSpacing: 0.5,
  },
  footer: {
    marginBottom: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
  },
});
