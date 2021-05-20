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

describe('[DELETE] /spells/:id', () => {
  beforeEach(async () => {
    await db('spells').insert(listOfSpells);
  });
  it('removes the spell from db', async () => {
    let spells = await db('spells');
    expect(spells[0]).toBeTruthy;
    expect(spells[1]).toBeTruthy;
    const res = await request(server).delete('/spells/2');
    expect(res.body).toMatchObject({ id: 2, name: 'magic missile' });
    spells = await db('spells');
    expect(spells[0]).toBeTruthy;
    expect(spells[1]).toBeFalsy;
  });
})
