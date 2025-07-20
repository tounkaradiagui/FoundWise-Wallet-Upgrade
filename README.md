# 💸 Finance Tracker – Application de Gestion Financière Personnelle

Une application mobile simple, moderne et intuitive pour gérer vos finances au quotidien.  
Suivez vos transactions, catégorisez vos dépenses, et prenez le contrôle de votre budget où que vous soyez.

---

## 📱 Capture d'écran

| Accueil | Historique des transactions | Profil utilisateur |
|--------|-----------------------------|--------------------|
| ![Accueil](./screens/home.png) | ![Transactions](./screens/transactions.png) | ![Profil](./screens/profile.png) |

---

## 🚀 Fonctionnalités principales

- ✅ Authentification sécurisée avec Clerk
- 💳 Ajout et visualisation de transactions
- 📂 Catégorisation des dépenses et revenus
- 🗑️ Suppression rapide via icône “trash”
- 🔄 Actualisation avec `pull-to-refresh`
- 🧑‍💼 Édition du profil utilisateur
- 📊 Tri des transactions par date (du plus récent au plus ancien)
- 🌙 Support du thème clair/sombre (facile à intégrer avec Tailwind + NativeWind si besoin)

---

## 🛠️ Stack technique

| Outil / Lib            | Description                         |
|------------------------|-------------------------------------|
| [Expo](https://expo.dev)                | Framework React Native simplifié |
| [React Native](https://reactnative.dev) | Développement mobile natif       |
| [TypeScript](https://www.typescriptlang.org/) | Typage statique fiable |
| [Clerk](https://clerk.dev)             | Authentification et gestion des comptes |
| [Neon DB](https://neon.tech/)          | Base de données PostgreSQL serverless |
| [TanStack Query](https://tanstack.com/query) | Gestion du cache et des requêtes |
| [Expo Router](https://expo.github.io/router/docs) | Navigation moderne façon Next.js |

---

## 📦 Installation

```bash
# Cloner le dépôt
git clone https://github.com/tonpseudo/finance-tracker.git
cd finance-tracker

# Installer les dépendances
npm install

# Lancer le projet
npx expo start

⚠️ Assure-toi d’avoir installé Expo CLI (npm install -g expo-cli) et d’avoir un compte Clerk + Neon configurés dans .env.


🔐 Configuration (fichier .env)
Crée un fichier .env à la racine et ajoute :

CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
DATABASE_URL=postgres://...


📁 Structure du projet
src/
├── app/               # Pages avec Expo Router
├── components/        # Composants réutilisables
├── hooks/             # Logique métier personnalisée
├── lib/               # Configurations Clerk, DB...
├── constants/         # Catégories, icônes, etc.
├── assets/            # Images, logos

✨ À propos du développeur
Je suis Diagui TOUNKARA, développeur web & mobile fullstack passionné par la tech et la finance.
J’ai développé cette app pour simplifier la gestion des dépenses, en espérant qu'elle vous aide à atteindre vos objectifs financiers.

📬 Contact : tounkaradiagui@gmail.com


🤝 Contribution
Les contributions sont les bienvenues !
Pour contribuer :

1. Fork le projet
2. Crée une branche feature/mon-feature
3. Commit tes modifications
4. Crée une pull request

📄 Licence
Ce projet est sous licence MIT – libre de l’utiliser, le modifier et le distribuer.



