const Member = require('../models/Member');

async function getAllMembers() {
  return await Member.findAll({
    where: { active: true },
    order: [['pole', 'ASC'], ['order', 'ASC']]
  });
}

async function getMembersByPole(pole) {
  return await Member.findAll({
    where: { pole, active: true },
    order: [['order', 'ASC']]
  });
}

async function getMemberById(id) {
  return await Member.findByPk(id);
}

async function createMember(data) {
  return await Member.create(data);
}

async function updateMember(id, data) {
  const member = await Member.findByPk(id);
  if (!member) {
    throw new Error('Membre non trouvé');
  }
  return await member.update(data);
}

async function deleteMember(id) {
  const member = await Member.findByPk(id);
  if (!member) {
    throw new Error('Membre non trouvé');
  }
  await member.destroy();
  return true;
}

async function getAllPoles() {
  const members = await Member.findAll({
    attributes: ['pole'],
    group: ['pole']
  });
  return [...new Set(members.map(m => m.pole))];
}

module.exports = {
  getAllMembers,
  getMembersByPole,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  getAllPoles
};
