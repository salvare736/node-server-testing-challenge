const db = require('../../data/dbConfig');

module.exports = {
  insert,
  update,
  remove,
  getAll,
  getById,
}

function getAll() {
  return db('spells');
}

function getById(id) {
  return null;
}

async function insert(spell) {
  const [id] = await db('spells')
    .insert(spell, ['id', 'name']);
  return db('spells').where('id', id).first();
}

async function update(id, changes) {
  return null;
}

function remove(id) {
  return null;
}
