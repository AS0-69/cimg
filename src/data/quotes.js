// Module pour gérer les citations avec MySQL
const Quote = require('../models/Quote');

/**
 * Récupère toutes les citations (pour l'admin)
 */
async function getAllQuotesAdmin() {
  return await Quote.findAll({
    order: [['createdAt', 'DESC']]
  });
}

/**
 * Récupère toutes les citations actives
 */
async function getAllQuotes() {
  return await Quote.findAll({
    where: { active: true },
    order: [['createdAt', 'DESC']]
  });
}

/**
 * Récupère 4 citations actives au hasard
 */
async function getRandomActiveQuotes(limit = 4) {
  const quotes = await Quote.findAll({
    where: { active: true }
  });
  
  if (quotes.length === 0) {
    return [];
  }
  
  // Mélanger le tableau (Fisher-Yates shuffle)
  const shuffled = [...quotes];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, Math.min(limit, shuffled.length));
}

/**
 * Récupère une citation aléatoire
 */
async function getRandomQuote() {
  const quotes = await Quote.findAll({
    where: { active: true }
  });
  
  if (quotes.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

/**
 * Récupère une citation par son ID
 */
async function getQuoteById(id) {
  return await Quote.findByPk(id);
}

/**
 * Crée une nouvelle citation
 */
async function createQuote(quoteData) {
  return await Quote.create(quoteData);
}

/**
 * Met à jour une citation
 */
async function updateQuote(id, quoteData) {
  const quote = await Quote.findByPk(id);
  if (!quote) {
    throw new Error('Citation non trouvée');
  }
  return await quote.update(quoteData);
}

/**
 * Supprime une citation
 */
async function deleteQuote(id) {
  const quote = await Quote.findByPk(id);
  if (!quote) {
    throw new Error('Citation non trouvée');
  }
  await quote.destroy();
  return true;
}

module.exports = {
  getAllQuotesAdmin,
  getAllQuotes,
  getRandomActiveQuotes,
  getRandomQuote,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote
};
