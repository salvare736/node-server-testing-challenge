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
