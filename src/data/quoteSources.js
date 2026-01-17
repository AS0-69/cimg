const QuoteSource = require('../models/QuoteSource');

// Récupérer toutes les sources
async function getAllQuoteSources() {
  return await QuoteSource.findAll({
    order: [['name', 'ASC']]
  });
}

// Récupérer une source par ID
async function getQuoteSourceById(id) {
  return await QuoteSource.findByPk(id);
}

// Créer une nouvelle source
async function createQuoteSource(data) {
  return await QuoteSource.create(data);
}

// Mettre à jour une source
async function updateQuoteSource(id, data) {
  const source = await QuoteSource.findByPk(id);
  if (source) {
    return await source.update(data);
  }
  return null;
}

// Supprimer une source
async function deleteQuoteSource(id) {
  const source = await QuoteSource.findByPk(id);
  if (source) {
    return await source.destroy();
  }
  return null;
}

// Vérifier si une source existe déjà (par nom)
async function quoteSourceExists(name) {
  const source = await QuoteSource.findOne({
    where: { name }
  });
  return !!source;
}

// Obtenir ou créer une source
async function getOrCreateQuoteSource(name) {
  const [source, created] = await QuoteSource.findOrCreate({
    where: { name },
    defaults: { name }
  });
  return source;
}

module.exports = {
  getAllQuoteSources,
  getQuoteSourceById,
  createQuoteSource,
  updateQuoteSource,
  deleteQuoteSource,
  quoteSourceExists,
  getOrCreateQuoteSource
};
