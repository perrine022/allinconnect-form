# allinconnect-form

Application Next.js pour le formulaire d'inscription AllInConnect avec système de parrainage.

## 🚀 Technologies

- **Next.js 15+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Axios** (Client HTTP)

## 📋 Prérequis

- Node.js 18+ 
- npm, yarn, pnpm ou bun

## 🛠️ Installation

1. Cloner le repository
```bash
git clone https://github.com/perrine022/allinconnect-form.git
cd allinconnect-form
```

2. Installer les dépendances
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. Configurer les variables d'environnement (optionnel)

Créer un fichier `.env.local` à la racine du projet si vous souhaitez utiliser une URL d'API différente :
```env
NEXT_PUBLIC_API_URL=https://acquisens-back.onrender.com
```

Par défaut, l'application utilise l'API de production : `https://acquisens-back.onrender.com`

4. Lancer le serveur de développement
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

5. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 📁 Structure du projet

```
allinconnect-form/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── page.tsx           # Page d'accueil avec formulaire d'inscription
│   │   ├── thank-you/         # Page de remerciement après inscription
│   │   │   └── page.tsx       # Page de confirmation
│   │   ├── dashboard/         # Dashboard principal
│   │   │   ├── page.tsx       # Page du dashboard
│   │   │   └── company/       # Pages de détails des entreprises
│   │   ├── layout.tsx         # Layout principal
│   │   └── globals.css        # Styles globaux
│   ├── config/                # Configuration
│   │   └── api.ts            # Configuration de l'API
│   ├── services/              # Services API
│   │   ├── api.ts            # Client API de base
│   │   ├── authApi.ts        # Service d'authentification et inscription
│   │   ├── usersApi.ts       # Service de gestion des utilisateurs
│   │   ├── companiesApi.ts  # Service de gestion des entreprises
│   │   └── ...               # Autres services
│   └── types/                 # Types TypeScript
│       └── index.ts          # Définitions de types
├── public/                    # Fichiers statiques
└── package.json
```

## 🎯 Fonctionnalités

### 📝 Formulaire d'inscription

La page d'accueil (`/`) affiche un formulaire d'inscription accessible uniquement avec un code de parrainage :

- **Accès sécurisé** : La page nécessite un code de parrainage dans l'URL (`?code=CODE_PARRAINAGE`)
- **Champs du formulaire** :
  - Prénom *
  - Nom *
  - Email *
  - Adresse *
  - Code postal *
  - Date de naissance *
  - Mot de passe *
  - Confirmation du mot de passe *
- **Validation** : Validation complète des champs avec messages d'erreur
- **Code de parrainage** : Le code est automatiquement inclus dans la requête d'inscription
- **Redirection** : Après inscription réussie, redirection vers la page de remerciement

### ✅ Page de remerciement

Après une inscription réussie, l'utilisateur est redirigé vers `/thank-you` qui affiche :
- Message de confirmation
- Code de parrainage utilisé
- Lien vers le tableau de bord

### 📊 Dashboard

Le dashboard permet la gestion et visualisation des entreprises avec toutes leurs données.

## 🔌 API Backend

L'application communique avec l'API backend. Les endpoints principaux utilisés :

### Authentification et Inscription

- `POST /api/v1/auth/register` - **Création d'un nouvel utilisateur**
  - Payload : `UserRegistrationRequest` (email, password, firstName, lastName, address, city, birthDate, userType, referralCode, etc.)
  - Le code de parrainage est inclus dans la requête

### Utilisateurs

- `GET /api/v1/users` - Liste des utilisateurs
- `GET /api/v1/users/profile` - Profil de l'utilisateur connecté
- `PUT /api/v1/users/profile` - Mise à jour du profil

### Entreprises

- `GET /api/companies` - Liste des entreprises
- `GET /api/companies/{id}` - Détails d'une entreprise

## 🎨 Interface

L'interface utilise Tailwind CSS pour un design moderne et responsive :
- Formulaire d'inscription avec validation en temps réel
- Messages d'erreur clairs et informatifs
- Design épuré et professionnel
- Interface responsive pour mobile et desktop
- États de chargement et gestion d'erreurs

## 🚀 Build pour la production

```bash
npm run build
npm start
```

## 📦 Déploiement

Le projet peut être déployé sur Vercel, Netlify ou tout autre hébergeur supportant Next.js.

### Variables d'environnement

- `NEXT_PUBLIC_API_URL` (optionnel) : URL de l'API backend. Par défaut : `https://acquisens-back.onrender.com`

## 📝 Utilisation

### Accéder au formulaire d'inscription

Pour accéder au formulaire d'inscription, vous devez fournir un code de parrainage dans l'URL :

```
http://localhost:3000?code=VOTRE_CODE_PARRAINAGE
```

Sans code de parrainage, un message d'erreur s'affichera.

### Exemple de flux d'inscription

1. L'utilisateur accède à `http://localhost:3000?code=ABC123`
2. Le formulaire d'inscription s'affiche
3. L'utilisateur remplit tous les champs requis
4. À la soumission, les données sont envoyées à l'API avec le code de parrainage
5. En cas de succès, redirection vers `/thank-you?code=ABC123`
6. La page de remerciement confirme l'inscription

## 🔒 Sécurité

- Le formulaire d'inscription nécessite un code de parrainage valide
- Validation côté client et serveur
- Mots de passe non affichés (type password)
- Validation de l'email et des formats de données

## 📄 Licence

Propriétaire - AllInConnect

## 👥 Contribution

Pour contribuer au projet, veuillez créer une branche depuis `main` et soumettre une pull request.
# allinconnect-form
