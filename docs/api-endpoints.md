# 🌐 API Endpoints Documentation

## Base URL
```
http://localhost:3000
```

---

## Health & Info Endpoints

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "cassini-huygens-mcp-server",
  "timestamp": "2025-11-24T21:58:15.928Z",
  "database": "connected"
}
```

### GET /
Root endpoint with service information.

**Response:**
```json
{
  "message": "Cassini-Huygens MCP Server",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "missionPlan": "/api/mission-plan",
    "metadata": "/api/metadata"
  }
}
```

---

## Mission Plan Endpoints

### GET /api/mission-plan
Get mission plan entries with optional filters and pagination.

**Query Parameters:**
- `team` (string, optional) - Filter by team name
- `target` (string, optional) - Filter by target
- `date` (string, optional) - Filter by date
- `spass_type` (string, optional) - Filter by SPASS type
- `limit` (number, optional, default: 100, max: 1000) - Maximum results
- `offset` (number, optional, default: 0) - Pagination offset

**Example Request:**
```bash
curl "http://localhost:3000/api/mission-plan?team=CAPS&limit=2"
```

**Response:**
```json
{
  "data": [
    {
      "id": 2,
      "start_time_utc": "2004-135T18:40:00",
      "duration": "000T09:22:00",
      "date": "14-May-04",
      "team": "CAPS",
      "spass_type": "Non-SPASS",
      "target": "Saturn",
      "request_name": "SURVEY",
      "library_definition": "Magnetospheric survey",
      "title": "MAPS Survey",
      "description": "MAPS magnetospheric survey"
    }
  ],
  "pagination": {
    "total": 3361,
    "limit": 2,
    "offset": 0,
    "count": 2
  },
  "filters": {
    "team": "CAPS"
  }
}
```

**Validation:**
- Limit must be between 1 and 1000
- Offset must be non-negative
- Only allowed filter parameters: team, target, date, spass_type, limit, offset

---

### GET /api/mission-plan/:id
Get a single mission plan entry by ID.

**Path Parameters:**
- `id` (number, required) - Mission plan entry ID

**Example Request:**
```bash
curl "http://localhost:3000/api/mission-plan/2"
```

**Response:**
```json
{
  "data": {
    "id": 2,
    "start_time_utc": "2004-135T18:40:00",
    "duration": "000T09:22:00",
    "date": "14-May-04",
    "team": "CAPS",
    "spass_type": "Non-SPASS",
    "target": "Saturn",
    "request_name": "SURVEY",
    "library_definition": "Magnetospheric survey",
    "title": "MAPS Survey",
    "description": "MAPS magnetospheric survey"
  }
}
```

**Error Response (404):**
```json
{
  "error": "Not Found",
  "message": "Mission plan entry with id 999999 not found"
}
```

**Validation:**
- ID must be a positive integer

---

### GET /api/mission-plan/search/text
Search mission plan entries by text in title or description.

**Query Parameters:**
- `q` (string, required) - Search query (min 2 chars, max 200 chars)
- `limit` (number, optional, default: 100, max: 1000) - Maximum results

**Example Request:**
```bash
curl "http://localhost:3000/api/mission-plan/search/text?q=Saturn&limit=2"
```

**Response:**
```json
{
  "data": [
    {
      "id": 3,
      "start_time_utc": "2004-135T18:40:00",
      "duration": "025T20:57:59",
      "date": "14-May-04",
      "team": "CDA",
      "spass_type": "Non-SPASS",
      "target": "DustRAM direction",
      "request_name": "SURVEY",
      "library_definition": "Magnetospheric survey",
      "title": "dust exploration - saturn",
      "description": "for prograde dust (Saturn cent.): -z2E, -x 21;-18.6   AM=52"
    }
  ],
  "query": "Saturn",
  "count": 2
}
```

**Validation:**
- Search query is required
- Must be at least 2 characters
- Cannot exceed 200 characters

---

## Metadata Endpoints

### GET /api/metadata/teams
Get all unique team names.

**Example Request:**
```bash
curl "http://localhost:3000/api/metadata/teams"
```

**Response:**
```json
{
  "data": ["CAPS", "CDA", "CIRS", "INMS", "ISS", "MAG", "MIMI", "MP", "PROBE", "RADAR", "RPWS", "RSS", "UVIS", "VIMS", "team"],
  "count": 15
}
```

---

### GET /api/metadata/targets
Get all unique targets.

**Example Request:**
```bash
curl "http://localhost:3000/api/metadata/targets"
```

**Response:**
```json
{
  "data": ["Aegaeon", "Anthe", "Atlas", "Calypso", "Daphnis", "Dione", ...],
  "count": 47
}
```

---

### GET /api/metadata/spass-types
Get all unique SPASS types.

**Example Request:**
```bash
curl "http://localhost:3000/api/metadata/spass-types"
```

**Response:**
```json
{
  "data": ["Non-SPASS", "SPASS", ...],
  "count": 6
}
```

---

### GET /api/metadata/stats
Get database statistics.

**Example Request:**
```bash
curl "http://localhost:3000/api/metadata/stats"
```

**Response:**
```json
{
  "data": {
    "totalEntries": 61874,
    "uniqueTeams": 15,
    "uniqueTargets": 47,
    "uniqueSpassTypes": 6
  }
}
```

---

## Error Responses

### 400 Bad Request
Invalid request parameters.

```json
{
  "error": "Bad Request",
  "message": "Limit must be a positive integer"
}
```

### 404 Not Found
Resource not found.

```json
{
  "error": "Not Found",
  "message": "Mission plan entry with id 999999 not found"
}
```

### 500 Internal Server Error
Server error.

```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Testing

Start the server:
```bash
npm start
```

Test endpoints:
```bash
# Health check
curl http://localhost:3000/health

# Get mission plan with filters
curl "http://localhost:3000/api/mission-plan?team=CAPS&limit=5"

# Get by ID
curl http://localhost:3000/api/mission-plan/2

# Search
curl "http://localhost:3000/api/mission-plan/search/text?q=Saturn&limit=5"

# Get teams
curl http://localhost:3000/api/metadata/teams

# Get stats
curl http://localhost:3000/api/metadata/stats
```
