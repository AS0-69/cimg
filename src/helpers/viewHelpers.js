/**
 * Helpers pour formater les données dans les vues
 */

/**
 * Formater une date au format français
 * @param {Date|string} date - La date à formater
 * @returns {string} Date formatée (ex: "14/01/2026")
 */
function formatDateFR(date) {
  return new Date(date).toLocaleDateString('fr-FR');
}

/**
 * Formater une date au format français long
 * @param {Date|string} date - La date à formater
 * @returns {string} Date formatée (ex: "14 janvier 2026")
 */
function formatDateLongFR(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Tronquer un texte avec ellipse
 * @param {string} text - Le texte à tronquer
 * @param {number} length - Longueur maximale
 * @returns {string} Texte tronqué
 */
function truncate(text, length = 100) {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
}

/**
 * Obtenir la première image d'un élément
 * @param {object} item - L'élément contenant les images
 * @returns {string|null} URL de l'image ou null
 */
function getFirstImage(item) {
  if (item.images && item.images.length > 0) {
    return item.images[0];
  }
  return item.image || null;
}

/**
 * Parser les images (gère JSON string ou array)
 * @param {string|array} images - Images JSON string ou array
 * @returns {array} Array d'images
 */
function parseImages(images) {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  if (typeof images === 'string') {
    try {
      return JSON.parse(images);
    } catch (e) {
      return [];
    }
  }
  return [];
}

/**
 * Formater un montant en euros
 * @param {number} amount - Le montant
 * @returns {string} Montant formaté (ex: "1 234,56 €")
 */
function formatEuro(amount) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

/**
 * Calculer le pourcentage
 * @param {number} current - Valeur actuelle
 * @param {number} total - Valeur totale
 * @returns {number} Pourcentage arrondi
 */
function calculatePercentage(current, total) {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
}

/**
 * Obtenir la classe badge selon le statut
 * @param {boolean|string} status - Le statut
 * @returns {string} Classe CSS
 */
function getBadgeClass(status) {
  const classes = {
    true: 'badge-success',
    false: 'badge-danger',
    'actif': 'badge-success',
    'inactif': 'badge-danger',
    'en_cours': 'badge-warning',
    'termine': 'badge-info'
  };
  return classes[status] || 'badge-info';
}

/**
 * Pluraliser un mot selon un nombre
 * @param {number} count - Le nombre
 * @param {string} singular - Forme singulière
 * @param {string} plural - Forme plurielle (optionnel)
 * @returns {string} Mot au pluriel si nécessaire
 */
function pluralize(count, singular, plural) {
  if (count <= 1) return singular;
  return plural || singular + 's';
}

module.exports = {
  formatDateFR,
  formatDateLongFR,
  truncate,
  getFirstImage,
  parseImages,
  formatEuro,
  calculatePercentage,
  getBadgeClass,
  pluralize
};
