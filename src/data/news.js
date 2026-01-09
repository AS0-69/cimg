// Module pour gérer les actualités avec MySQL
const News = require('../models/News');

/**
 * Récupère toutes les actualités
 */
async function getAllNews() {
  return await News.findAll({
    order: [['createdAt', 'DESC']]
  });
}

/**
 * Récupère les N actualités les plus récentes
 */
async function getRecentNews(count = 3) {
  return await News.findAll({
    order: [['createdAt', 'DESC']],
    limit: count
  });
}

/**
 * Récupère une actualité par son ID
 */
async function getNewsById(id) {
  return await News.findByPk(id);
}

/**
 * Crée une nouvelle actualité
 */
async function createNews(newsData) {
  return await News.create(newsData);
}

/**
 * Met à jour une actualité
 */
async function updateNews(id, newsData) {
  const news = await News.findByPk(id);
  if (!news) {
    throw new Error('Actualité non trouvée');
  }
  return await news.update(newsData);
}

/**
 * Supprime une actualité
 */
async function deleteNews(id) {
  const news = await News.findByPk(id);
  if (!news) {
    throw new Error('Actualité non trouvée');
  }
  await news.destroy();
  return true;
}

module.exports = {
  getAllNews,
  getRecentNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
};
