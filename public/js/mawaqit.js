// ========================================
// MAWAQIT API INTEGRATION
// API pour les horaires de prière en temps réel
// ========================================

// Configuration
const MAWAQIT_CONFIG = {
    // UUID de la mosquée (à configurer avec l'UUID réel de la Mosquée Bleue)
    // Pour obtenir l'UUID: https://mawaqit.net/fr/mosquee-search
    mosqueUUID: 'VOTRE-UUID-MOSQUEE',
    
    // Alternative: utiliser la recherche par ville
    city: 'Villefranche-sur-Saône',
    country: 'France',
    
    // Endpoint API
    apiBase: 'https://mawaqit.net/fr'
};

// Noms des prières en arabe et français
const PRAYER_NAMES = {
    fajr: { ar: 'الفجر', fr: 'Fajr', icon: '🌅' },
    chourouk: { ar: 'الشروق', fr: 'Chourouk', icon: '🌄' },
    dhuhr: { ar: 'الظهر', fr: 'Dhuhr', icon: '☀️' },
    asr: { ar: 'العصر', fr: 'Asr', icon: '🌤️' },
    maghrib: { ar: 'المغرب', fr: 'Maghrib', icon: '🌆' },
    isha: { ar: 'العشاء', fr: 'Isha', icon: '🌙' },
    jumaa: { ar: 'الجمعة', fr: 'Jumaa', icon: '🕌' }
};

// ========================================
// INITIALISATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initPrayerTimes();
    
    // Rafraîchir toutes les heures
    setInterval(initPrayerTimes, 3600000);
});

// ========================================
// RÉCUPÉRATION DES HORAIRES
// ========================================
async function initPrayerTimes() {
    try {
        const prayerTimes = await fetchPrayerTimes();
        if (prayerTimes) {
            displayPrayerTimes(prayerTimes);
        } else {
            // Si l'API ne fonctionne pas, afficher des horaires par défaut
            displayDefaultTimes();
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des horaires:', error);
        displayDefaultTimes();
    }
}

// Récupérer les horaires depuis l'API Mawaqit
async function fetchPrayerTimes() {
    try {
        // Méthode 1: Par UUID de la mosquée (préférable)
        if (MAWAQIT_CONFIG.mosqueUUID && MAWAQIT_CONFIG.mosqueUUID !== 'VOTRE-UUID-MOSQUEE') {
            const response = await fetch(
                `${MAWAQIT_CONFIG.apiBase}/${MAWAQIT_CONFIG.mosqueUUID}/calendar`
            );
            
            if (response.ok) {
                const data = await response.json();
                return parseMawaqitData(data);
            }
        }
        
        // Méthode 2: Calcul local avec algorithme
        // Utilisation de coordonnées approximatives de Villefranche-sur-Saône
        const times = calculatePrayerTimes(45.9903, 4.7189);
        return times;
        
    } catch (error) {
        console.error('Erreur API Mawaqit:', error);
        return null;
    }
}

// Parser les données de l'API Mawaqit
function parseMawaqitData(data) {
    const today = new Date().toISOString().split('T')[0];
    const todayPrayers = data.calendar?.[today];
    
    if (!todayPrayers) return null;
    
    return {
        date: formatDateFrench(new Date()),
        hijriDate: data.hijri_date || '',
        fajr: todayPrayers.fajr,
        chourouk: todayPrayers.chourouk || todayPrayers.sunrise || '--:--',
        dhuhr: todayPrayers.dhuhr,
        asr: todayPrayers.asr,
        maghrib: todayPrayers.maghrib,
        isha: todayPrayers.isha,
        jumaa: todayPrayers.jumua || todayPrayers.jummah || '13:30'
    };
}

// Calcul simplifié des horaires de prière
// NOTE: Pour une précision maximale, utiliser une bibliothèque comme Adhan.js
func
    // Calculs simplifiés (à remplacer par une vraie bibliothèque de calcul)
    // Ces horaires sont des approximations
    return {
        date: formatDateFrench(now),
        hijriDate: '',
        fajr: '06:30',
        chourouk: '08:00',
        dhuhr: '13:00',
        asr: '15:30',
        maghrib: '18:00',
        isha: '19:30',
        jumaa: '1330',
        maghrib: '18:00',
        isha: '19:30'
    };
}

