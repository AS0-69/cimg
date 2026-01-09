# Système de Traduction (i18n) - Mosquée Bleue

## Architecture

### Vue d'ensemble
Le site utilise un système de traduction basé sur des fichiers JSON et des cookies pour permettre aux utilisateurs de basculer entre le français et le turc.

### Composants clés

#### 1. Fichiers de traduction
- **`src/i18n/fr.json`** : Traductions françaises
- **`src/i18n/tr.json`** : Traductions turques

Structure des traductions :
```json
{
  "site": { "title": "...", "subtitle": "..." },
  "nav": { "home": "...", "poles": "..." },
  "hero": { "title": "...", "subtitle": "..." },
  ...
}
```

#### 2. Middleware de langue (server.js)
```javascript
app.use((req, res, next) => {
  // Récupère la langue du cookie (défaut: 'fr')
  const lang = req.cookies.lang || 'fr';
  res.locals.currentLang = lang;
  
  // Charge le fichier de traduction correspondant
  const translations = require(`./src/i18n/${lang}.json`);
  res.locals.t = translations;
  
  next();
});
```

**Variables disponibles dans toutes les vues EJS :**
- `currentLang` : Code de la langue actuelle ('fr' ou 'tr')
- `t` : Objet contenant toutes les traductions

#### 3. Sélecteur de langue
- Composant dans le header avec drapeaux FR/TR
- Change le cookie `lang` et recharge la page
- JavaScript : `public/js/main.js` (fonction `initLanguageSelector`)
- CSS : `public/css/components/language-selector.css`

## Utilisation dans les templates EJS

### Afficher un texte traduit
```ejs
<h1><%= t.hero.title %></h1>
<p><%= t.hero.description %></p>
```

### Navigation conditionnelle selon la langue
```ejs
<span class="current-lang"><%= currentLang === 'tr' ? 'TR' : 'FR' %></span>
```

### Menu avec traductions
```ejs
<a href="/"><%= t.nav.home %></a>
<a href="/poles"><%= t.nav.poles %></a>
<a href="/don"><%= t.nav.donate %></a>
```

## Ajouter de nouvelles traductions

### 1. Ajouter la clé dans fr.json
```json
{
  "nouveauSection": {
    "titre": "Mon nouveau titre",
    "description": "Description en français"
  }
}
```

### 2. Ajouter la même clé dans tr.json
```json
{
  "nouveauSection": {
    "titre": "Yeni başlığım",
    "description": "Fransızca açıklama"
  }
}
```

### 3. Utiliser dans le template
```ejs
<h2><%= t.nouveauSection.titre %></h2>
<p><%= t.nouveauSection.description %></p>
```

## Fonctionnement du cookie

### Stockage
- Nom : `lang`
- Valeurs : `'fr'` ou `'tr'`
- Durée : 1 an
- Path : `/` (disponible sur tout le site)

### JavaScript qui définit le cookie
```javascript
document.cookie = `lang=${lang}; path=/; max-age=31536000`;
window.location.reload(); // Recharge pour appliquer la langue
```

## Sections déjà traduites

✅ **Complètes** :
- Site metadata (titre, description)
- Navigation (menu principal et mobile)
- Hero section
- Événements
- Actualités
- À propos
- Footer (horaires de prière, contact)
- Contact
- Don/Donation
- Adhésion/Membership
- Messages courants (erreurs, succès)

## Prochaines étapes (TODO)

### Pages à traduire
1. **Page Pôles** (`poles.ejs`, `poleAT.ejs`, etc.)
   - Ajouter sections `poles.*` dans les JSON
   - Remplacer textes statiques par `<%= t.poles.* %>`

2. **Page Mentions légales** (`mentions-legales.ejs`)
   - Ajouter section `legal.*`
   - Traduire conditions légales

3. **Page Politique de confidentialité** (`confidentialite.ejs`)
   - Ajouter section `privacy.*`

4. **Page Admin** (`admin/login.ejs`)
   - Ajouter section `admin.*`

### Améliorations techniques
1. **Fallback automatique** : Si une traduction manque, afficher la version française
2. **Détection automatique** : Utiliser `Accept-Language` du navigateur pour langue par défaut
3. **URL avec langue** : `/fr/contact`, `/tr/iletisim`
4. **RTL support** : Pour le turc (si nécessaire)
5. **Pluralisation** : Gérer singulier/pluriel selon la langue

### Exemple de fallback à implémenter
```javascript
// Dans le middleware
function getTranslation(key, lang) {
  try {
    return require(`./src/i18n/${lang}.json`)[key];
  } catch {
    return require('./src/i18n/fr.json')[key]; // Fallback to French
  }
}
```

## Bonnes pratiques

### 1. Organisation des clés
- Regrouper par page/section : `hero.*`, `contact.*`, `footer.*`
- Utiliser des noms descriptifs : `hero.callToAction` plutôt que `hero.btn1`

### 2. Éviter les traductions en dur
❌ **Mauvais** :
```ejs
<h1>Bienvenue à la Mosquée Bleue</h1>
```

✅ **Bon** :
```ejs
<h1><%= t.hero.title %></h1>
```

### 3. Tester les deux langues
- Toujours vérifier que la clé existe dans TOUS les fichiers de langue
- Tester l'affichage avec les deux langues
- Vérifier la longueur des textes (turc peut être plus long)

### 4. Internationalisation des dates
```javascript
// Dans les templates EJS
<%= new Date().toLocaleDateString(currentLang === 'tr' ? 'tr-TR' : 'fr-FR') %>
```

### 5. Nombres et devises
```javascript
// Format monétaire selon la langue
const formatter = new Intl.NumberFormat(currentLang === 'tr' ? 'tr-TR' : 'fr-FR', {
  style: 'currency',
  currency: 'EUR'
});
```

## Structure de fichiers

```
src/
├── i18n/
│   ├── fr.json          # Traductions françaises
│   └── tr.json          # Traductions turques
├── views/
│   ├── partials/
│   │   ├── header.ejs   # Inclut le sélecteur de langue
│   │   └── ...
│   └── *.ejs            # Tous les templates utilisent t.*
└── routes/
    └── *.js             # Les routes n'ont pas besoin de changement

server.js                # Middleware i18n configuré
public/
├── css/components/
│   └── language-selector.css
└── js/
    └── main.js          # initLanguageSelector()
```

## Dépannage

### Problème : Les traductions ne s'affichent pas
- Vérifier que `cookie-parser` est installé : `npm install cookie-parser`
- Vérifier que le middleware est chargé dans `server.js`
- Vérifier que la clé existe dans le fichier JSON

### Problème : Le cookie ne se définit pas
- Vérifier la console JavaScript pour des erreurs
- Vérifier que `initLanguageSelector()` est appelé au DOMContentLoaded

### Problème : La page ne recharge pas après changement de langue
- Vérifier que `window.location.reload()` est bien appelé
- Vérifier qu'il n'y a pas d'erreur JavaScript empêchant l'exécution

## Contact technique
Pour toute question sur le système de traduction, consulter :
- Fichier : `server.js` (lignes 35-50) - Middleware
- Fichier : `public/js/main.js` (fonction `initLanguageSelector`)
- Dossier : `src/i18n/` - Fichiers de traduction
