# 🚀 Installation MySQL pour le projet Mosquée Bleue

## Étape 1: Installer XAMPP (Recommandé pour débutants)

### Windows:
1. **Télécharger XAMPP** : https://www.apachefriends.org/download.html
2. **Installer** XAMPP (choisir Apache et MySQL)
3. **Lancer** le panneau de contrôle XAMPP
4. **Démarrer** le module MySQL (cliquer sur "Start")

### Alternative: MySQL Standalone
Si vous préférez installer MySQL seul:
- Windows: https://dev.mysql.com/downloads/installer/
- Choisir "MySQL Server" et "MySQL Workbench"

## Étape 2: Créer la base de données

### Avec XAMPP (phpMyAdmin):
1. Ouvrir phpMyAdmin : http://localhost/phpmyadmin
2. Cliquer sur "Nouvelle base de données"
3. Nom: `mosquee_bleue`
4. Interclassement: `utf8mb4_unicode_ci`
5. Cliquer sur "Créer"

### Avec MySQL Workbench:
1. Ouvrir MySQL Workbench
2. Se connecter au serveur local
3. Exécuter cette requête:
```sql
CREATE DATABASE mosquee_bleue CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Avec la ligne de commande:
```bash
mysql -u root -p
CREATE DATABASE mosquee_bleue CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

## Étape 3: Vérifier la configuration

Le fichier `.env` contient déjà la configuration par défaut:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=mosquee_bleue
```

**Note**: Par défaut, XAMPP n'a pas de mot de passe pour l'utilisateur `root`.

## Étape 4: Exécuter la migration

Une fois MySQL démarré et la base créée, exécutez:

```bash
node scripts/migrate-events-mysql.js
```

Ce script va:
- ✅ Tester la connexion MySQL
- ✅ Créer la table `events`
- ✅ Insérer les 5 événements de démonstration

## Étape 5: Démarrer le serveur

```bash
node server.js
```

Le serveur va automatiquement:
- Se connecter à MySQL
- Synchroniser les tables
- Afficher un message de confirmation

## 🔍 Vérification

### Vérifier que MySQL fonctionne:
- **XAMPP**: Le module MySQL doit être en vert
- **Service**: Vérifier dans les services Windows (mysql)
- **Port**: MySQL utilise le port 3306 par défaut

### Vérifier les données dans phpMyAdmin:
1. Aller sur http://localhost/phpmyadmin
2. Cliquer sur la base `mosquee_bleue`
3. Cliquer sur la table `events`
4. Onglet "Afficher" → Vous devez voir 5 événements

## ❌ Dépannage

### Erreur "ECONNREFUSED"
- MySQL n'est pas démarré
- Solution: Démarrer MySQL dans XAMPP

### Erreur "Access denied"
- Mauvais mot de passe
- Solution: Vérifier DB_USER et DB_PASSWORD dans .env

### Erreur "Unknown database"
- La base n'existe pas
- Solution: Créer la base `mosquee_bleue` (voir Étape 2)

### Port 3306 déjà utilisé
- Un autre service utilise le port MySQL
- Solution: Arrêter l'autre service ou changer le port

## 📊 Structure de la base de données

### Table: `events`

| Colonne | Type | Description |
|---------|------|-------------|
| id | INT | Clé primaire auto-incrémentée |
| type | ENUM | 'event' ou 'activity' |
| title | VARCHAR(255) | Titre de l'événement |
| date | DATE | Date (YYYY-MM-DD) |
| time | VARCHAR(50) | Horaire (ex: 20h00-22h00) |
| location | VARCHAR(255) | Lieu |
| category | VARCHAR(100) | Catégorie |
| description | TEXT | Description complète |
| image | VARCHAR(500) | Chemin de l'image |
| createdAt | DATETIME | Date de création |
| updatedAt | DATETIME | Dernière modification |

## 🎯 Prochaines étapes

Maintenant que MySQL est configuré, vous pouvez:

1. ✅ Voir les événements sur la page d'accueil
2. ✅ Voir tous les événements sur /evenements
3. ✅ Gérer les événements via /admin/events
4. ✅ Ajouter, modifier, supprimer des événements

Les changements sont maintenant **persistants** et sauvegardés dans MySQL ! 🎉

## 💡 Commandes utiles

```bash
# Migrer les données
node scripts/migrate-events-mysql.js

# Démarrer le serveur
node server.js

# Vérifier MySQL dans XAMPP
# Panneau XAMPP → MySQL → Status (doit être en vert)
```

## 🔗 Liens utiles

- XAMPP: https://www.apachefriends.org/
- phpMyAdmin: http://localhost/phpmyadmin
- Documentation Sequelize: https://sequelize.org/
- MySQL Workbench: https://dev.mysql.com/downloads/workbench/
