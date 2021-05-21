const db = require('../../data/dbConfig');

module.exports = {
  insert,
  remove,
  getAll,
}

function getAll() {
  return db('spells');
}

async function insert(spell) {
  const [id] = await db('spells').insert(spell);
  return db('spells').where('id', id).first();
}

async function remove(id) {
  const delSpell = await db('spells').where('id', id).first();
  await db('spells').where('id', id).del()
  return delSpell; 
}
