#!/usr/bin/env node

/**
 * Cassini-Huygens MCP Server Entry Point
 * Starts the MCP server using stdio transport
 */

const CassiniMCPServer = require('./lib/services/mcpServer');

const server = new CassiniMCPServer();

// Start the server
server.start().catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('\nShutting down MCP server...');
  process.exit(0);
});