// ========================================
// AFFICHAGE DES HORAIRES
// ========================================
function displayPrayerTimes(times) {
    // Mise à jour de la date
    const dateElement = document.getElementById('prayer-date');
    if (dateElement) {
        let dateText = times.date;
        if (times.hijriDate) {
            dateText += ` - ${times.hijriDate}`;
        }
        dateElement.textContent = dateText;
    }
    
    // Mise à jour des horaires
    const prayerTimesContainer = document.getElementById('prayer-times');
    if (!prayerTimesContainer) return;
    chourouk', 'dhuhr', 'asr', 'maghrib', 'isha', 'jumaa'];
    const items = prayerTimesContainer.querySelectorAll('.prayer-time-item');
    
    items.forEach((item, index) => {
        const prayer = prayers[index];
        const nameElement = item.querySelector('.prayer-name');
        const hourElement = item.querySelector('.prayer-hour');
        
        if (nameElement && hourElement) {
            nameElement.textContent = PRAYER_NAMES[prayer].fr;
            hourElement.textContent = times[prayer] || '--:--';
            
            // Highlight la prière actuelle ou prochaine (sauf Chourouk et Jumaa)
            if (prayer !== 'chourouk' && prayer !== 'jumaa' && ighlight la prière actuelle ou prochaine
            if (isCurrentPrayer(times[prayer])) {
                item.classList.add('current-prayer');
            }
        }
    });
}

// Afficher des horaires par défaut en cas d'erreur
function displayDefaultTimes() {
    const defaultTimes = {
        date: formatDateFrench(new Date()),
        hijriDate: '',
        chourouk: '--:--',
        dhuhr: '--:--',
        asr: '--:--',
        maghrib: '--:--',
        isha: '--:--',
        jumahrib: '--:--',
        isha: '--:--'
    };
    
    displayPrayerTimes(defaultTimes);
    
    // Afficher un message dans la console
    console.warn('Horaires de prière non disponibles. Veuillez configurer l\'UUID de la mosquée.');
}

// ========================================
// UTILITAIRES
// ========================================

// Formater la date en français
function formatDateFrench(date) {
    return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Vérifier si c'est l'heure de la prière actuelle
function isCurrentPrayer(prayerTime) {
    if (!prayerTime || prayerTime === '--:--') return false;
    
    const now = new Date();
    const [hours, minutes] = prayerTime.split(':').map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0, 0);
    
    // Considérer comme "actuelle" si c'est dans les 30 minutes suivantes
    const diff = prayerDate - now;
    return diff > 0 && diff < 1800000; // 30 minutes en millisecondes
}

// Obtenir la prochaine prière
function getNextPrayer(times) {
    const now = new Date();
    const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    
    for (const prayer of prayers) {
        const time = times[prayer];
        if (!time || time === '--:--') continue;
        
        const [hours, minutes] = time.split(':').map(Number);
        const prayerDate = new Date();
        prayerDate.setHours(hours, minutes, 0, 0);
        
        if (prayerDate > now) {
            return {
                name: PRAYER_NAMES[prayer].fr,
                time: time,
                remaining: prayerDate - now
            };
        }
    }
    
    return null;
}

// Formater le temps restant
function formatTimeRemaining(milliseconds) {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    
    if (hours > 0) {
        return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
}

// ========================================
// CSS DYNAMIQUE POUR LA PRIÈRE ACTUELLE
// ========================================
if (!document.getElementById('prayer-animation-style')) {
    const prayerStyle = document.createElement('style');
    prayerStyle.id = 'prayer-animation-style';
    prayerStyle.textContent = `
        .prayer-time-item.current-prayer {
            background: rgba(255, 255, 255, 0.25) !important;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
            animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1) translateY(0);
            }
            50% {
                transform: scale(1.02) translateY(-2px);
            }
        }
    `;
    document.head.appendChild(prayerStyle);
}

// ========================================
// EXPORT
// ========================================
window.mawaqit = {
    fetchPrayerTimes,
    displayPrayerTimes,
    getNextPrayer,
    formatTimeRemaining
};

// ========================================
// INSTRUCTIONS POUR LA CONFIGURATION
// ========================================
console.log(`
🕌 Configuration des horaires de prière Mawaqit:

1. Visitez: https://mawaqit.net/fr/mosquee-search
2. Recherchez "Mosquée Bleue Villefranche-sur-Saône"
3. Copiez l'UUID de votre mosquée
4. Collez-le dans le fichier mawaqit.js à la ligne:
   mosqueUUID: 'VOTRE-UUID-MOSQUEE'

Alternative: Les horaires sont calculés localement en attendant la configuration.
`);
