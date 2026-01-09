const EventType = require('../models/EventType');
const Location = require('../models/Location');
const Category = require('../models/Category');
const Author = require('../models/Author');
const Pole = require('../models/Pole');
const Role = require('../models/Role');

// EVENT TYPES
async function getAllEventTypes() {
  return await EventType.findAll({ order: [['name', 'ASC']] });
}

async function getEventTypeById(id) {
  return await EventType.findByPk(id);
}

async function createEventType(data) {
  return await EventType.create(data);
}

async function deleteEventType(id) {
  const type = await EventType.findByPk(id);
  if (!type || type.is_system) {
    throw new Error('Type système non supprimable');
  }
  await type.destroy();
  return true;
}

// LOCATIONS
async function getAllLocations() {
  return await Location.findAll({ order: [['name', 'ASC']] });
}

async function getLocationById(id) {
  return await Location.findByPk(id);
}

async function createLocation(data) {
  return await Location.create(data);
}

async function deleteLocation(id) {
  const location = await Location.findByPk(id);
  if (!location || location.is_system) {
    throw new Error('Lieu système non supprimable');
  }
  await location.destroy();
  return true;
}

// CATEGORIES
async function getAllCategories() {
  return await Category.findAll({ order: [['name', 'ASC']] });
}

async function getCategoryById(id) {
  return await Category.findByPk(id);
}

async function createCategory(data) {
  return await Category.create(data);
}

async function deleteCategory(id) {
  const category = await Category.findByPk(id);
  if (!category || category.is_system) {
    throw new Error('Catégorie système non supprimable');
  }
  await category.destroy();
  return true;
}

// AUTHORS
async function getAllAuthors() {
  return await Author.findAll({ order: [['name', 'ASC']] });
}

async function getAuthorById(id) {
  return await Author.findByPk(id);
}

async function createAuthor(data) {
  return await Author.create(data);
}

async function deleteAuthor(id) {
  const author = await Author.findByPk(id);
  if (!author || author.is_system) {
    throw new Error('Auteur système non supprimable');
  }
  await author.destroy();
  return true;
}

// POLES
async function getAllPolesList() {
  return await Pole.findAll({ order: [['name', 'ASC']] });
}

async function getPoleById(id) {
  return await Pole.findByPk(id);
}

async function createPole(data) {
  return await Pole.create(data);
}

async function deletePole(id) {
  const pole = await Pole.findByPk(id);
  if (!pole || pole.is_system) {
    throw new Error('Pôle système non supprimable');
  }
  await pole.destroy();
  return true;
}

// ROLES
async function getAllRoles() {
  return await Role.findAll({ order: [['name', 'ASC']] });
}

async function getRoleById(id) {
  return await Role.findByPk(id);
}

async function createRole(data) {
  return await Role.create(data);
}

async function deleteRole(id) {
  const role = await Role.findByPk(id);
  if (!role || role.is_system) {
    throw new Error('Fonction système non supprimable');
  }
  await role.destroy();
  return true;
}

module.exports = {
  getAllEventTypes,
  getEventTypeById,
  createEventType,
  deleteEventType,
  getAllLocations,
  getLocationById,
  createLocation,
  deleteLocation,
  getAllCategories,
  getCategoryById,
  createCategory,
  deleteCategory,
  getAllAuthors,
  getAuthorById,
  createAuthor,
  deleteAuthor,
  getAllPolesList,
  getPoleById,
  createPole,
  deletePole,
  getAllRoles,
  getRoleById,
  createRole,
  deleteRole
};
