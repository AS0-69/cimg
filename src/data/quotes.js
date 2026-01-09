// Module pour gérer les citations avec MySQL
const Quote = require('../models/Quote');

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
  getAllQuotes,
  getRandomQuote,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote
};
