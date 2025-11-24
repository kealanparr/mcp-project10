# 🔌 MCP Integration Documentation

## Overview
The Cassini-Huygens MCP Server implements the Model Context Protocol (MCP) to provide AI assistants with access to mission data through resources, prompts, and tools.

---

## Installation

Install the MCP server globally:
```bash
npm install -g .
```

Or run locally:
```bash
npm run mcp
```

---

## MCP Capabilities

### Resources (4 available)

Resources provide read-only access to mission data.

#### 1. All Mission Plan Entries
- **URI**: `cassini://mission-plan/all`
- **Description**: Complete Cassini-Huygens mission plan database (first 100 entries)
- **Format**: JSON

#### 2. Mission Teams
- **URI**: `cassini://metadata/teams`
- **Description**: List of all teams involved in the mission
- **Format**: JSON
- **Returns**: 15 unique teams

#### 3. Mission Targets
- **URI**: `cassini://metadata/targets`
- **Description**: List of all observation targets
- **Format**: JSON
- **Returns**: 47 unique targets

#### 4. Mission Statistics
- **URI**: `cassini://metadata/stats`
- **Description**: Statistical overview of the mission data
- **Format**: JSON
- **Returns**: Total entries, unique teams, targets, and SPASS types

---

### Prompts (3 available)

Prompts provide templated interactions with mission data.

#### 1. mission-summary
Get a summary of mission activities for a specific team or target.

**Arguments**:
- `team` (optional) - Team name (e.g., CAPS, ISS, RADAR)
- `target` (optional) - Target name (e.g., Saturn, Titan, Enceladus)

**Example**:
```json
{
  "name": "mission-summary",
  "arguments": {
    "team": "CAPS"
  }
}
```

#### 2. activity-details
Get detailed information about a specific mission activity.

**Arguments**:
- `id` (required) - Mission plan entry ID

**Example**:
```json
{
  "name": "activity-details",
  "arguments": {
    "id": 2
  }
}
```

#### 3. search-activities
Search mission activities by keyword.

**Arguments**:
- `query` (required) - Search query

**Example**:
```json
{
  "name": "search-activities",
  "arguments": {
    "query": "Saturn"
  }
}
```

---

### Tools (4 available)

Tools allow AI assistants to query mission data programmatically.

#### 1. get-mission-plan
Get mission plan entries with optional filters and pagination.

**Parameters**:
- `team` (string, optional) - Filter by team name
- `target` (string, optional) - Filter by target
- `date` (string, optional) - Filter by date
- `spass_type` (string, optional) - Filter by SPASS type
- `limit` (number, optional) - Maximum results (default: 100, max: 1000)
- `offset` (number, optional) - Pagination offset (default: 0)

**Example**:
```json
{
  "name": "get-mission-plan",
  "arguments": {
    "team": "CAPS",
    "limit": 10
  }
}
```

#### 2. get-activity-by-id
Get a single mission plan entry by ID.

**Parameters**:
- `id` (number, required) - Mission plan entry ID

**Example**:
```json
{
  "name": "get-activity-by-id",
  "arguments": {
    "id": 2
  }
}
```

#### 3. search-activities
Search mission activities by keyword in title or description.

**Parameters**:
- `query` (string, required) - Search query
- `limit` (number, optional) - Maximum results (default: 100, max: 1000)

**Example**:
```json
{
  "name": "search-activities",
  "arguments": {
    "query": "Saturn",
    "limit": 20
  }
}
```

#### 4. get-metadata
Get mission metadata (teams, targets, spass-types, or stats).

**Parameters**:
- `type` (string, optional) - Type of metadata to retrieve: `teams`, `targets`, `spass-types`, or `stats` (default: stats)

**Example**:
```json
{
  "name": "get-metadata",
  "arguments": {
    "type": "teams"
  }
}
```

---

## Using the MCP Server

### Configuration

Add to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "cassini-huygens": {
      "command": "node",
      "args": ["/path/to/mcp-project10/mcp-server.js"]
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "cassini-huygens": {
      "command": "cassini-mcp-server"
    }
  }
}
```

### Testing

Run the test suite:
```bash
node test-mcp.js
```

**Test Results**:
- ✅ Connection established
- ✅ 4 resources discovered
- ✅ 4 tools available
- ✅ 3 prompts available
- ✅ Resource reading working
- ✅ Prompt generation working

---

## Architecture

### Components

**MCP Server** (`lib/services/mcpServer.js`):
- Implements MCP protocol
- Handles resources, prompts, and tools
- Uses stdio transport for communication

**Database Service** (`lib/services/database.js`):
- SQLite3 connection management
- Query execution

**Models** (`lib/models/MasterPlan.js`):
- Data access layer
- CRUD operations
- Search and filtering

### Data Flow

```
MCP Client (AI Assistant)
    ↓
stdio transport
    ↓
MCP Server (mcpServer.js)
    ↓
MasterPlan Model
    ↓
Database Service
    ↓
SQLite Database (master_plan.db)
```

---

## Mission Data

### Database Statistics
- **Total Entries**: 61,874 mission plan entries
- **Teams**: 15 unique teams (CAPS, CDA, CIRS, INMS, ISS, MAG, MIMI, MP, PROBE, RADAR, RPWS, RSS, UVIS, VIMS)
- **Targets**: 47 unique targets (Saturn, Titan, Enceladus, etc.)
- **SPASS Types**: 6 types
- **Date Range**: 2004-2017 (Cassini mission duration)

### Entry Structure
Each mission plan entry contains:
- ID, start time (UTC), duration
- Date, team, SPASS type
- Target, request name
- Library definition, title, description

---

## Development

### Adding New Resources
1. Add resource definition in `ListResourcesRequestSchema` handler
2. Implement resource reading in `ReadResourceRequestSchema` handler
3. Update documentation

### Adding New Prompts
1. Add prompt definition in `ListPromptsRequestSchema` handler
2. Implement prompt generation in `GetPromptRequestSchema` handler
3. Update documentation

### Adding New Tools
1. Add tool definition in `ListToolsRequestSchema` handler
2. Implement tool logic in `CallToolRequestSchema` handler
3. Update documentation

---

## Troubleshooting

### Server won't start
- Check database file exists at `data/master_plan.db`
- Verify Node.js version (14+)
- Check MCP SDK installation: `npm list @modelcontextprotocol/sdk`

### Connection issues
- Ensure stdio transport is configured correctly
- Check for errors in stderr output
- Verify MCP client configuration

### Query errors
- Validate argument types match schema
- Check filter values are valid
- Verify limit/offset are within bounds

---

## References

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP SDK GitHub](https://github.com/modelcontextprotocol/typescript-sdk)
- [Cassini Mission Information](https://solarsystem.nasa.gov/missions/cassini/)
