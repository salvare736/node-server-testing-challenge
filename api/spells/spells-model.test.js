const Spells = require('./spells-model');
const db = require('../../data/dbConfig');

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

describe('Spells', () => {

  describe('sanity', () => {
    test('Spells is defined', () => {
      expect(Spells).toBeDefined();
    });
    test('Environment is correct', () => {
      expect(process.env.NODE_ENV).toBe('testing');
    });
  });

  describe('getAll()', () => {
    it('resolves to list of spells', async () => {
      let spellList = await Spells.getAll();
      expect(spellList).toHaveLength(0);
      await db('spells').insert({ name: 'cone of cold' });
      spellList = await Spells.getAll();
      expect(spellList).toHaveLength(1);
      await db('spells').insert({ name: 'magic missile' });
      spellList = await Spells.getAll();
      expect(spellList).toHaveLength(2);
    });
    it('resolves to spells of the correct shape', async () => {
      await db('spells').insert({ name: 'cone of cold' });
      let spellList = await Spells.getAll();
      expect(spellList).toMatchObject([{ name: 'cone of cold' }]);
    });
  });

  describe('insert()', () => {
    it('inserts spell', async () => {
      await Spells.insert({ name: "cone of cold" });
      const spellList = await db('spells');
      expect(spellList).toHaveLength(1);
      expect(spellList[0]).toMatchObject({ name: "cone of cold" });
    });
    it('resolves to the inserted spell', async () => {
      const spell = await Spells.insert({ name: "cone of cold" });
      expect(spell).toMatchObject({ id: 1, name: "cone of cold" })
    });
  });
});
