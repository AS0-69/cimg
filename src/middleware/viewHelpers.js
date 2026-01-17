/**
 * Middleware pour injecter les helpers dans res.locals
 * Disponibles dans toutes les vues EJS
 */
const viewHelpers = require('../helpers/viewHelpers');

function injectViewHelpers(req, res, next) {
  // Injecter tous les helpers
  Object.keys(viewHelpers).forEach(helper => {
    res.locals[helper] = viewHelpers[helper];
  });
  
  // Ajouter des variables utiles
  res.locals.currentYear = new Date().getFullYear();
  res.locals.currentDate = new Date();
  
  next();
}

module.exports = injectViewHelpers;
