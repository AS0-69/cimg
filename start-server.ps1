# Script de démarrage du serveur Mosquée Bleue
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Démarrage du serveur Mosquée Bleue" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Se déplacer dans le répertoire du script
Set-Location $PSScriptRoot

# Afficher l'URL
Write-Host "🚀 Le serveur sera accessible sur: http://localhost:3000" -ForegroundColor Yellow
Write-Host "📝 Appuyez sur Ctrl+C pour arrêter le serveur" -ForegroundColor Yellow
Write-Host ""

# Lancer le serveur
node server.js
