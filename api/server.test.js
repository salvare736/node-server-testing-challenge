const db = require('../data/dbConfig');
const request = require('supertest');
const server = require('./server');

const listOfSpells = [{ name: 'cone of cold' }, { name: 'magic missile' }];

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db('spells').truncate();
});
afterAll(async () => {
  await db.destroy();
});

describe('[GET] /spells', () => {
  beforeEach(async () => {
    await db('spells').insert(listOfSpells);
  });
  it('responds with a 200 OK', async () => {
    const res = await request(server).get('/spells');
    expect(res.status).toBe(200);
  });
  it('returns a list of spells', async () => {
    const res = await request(server).get('/spells');
    expect(res.body).toMatchObject(listOfSpells);
  });
});

describe('[POST] /spells', () => {
  it('adds the spell into db', async () => {
    let spells = await db('spells');
    expect(spells).toHaveLength(0);
    await db('spells').insert(listOfSpells);
    spells = await db('spells');
    expect(spells).toHaveLength(2);
  });
  it('responds with the newly created spell', async () => {
    let spells = await db('spells');
    expect(spells).toHaveLength(0);
    const res = await request(server).post('/spells').send({ name: 'cone of cold' });
    expect(res.body).toMatchObject({ id: 1, name: 'cone of cold' });

  })
});

describe('[DELETE] /spells/:id', () => {
  beforeEach(async () => {
    await db('spells').insert(listOfSpells);
  });
  it('removes the spell from db', async () => {
    let spells = await db('spells');
    expect(spells[0]).toMatchObject({ id: 1, name: 'cone of cold' });
    expect(spells[1]).toMatchObject({ id: 2, name: 'magic missile' });
    await request(server).delete('/spells/2');
    spells = await db('spells');
    expect(spells).toHaveLength(1);
  });
  it('responds with the deleted spell', async () => {
    let spells = await db('spells');
    expect(spells[0]).toMatchObject({ id: 1, name: 'cone of cold' });
    expect(spells[1]).toMatchObject({ id: 2, name: 'magic missile' });
    const res = await request(server).delete('/spells/2');
    expect(res.body).toMatchObject({ id: 2, name: 'magic missile' });
  })
})
