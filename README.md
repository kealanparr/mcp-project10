# Cassini-Huygens MCP Server

A Model Context Protocol (MCP) server providing AI assistants with access to 61,874 mission plan entries from the Cassini-Huygens space mission.

## Features

- **MCP Protocol Support**: Full implementation of resources, prompts, and tools
- **RESTful API**: 9 HTTP endpoints for mission data access
- **SQLite Database**: 61,874 mission plan entries from 2004-2017
- **Comprehensive Testing**: 29 unit and integration tests
- **Full Documentation**: API docs, MCP integration guide, and model references

## Quick Start

### Installation

```bash
npm install
```

### Run REST API Server

```bash
npm start
```

Server runs on `http://localhost:3000`

### Run MCP Server

```bash
npm run mcp
```

### Run Tests

```bash
npm test
```

## REST API Usage

### Health Check
```bash
curl http://localhost:3000/health
```

### Get Mission Plan Entries
```bash
# Get first 10 entries
curl "http://localhost:3000/api/mission-plan?limit=10"

# Filter by team
curl "http://localhost:3000/api/mission-plan?team=CAPS&limit=5"

# Get by ID
curl http://localhost:3000/api/mission-plan/2
```

### Search
```bash
curl "http://localhost:3000/api/mission-plan/search/text?q=Saturn&limit=5"
```

### Metadata
```bash
# Get all teams
curl http://localhost:3000/api/metadata/teams

# Get statistics
curl http://localhost:3000/api/metadata/stats
```

## MCP Integration

### Configuration

Add to your MCP client config (e.g., Claude Desktop):

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

### MCP Capabilities

**Resources (4)**:
- `cassini://mission-plan/all` - All mission entries
- `cassini://metadata/teams` - Team list
- `cassini://metadata/targets` - Target list
- `cassini://metadata/stats` - Statistics

**Prompts (3)**:
- `mission-summary` - Filtered activity summary
- `activity-details` - Specific activity info
- `search-activities` - Keyword search

**Tools (4)**:
- `get-mission-plan` - Query with filters
- `get-activity-by-id` - Get by ID
- `search-activities` - Text search
- `get-metadata` - Get metadata

## Project Structure

```
.
├── data/
│   └── master_plan.db          # SQLite database (61,874 entries)
├── docs/
│   ├── api-endpoints.md        # API documentation
│   ├── database-schema.md      # Database schema
│   ├── mcp-integration.md      # MCP guide
│   ├── models-api.md           # Model reference
│   └── logs/                   # Session logs
├── lib/
│   ├── middleware/
│   │   ├── errorHandler.js    # Error handling
│   │   └── validation.js      # Request validation
│   ├── models/
│   │   └── MasterPlan.js       # Data model
│   ├── routes/
│   │   ├── metadata.js         # Metadata routes
│   │   └── missionPlan.js      # Mission plan routes
│   └── services/
│       ├── database.js         # Database service
│       └── mcpServer.js        # MCP server
├── tests/
│   ├── api/
│   │   └── endpoints.test.js   # API integration tests
│   └── models/
│       └── MasterPlan.test.js  # Model unit tests
├── mcp-server.js               # MCP entry point
├── server.js                   # REST API entry point
└── package.json
```

## Database

### Statistics
- **Total Entries**: 61,874
- **Teams**: 15 (CAPS, CDA, CIRS, INMS, ISS, MAG, MIMI, MP, PROBE, RADAR, RPWS, RSS, UVIS, VIMS)
- **Targets**: 47 (Saturn, Titan, Enceladus, etc.)
- **SPASS Types**: 6
- **Date Range**: 2004-2017

### Schema

```sql
CREATE TABLE master_plan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    start_time_utc TEXT NOT NULL,
    duration TEXT,
    date TEXT,
    team TEXT,
    spass_type TEXT,
    target TEXT,
    request_name TEXT,
    library_definition TEXT,
    title TEXT,
    description TEXT
);
```

## API Endpoints

### Core Endpoints
- `GET /` - Service information
- `GET /health` - Health check

### Mission Plan
- `GET /api/mission-plan` - List entries (with filters)
- `GET /api/mission-plan/:id` - Get by ID
- `GET /api/mission-plan/search/text` - Text search

### Metadata
- `GET /api/metadata/teams` - List teams
- `GET /api/metadata/targets` - List targets
- `GET /api/metadata/spass-types` - List SPASS types
- `GET /api/metadata/stats` - Get statistics

## Testing

Run the test suite:
```bash
npm test
```

**Test Coverage**:
- 12 model unit tests
- 17 API integration tests
- 29 total tests passing

## Development

### Requirements
- Node.js 14+
- npm 6+

### Dependencies
- `express` - Web framework
- `sqlite3` - Database driver
- `@modelcontextprotocol/sdk` - MCP implementation

### Dev Dependencies
- `jest` - Testing framework
- `supertest` - API testing

### Scripts
- `npm start` - Start REST API server
- `npm run mcp` - Start MCP server
- `npm test` - Run tests

## Documentation

- [API Endpoints](docs/api-endpoints.md) - Complete API reference
- [Database Schema](docs/database-schema.md) - Database structure
- [MCP Integration](docs/mcp-integration.md) - MCP usage guide
- [Models API](docs/models-api.md) - Model reference

## Mission Information

The Cassini-Huygens mission was a joint NASA/ESA/ASI mission to explore Saturn and its moons. Launched in 1997, it operated from 2004 to 2017, providing unprecedented insights into the Saturnian system.

**Key Achievements**:
- Discovered liquid water on Enceladus
- Landed Huygens probe on Titan
- Studied Saturn's rings in detail
- Observed seasonal changes on Titan
- Completed 294 orbits of Saturn

## License

ISC

## Contributing

This project was developed iteratively with detailed session logs available in `docs/logs/`.

## Support

For issues or questions, please refer to the documentation in the `docs/` directory.
