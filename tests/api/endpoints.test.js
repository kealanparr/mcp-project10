/**
 * Integration tests for API endpoints
 */

const request = require('supertest');
const app = require('../../server');
const db = require('../../lib/services/database');

// Connect to database before tests
beforeAll(async () => {
  await db.connect();
});

// Close database after tests
afterAll(async () => {
  await db.close();
});

describe('API Endpoints', () => {
  describe('GET /', () => {
    test('should return service info', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body).toHaveProperty('database');
    });
  });

  describe('GET /api/mission-plan', () => {
    test('should return mission plan entries', async () => {
      const response = await request(app).get('/api/mission-plan?limit=5');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should filter by team', async () => {
      const response = await request(app).get('/api/mission-plan?team=CAPS&limit=5');
      expect(response.status).toBe(200);
      expect(response.body.filters.team).toBe('CAPS');
      response.body.data.forEach(entry => {
        expect(entry.team).toBe('CAPS');
      });
    });

    test('should handle pagination', async () => {
      const response = await request(app).get('/api/mission-plan?limit=2&offset=2');
      expect(response.status).toBe(200);
      expect(response.body.pagination.limit).toBe(2);
      expect(response.body.pagination.offset).toBe(2);
    });

    test('should reject invalid filters', async () => {
      const response = await request(app).get('/api/mission-plan?invalid=test');
      expect(response.status).toBe(400);
    });

    test('should reject invalid limit', async () => {
      const response = await request(app).get('/api/mission-plan?limit=2000');
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/mission-plan/:id', () => {
    test('should return entry by ID', async () => {
      const response = await request(app).get('/api/mission-plan/2');
      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(2);
    });

    test('should return 404 for non-existent ID', async () => {
      const response = await request(app).get('/api/mission-plan/999999');
      expect(response.status).toBe(404);
    });

    test('should reject invalid ID', async () => {
      const response = await request(app).get('/api/mission-plan/abc');
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/mission-plan/search/text', () => {
    test('should search by text', async () => {
      const response = await request(app).get('/api/mission-plan/search/text?q=Saturn&limit=5');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.query).toBe('Saturn');
    });

    test('should require search query', async () => {
      const response = await request(app).get('/api/mission-plan/search/text');
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/metadata/teams', () => {
    test('should return teams list', async () => {
      const response = await request(app).get('/api/metadata/teams');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/metadata/targets', () => {
    test('should return targets list', async () => {
      const response = await request(app).get('/api/metadata/targets');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/metadata/spass-types', () => {
    test('should return SPASS types list', async () => {
      const response = await request(app).get('/api/metadata/spass-types');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/metadata/stats', () => {
    test('should return statistics', async () => {
      const response = await request(app).get('/api/metadata/stats');
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('totalEntries');
      expect(response.body.data).toHaveProperty('uniqueTeams');
      expect(response.body.data).toHaveProperty('uniqueTargets');
      expect(response.body.data).toHaveProperty('uniqueSpassTypes');
    });
  });

  describe('GET /nonexistent', () => {
    test('should return 404', async () => {
      const response = await request(app).get('/nonexistent');
      expect(response.status).toBe(404);
    });
  });
});
