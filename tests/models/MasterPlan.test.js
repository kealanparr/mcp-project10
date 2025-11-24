/**
 * Unit tests for MasterPlan model
 */

const MasterPlan = require('../../lib/models/MasterPlan');
const db = require('../../lib/services/database');

// Connect to database before tests
beforeAll(async () => {
  await db.connect();
});

// Close database after tests
afterAll(async () => {
  await db.close();
});

describe('MasterPlan Model', () => {
  describe('findAll', () => {
    test('should return mission plan entries', async () => {
      const entries = await MasterPlan.findAll({}, 5, 0);
      expect(entries).toBeDefined();
      expect(Array.isArray(entries)).toBe(true);
      expect(entries.length).toBeLessThanOrEqual(5);
    });

    test('should filter by team', async () => {
      const entries = await MasterPlan.findAll({ team: 'CAPS' }, 5, 0);
      expect(entries).toBeDefined();
      entries.forEach(entry => {
        expect(entry.team).toBe('CAPS');
      });
    });

    test('should handle pagination', async () => {
      const page1 = await MasterPlan.findAll({}, 2, 0);
      const page2 = await MasterPlan.findAll({}, 2, 2);

      expect(page1.length).toBe(2);
      expect(page2.length).toBe(2);
      expect(page1[0].id).not.toBe(page2[0].id);
    });
  });

  describe('findById', () => {
    test('should return entry by ID', async () => {
      const entry = await MasterPlan.findById(2);
      expect(entry).toBeDefined();
      expect(entry.id).toBe(2);
      expect(entry).toHaveProperty('start_time_utc');
      expect(entry).toHaveProperty('team');
    });

    test('should return null for non-existent ID', async () => {
      const entry = await MasterPlan.findById(999999);
      expect(entry).toBeNull();
    });
  });

  describe('count', () => {
    test('should return total count', async () => {
      const count = await MasterPlan.count();
      expect(count).toBeDefined();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThan(0);
    });

    test('should count filtered results', async () => {
      const count = await MasterPlan.count({ team: 'CAPS' });
      expect(count).toBeDefined();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThan(0);
    });
  });

  describe('getTeams', () => {
    test('should return list of teams', async () => {
      const teams = await MasterPlan.getTeams();
      expect(teams).toBeDefined();
      expect(Array.isArray(teams)).toBe(true);
      expect(teams.length).toBeGreaterThan(0);
      expect(teams).toContain('CAPS');
    });
  });

  describe('getTargets', () => {
    test('should return list of targets', async () => {
      const targets = await MasterPlan.getTargets();
      expect(targets).toBeDefined();
      expect(Array.isArray(targets)).toBe(true);
      expect(targets.length).toBeGreaterThan(0);
    });
  });

  describe('getSpassTypes', () => {
    test('should return list of SPASS types', async () => {
      const types = await MasterPlan.getSpassTypes();
      expect(types).toBeDefined();
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBeGreaterThan(0);
    });
  });

  describe('search', () => {
    test('should search by text', async () => {
      const results = await MasterPlan.search('Saturn', 5);
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    test('should return limited results', async () => {
      const results = await MasterPlan.search('Saturn', 3);
      expect(results.length).toBeLessThanOrEqual(3);
    });
  });
});
