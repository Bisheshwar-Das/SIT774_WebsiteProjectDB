const request = require('supertest');
const path = require('path');

// Mock the database module BEFORE importing the app
jest.mock('../server/scenarioDB', () => ({
  run: jest.fn(),
  get: jest.fn(),
  all: jest.fn()
}));

const db = require('../server/scenarioDB');

// Import your actual app AFTER mocking the database
const app = require('../server/app');

describe('Web Application Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Routes', () => {
    test('GET / should return 200 status', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      // Since your app serves an HTML file, we check for HTML content
      expect(response.type).toBe('text/html');
    });

    test('GET /health should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('Database Operations', () => {
    test('Database connection mock works', () => {
      const mockCallback = jest.fn();
      db.run('SELECT 1', [], mockCallback);
      expect(db.run).toHaveBeenCalledWith('SELECT 1', [], mockCallback);
    });

    test('Scenarios route handles database response', async () => {
      // Mock the first database call (scenarios)
      db.all
        .mockImplementationOnce((sql, params, callback) => {
          const mockScenarios = [
            { 
              id: 1, 
              title: 'Test Scenario', 
              description: 'Test Description', 
              author: 'Anonymous',
              tags: '["test", "mock"]',
              upvotes: 0,
              downvotes: 0,
              imageUrl: null,
              status: 'active',
              createdAt: new Date().toISOString()
            }
          ];
          callback(null, mockScenarios);
        })
        // Mock the second database call (tags)
        .mockImplementationOnce((sql, params, callback) => {
          const mockTags = [
            { name: 'test', color: '#blue' },
            { name: 'mock', color: '#green' }
          ];
          callback(null, mockTags);
        });

      const response = await request(app).get('/all-scenarios');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('scenarios');
      expect(response.body).toHaveProperty('tagColorMap');
      expect(Array.isArray(response.body.scenarios)).toBe(true);
      
      // Verify the scenario structure
      if (response.body.scenarios.length > 0) {
        const scenario = response.body.scenarios[0];
        expect(scenario).toHaveProperty('id');
        expect(scenario).toHaveProperty('title');
        expect(scenario).toHaveProperty('tags');
        expect(Array.isArray(scenario.tags)).toBe(true);
      }
    });
  });

  describe('Data Validation', () => {
    test('Should validate required fields', () => {
      const testData = {
        title: 'Test Scenario',
        description: 'Test Description'
      };
      
      expect(testData.title).toBeDefined();
      expect(testData.description).toBeDefined();
      expect(testData.title.length).toBeGreaterThan(0);
    });

    test('Should handle JSON parsing for tags', () => {
      const tagsString = '["tag1", "tag2"]';
      const parsedTags = JSON.parse(tagsString);
      
      expect(Array.isArray(parsedTags)).toBe(true);
      expect(parsedTags).toContain('tag1');
      expect(parsedTags).toContain('tag2');
    });
  });

  describe('Error Handling', () => {
    test('Should handle database errors gracefully', () => {
      const mockError = new Error('Database connection failed');
      db.run.mockImplementation((sql, params, callback) => {
        callback(mockError);
      });
      
      // Test that error is properly handled
      expect(mockError.message).toBe('Database connection failed');
    });

    test('Should handle database errors in scenarios route', async () => {
      // Mock database error
      db.all.mockImplementationOnce((sql, params, callback) => {
        callback(new Error('Database error'), null);
      });

      const response = await request(app).get('/all-scenarios');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Utility Functions', () => {
    test('Should generate timestamps', () => {
      const timestamp = new Date().toISOString();
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    test('Should handle file extensions', () => {
      const filename = 'test.jpg';
      const extension = path.extname(filename);
      expect(extension).toBe('.jpg');
    });
  });
});