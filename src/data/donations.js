const Donation = require('../models/Donation');

async function getAllDonations() {
  return await Donation.findAll({
    order: [['createdAt', 'DESC']]
  });
}

async function getActiveDonations() {
  return await Donation.findAll({
    where: { active: true },
    order: [['createdAt', 'DESC']]
  });
}

async function getDonationById(id) {
  return await Donation.findByPk(id);
}

async function createDonation(data) {
  return await Donation.create(data);
}

async function updateDonation(id, data) {
  const donation = await Donation.findByPk(id);
  if (!donation) {
    throw new Error('Campagne non trouvée');
  }
  return await donation.update(data);
}

async function deleteDonation(id) {
  const donation = await Donation.findByPk(id);
  if (!donation) {
    throw new Error('Campagne non trouvée');
  }
  await donation.destroy();
  return true;
}

module.exports = {
  getAllDonations,
  getActiveDonations,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation
};
