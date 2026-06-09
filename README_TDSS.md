# 📱 TDSS-MOBILE - Application de Vérification de Cartes

Application mobile React Native/Expo pour la numérisation et la vérification des codes QR des cartes TDSS avec UI/UX moderne 2026.

## 🎯 Fonctionnalités

✅ **Authentification sécurisée** - Connexion avec email/mot de passe  
✅ **Scanner QR** - Scan du code QR sur les cartes  
✅ **Vérification de validité** - Affichage du statut de la carte (Valide/Expiré/Invalide)  
✅ **UI/UX Moderne** - Design gradients et animations fluides  
✅ **Stockage sécurisé** - Token sauvegardé de manière sécurisée

## 🚀 Installation

### Prérequis

- **Node.js** v18+
- **npm** v9+
- **Expo CLI** (optionnel)

### Étapes d'installation

```bash
# 1. Cloner ou naviguer dans le projet
cd TDSS-MOBILE

# 2. Installer les dépendances (si npm install n'est pas terminé)
npm install

# 3. Installer les packages supplémentaires nécessaires
npm install expo-camera expo-linear-gradient expo-secure-store

# 4. Configurer le backend
# Éditer le fichier .env.local avec l'URL de votre API
EXPO_PUBLIC_API_URL=http://votre-backend.com/api
```

## 📋 Configuration de l'API

Assurez-vous que votre backend TDSS-Declaration expose les endpoints suivants:

### Authentification

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Réponse:
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "fullName": "Nom Complet",
    "token": "jwt-token"
  }
}
```

### Vérification du Code QR

```
POST /api/cards/validate
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "qrCode": "QR_CODE_DATA"
}

Réponse:
{
  "id": "card-id",
  "cardNumber": "1234567890123456",
  "holderName": "Titulaire Carte",
  "expiryDate": "2025-12-31",
  "issueDate": "2023-01-01",
  "status": "valid",
  "cardType": "Carte Identité"
}
```

## 🎨 Structure du Projet

```
TDSS-MOBILE/
├── src/
│   ├── screens/
│   │   ├── AuthScreen.tsx         # Écran de connexion
│   │   ├── QRScannerScreen.tsx    # Scanner QR
│   │   └── CardDetailsScreen.tsx  # Détails de validité
│   ├── services/
│   │   ├── apiService.ts          # Client API
│   │   └── authService.ts         # Gestion authentification
│   ├── types/
│   │   └── index.ts               # TypeScript interfaces
│   ├── navigation/
│   │   └── RootNavigator.tsx      # Navigation principale
│   └── app.json                   # Configuration Expo
├── App.tsx                        # Point d'entrée
├── package.json
└── .env.local                     # Variables d'environnement
```

## 🏃 Démarrage

### Pour développement

```bash
# Web (si disponible)
npm run web

# Android
npm run android

# iOS (Mac uniquement)
npm run ios

# Expo CLI (développement)
npm start
```

### Pour production

```bash
# Build APK (Android)
eas build --platform android

# Build IPA (iOS)
eas build --platform ios
```

## 🔐 Sécurité

- Les tokens d'authentification sont stockés de manière sécurisée avec `expo-secure-store`
- Les communications utilisent HTTPS en production
- Les données sensibles ne sont pas loggées
- Les permissions de caméra sont demandées explicitement à l'utilisateur

## 📦 Dépendances Principales

- **react-native**: Framework mobile
- **expo**: Outils de développement React Native
- **expo-camera**: Accès caméra pour le scanner QR
- **expo-linear-gradient**: Gradients UI
- **expo-secure-store**: Stockage sécurisé
- **typescript**: Type safety

## 🤝 Intégration avec TDSS-Declaration

Cette application est conçue pour fonctionner avec le backend TDSS-Declaration. Les deux systèmes partagent:

- Le même système d'authentification
- Les mêmes formats de données
- Les mêmes règles de validation

## 📝 Licence

© 2026 TDSS - Tous droits réservés

## 📞 Support

Pour toute question ou problème:

- Consultez la documentation de votre API
- Vérifiez la configuration .env.local
- Vérifiez les logs Expo avec: `npm start`

---

**Développé avec ❤️ pour la vérification sécurisée des cartes TDSS**
