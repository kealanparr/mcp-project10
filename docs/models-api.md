# 📚 Models API Documentation

## Overview
Model classes provide database access for Cassini-Huygens mission data. All models use the DatabaseService for connection management.

---

## MasterPlan Model

Located at: `lib/models/MasterPlan.js`

### Data Structure

```javascript
{
  id: number,                    // Unique identifier
  start_time_utc: string,        // UTC timestamp (e.g., "2004-135T18:40:00")
  duration: string|null,         // Duration (e.g., "000T09:22:00")
  date: string|null,             // Date (e.g., "14-May-04")
  team: string|null,             // Team name (e.g., "CAPS")
  spass_type: string|null,       // SPASS type (e.g., "Non-SPASS")
  target: string|null,           // Target (e.g., "Saturn")
  request_name: string|null,     // Request name (e.g., "SURVEY")
  library_definition: string|null, // Library definition
  title: string|null,            // Activity title
  description: string|null       // Detailed description
}
```

### Methods

#### `findAll(filters, limit, offset)`
Find all master plan entries with optional filters.

**Parameters:**
- `filters` (Object) - Optional filter criteria
  - `filters.team` (string) - Filter by team
  - `filters.target` (string) - Filter by target
  - `filters.date` (string) - Filter by date
  - `filters.spass_type` (string) - Filter by SPASS type
- `limit` (number) - Maximum results (default: 100)
- `offset` (number) - Pagination offset (default: 0)

**Returns:** `Promise<Array>` - Array of master plan entries

**Example:**
```javascript
const entries = await MasterPlan.findAll({ team: 'CAPS' }, 50, 0);
```

---

#### `findById(id)`
Find a single master plan entry by ID.

**Parameters:**
- `id` (number) - Entry ID

**Returns:** `Promise<Object|null>` - Master plan entry or null

**Example:**
```javascript
const entry = await MasterPlan.findById(2);
```

---

#### `count(filters)`
Count total entries with optional filters.

**Parameters:**
- `filters` (Object) - Optional filter criteria (same as findAll)

**Returns:** `Promise<number>` - Total count

**Example:**
```javascript
const total = await MasterPlan.count({ team: 'CAPS' });
```

---

#### `getTeams()`
Get all unique team names.

**Returns:** `Promise<Array<string>>` - Array of team names

**Example:**
```javascript
const teams = await MasterPlan.getTeams();
// Returns: ['CAPS', 'CDA', 'CIRS', ...]
```

---

#### `getTargets()`
Get all unique targets.

**Returns:** `Promise<Array<string>>` - Array of target names

**Example:**
```javascript
const targets = await MasterPlan.getTargets();
// Returns: ['Saturn', 'Titan', 'Enceladus', ...]
```

---

#### `getSpassTypes()`
Get all unique SPASS types.

**Returns:** `Promise<Array<string>>` - Array of SPASS types

**Example:**
```javascript
const types = await MasterPlan.getSpassTypes();
```

---

#### `search(searchTerm, limit)`
Search entries by text in title or description.

**Parameters:**
- `searchTerm` (string) - Search term
- `limit` (number) - Maximum results (default: 100)

**Returns:** `Promise<Array>` - Array of matching entries

**Example:**
```javascript
const results = await MasterPlan.search('Saturn', 50);
```

---

## DatabaseService

Located at: `lib/services/database.js`

### Methods

#### `connect()`
Connect to the database.

**Returns:** `Promise<Database>` - Database connection

---

#### `getConnection()`
Get the current database connection.

**Returns:** `Database|null` - Current connection or null

---

#### `query(sql, params)`
Execute a SELECT query.

**Parameters:**
- `sql` (string) - SQL query
- `params` (Array) - Query parameters

**Returns:** `Promise<Array>` - Query results

---

#### `get(sql, params)`
Execute a query and return a single row.

**Parameters:**
- `sql` (string) - SQL query
- `params` (Array) - Query parameters

**Returns:** `Promise<Object|null>` - Single row or null

---

#### `run(sql, params)`
Execute a write query (INSERT, UPDATE, DELETE).

**Parameters:**
- `sql` (string) - SQL query
- `params` (Array) - Query parameters

**Returns:** `Promise<Object>` - Result with lastID and changes

---

#### `close()`
Close the database connection.

**Returns:** `Promise<void>`

---

## Usage Example

```javascript
const db = require('./lib/services/database');
const MasterPlan = require('./lib/models/MasterPlan');

async function example() {
  // Connect to database
  await db.connect();

  // Get all CAPS team entries
  const capsEntries = await MasterPlan.findAll({ team: 'CAPS' }, 10);

  // Search for Saturn-related activities
  const saturnActivities = await MasterPlan.search('Saturn', 20);

  // Get total count
  const total = await MasterPlan.count();

  // Close connection
  await db.close();
}
```

---

## Test Coverage

Database connectivity and model operations tested in `test-db.js`:
- ✅ Database connection
- ✅ Count total entries (61,874 records)
- ✅ Find by ID
- ✅ Get unique teams (15 teams)
- ✅ Get unique targets (47 targets)
- ✅ Filter by team
- ✅ Text search
