/**
 * Cassini-Huygens MCP Server
 * Main server entry point
 */

const express = require('express');
const app = express();

// Configuration
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'cassini-huygens-mcp-server',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Cassini-Huygens MCP Server',
    version: '1.0.0',
    endpoints: {
      health: '/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Cassini-Huygens MCP Server running on port ${PORT}`);
});

module.exports = app;
