/**
 * Cassini-Huygens MCP Server
 * Main server entry point
 */

const express = require('express');
const app = express();
const db = require('./lib/services/database');
const missionPlanRoutes = require('./lib/routes/missionPlan');
const metadataRoutes = require('./lib/routes/metadata');
const { errorHandler, notFoundHandler } = require('./lib/middleware/errorHandler');

// Configuration
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database on startup
db.connect()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection failed:', err));

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'cassini-huygens-mcp-server',
    timestamp: new Date().toISOString(),
    database: db.getConnection() ? 'connected' : 'disconnected'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Cassini-Huygens MCP Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      missionPlan: '/api/mission-plan',
      metadata: '/api/metadata'
    }
  });
});

// API Routes
app.use('/api/metadata', metadataRoutes);
app.use('/api/mission-plan', missionPlanRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use(notFoundHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Cassini-Huygens MCP Server running on port ${PORT}`);
});

module.exports = app;
