# ✅ Guide de Test Complet - Mosquée Bleue avec MySQL

## 🎯 Ce qui fonctionne maintenant

### ✅ Base de données MySQL
- **Base créée** : `mosquee_bleue`
- **Table** : `events` avec 5 événements
- **Persistance** : Tous les ajouts/modifications/suppressions sont sauvegardés

### ✅ Pages publiques
1. **Accueil** (http://localhost:3000)
   - Affiche les 3 derniers événements depuis MySQL
   - Mise à jour automatique quand vous ajoutez des événements

2. **Événements** (http://localhost:3000/evenements)
   - Affiche TOUS les événements depuis MySQL
   - Sépare automatiquement événements et activités
   - Mise à jour en temps réel

### ✅ Administration
**Connexion** : http://localhost:3000/admin/login
- Identifiant : `admin`
- Mot de passe : `mosquee2024`

**Panel admin** : http://localhost:3000/admin/events
- ✅ Liste tous les événements de la BD
- ✅ Bouton "Nouvel événement" fonctionne
- ✅ Modification d'événement fonctionne
- ✅ Suppression avec confirmation fonctionne

## 📊 Accès à la base de données

### Via phpMyAdmin (recommandé)
1. Ouvrir : http://localhost/phpmyadmin
2. Cliquer sur `mosquee_bleue` dans la liste à gauche
3. Cliquer sur `events` pour voir la table
4. Onglet "Parcourir" pour voir les données
5. Onglet "SQL" pour exécuter des requêtes

### Via MySQL en ligne de commande
```bash
# Ouvrir MySQL
"C:\wamp64\bin\mysql\mysql9.1.0\bin\mysql.exe" -u root

# Utiliser la base
USE mosquee_bleue;

# Voir tous les événements
SELECT * FROM events;

# Voir uniquement les titres et dates
SELECT title, date, type FROM events ORDER BY date DESC;

# Compter les événements
SELECT COUNT(*) as total FROM events;
```

## 🧪 Tests à effectuer

### Test 1 : Ajouter un événement
1. Aller sur http://localhost:3000/admin/events
2. Cliquer "Nouvel événement"
3. Remplir le formulaire :
   - Type : Événement
   - Titre : Test MySQL
   - Date : 2026-03-15
   - Horaire : 18h00 - 20h00
   - Lieu : Salle de test
   - Catégorie : Test
   - Description : Ceci est un test
   - Image : /images/image-exemple1.jpg
4. Cliquer "Enregistrer"
5. ✅ Vérifier qu'il apparaît dans la liste admin
6. ✅ Aller sur http://localhost:3000 → doit apparaître dans les 3 derniers
7. ✅ Aller sur http://localhost:3000/evenements → doit apparaître dans la liste
8. ✅ Ouvrir phpMyAdmin → doit être dans la table `events`

### Test 2 : Modifier un événement
1. Dans admin/events, cliquer "Modifier" sur un événement
2. Changer le titre (ex: ajouter "MODIFIÉ")
3. Cliquer "Enregistrer"
4. ✅ Vérifier la modification dans la liste admin
5. ✅ Vérifier sur les pages publiques
6. ✅ Vérifier dans phpMyAdmin (colonne `updatedAt` changée)

### Test 3 : Supprimer un événement
1. Dans admin/events, cliquer "Supprimer"
2. Confirmer la suppression
3. ✅ L'événement disparaît de la liste
4. ✅ Il disparaît des pages publiques
5. ✅ Il est supprimé de la BD (vérifier dans phpMyAdmin)

### Test 4 : Persistance après redémarrage
1. Ajouter un événement "Test Persistance"
2. Arrêter le serveur (Ctrl+C)
3. Redémarrer : `node server.js`
4. ✅ L'événement est toujours là !
5. ✅ Toutes les modifications sont préservées

## 📋 Structure de la table events

```sql
CREATE TABLE `events` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `type` ENUM('event', 'activity') NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `date` DATE NOT NULL,
  `time` VARCHAR(50) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `image` VARCHAR(500) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL
);
```

## 🔍 Requêtes SQL utiles

### Voir tous les événements avec détails
```sql
SELECT 
    id,
    type,
    title,
    DATE_FORMAT(date, '%d/%m/%Y') as date_formatee,
    time,
    category,
    location
FROM events
ORDER BY date DESC;
```

### Compter événements vs activités
```sql
SELECT 
    type,
    COUNT(*) as nombre
FROM events
GROUP BY type;
```

### Voir les événements du mois
```sql
SELECT * FROM events
WHERE MONTH(date) = MONTH(CURDATE())
AND YEAR(date) = YEAR(CURDATE())
ORDER BY date;
```

### Voir les 3 prochains événements
```sql
SELECT * FROM events
WHERE date >= CURDATE()
ORDER BY date ASC
LIMIT 3;
```

## 🎨 Prochaines étapes

### Autres sections à migrer vers MySQL
Les sections suivantes sont encore en dur dans le code :

1. **Actualités** (page accueil)
   - Créer table `news`
   - Créer CRUD admin
   - Afficher sur accueil

2. **Citations** (footer)
   - Créer table `quotes`
   - Système de rotation aléatoire

3. **Membres/Équipe**
   - Créer table `members`
   - CRUD admin
   - Page "À propos"

4. **Horaires de prières**
   - Intégration API Mawaqit
   - Ou table MySQL pour personnaliser

### Améliorations
- Upload d'images (remplacer URL par upload fichier)
- Flash messages après CRUD (succès/erreur)
- Pagination si beaucoup d'événements
- Recherche/filtres dans admin
- Validation des formulaires côté serveur
- Gestion des permissions (différents rôles admin)

## 💡 Commandes utiles

### Redémarrer le serveur
```bash
# Arrêter : Ctrl+C
node server.js
```

### Relancer la migration (ATTENTION : efface tout)
```bash
node scripts/migrate-events-mysql.js
```

### Backup de la base
Dans phpMyAdmin :
1. Sélectionner `mosquee_bleue`
2. Onglet "Exporter"
3. Format SQL
4. Télécharger le fichier

### Restaurer un backup
1. Créer la base si elle n'existe pas
2. Onglet "Importer"
3. Choisir le fichier .sql
4. Exécuter

## 🎉 Résumé

**Ce qui fonctionne à 100% :**
- ✅ MySQL avec WAMP
- ✅ Création d'événements (sauvegardé en BD)
- ✅ Modification d'événements (mis à jour en BD)
- ✅ Suppression d'événements (effacé de la BD)
- ✅ Affichage automatique sur accueil (3 derniers)
- ✅ Affichage automatique sur page événements (tous)
- ✅ Persistance après redémarrage
- ✅ Dates bien formatées partout

**Pour tester maintenant :**
1. http://localhost:3000 → Voir les événements
2. http://localhost:3000/admin/login → Se connecter
3. http://localhost:3000/admin/events → Ajouter/modifier/supprimer
4. http://localhost/phpmyadmin → Voir la BD

Tout est synchronisé en temps réel ! 🚀
