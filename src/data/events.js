// Module pour gérer les données d'événements avec MySQL
const Event = require('../models/Event');
const { Op } = require('sequelize');
const { parseImages } = require('../helpers/viewHelpers');

/**
 * Récupère tous les événements
 */
async function getAllEvents() {
  const events = await Event.findAll({
    order: [['date', 'ASC']]
  });
  // Parser les images JSON
  return events.map(e => {
    const event = e.toJSON();
    event.images = parseImages(event.images);
    return event;
  });
}

/**
 * Récupère tous les événements triés par date (du plus proche au plus éloigné)
 */
async function getEventsSortedByDate() {
  const events = await Event.findAll({
    order: [['createdAt', 'DESC']] // Tri par date d'insertion en BD (plus récent en premier)
  });
  return events.map(e => {
    const event = e.toJSON();
    event.images = parseImages(event.images);
    return event;
  });
}

/**
 * Récupère les N événements les plus récents
 */
async function getRecentEvents(count = 3) {
  const events = await Event.findAll({
    order: [['date', 'DESC']],
    limit: count
  });
  return events.map(e => {
    const event = e.toJSON();
    event.images = parseImages(event.images);
    return event;
  });
}

/**
 * Récupère un événement par son ID
 */
async function getEventById(id) {
  const event = await Event.findByPk(id);
  if (event) {
    const eventData = event.toJSON();
    eventData.images = parseImages(eventData.images);
    return eventData;
  }
  return null;
}

/**
 * Récupère les événements par type
 */
async function getEventsByType(type) {
  const events = await Event.findAll({
    where: { type },
    order: [['date', 'ASC']]
  });
  return events.map(e => {
    const event = e.toJSON();
    event.images = parseImages(event.images);
    return event;
  });
}

/**
 * Crée un nouvel événement
 */
async function createEvent(eventData) {
  // Convertir images en JSON
  if (Array.isArray(eventData.images)) {
    eventData.images = JSON.stringify(eventData.images);
  }
  return await Event.create(eventData);
}

/**
 * Met à jour un événement
 */
async function updateEvent(id, eventData) {
  const event = await Event.findByPk(id);
  if (!event) {
    throw new Error('Événement non trouvé');
  }
  // Convertir images en JSON
  if (Array.isArray(eventData.images)) {
    eventData.images = JSON.stringify(eventData.images);
  }
  return await event.update(eventData);
}

/**
 * Supprime un événement
 */
async function deleteEvent(id) {
  const event = await Event.findByPk(id);
  if (!event) {
    throw new Error('Événement non trouvé');
  }
  await event.destroy();
  return true;
}

module.exports = {
  getAllEvents,
  getEventsSortedByDate,
  getRecentEvents,
  getEventById,
  getEventsByType,
  createEvent,
  updateEvent,
  deleteEvent
};
