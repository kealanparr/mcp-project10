# 📊 Database Schema Documentation

## Overview
The Cassini-Huygens mission plan database contains 61,874 records of mission activities stored in a single table.

**Database Location**: `data/master_plan.db`
**Database Type**: SQLite3

---

## Tables

### `master_plan`
Primary table containing all Cassini-Huygens mission plan entries.

#### Schema

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier for each mission plan entry |
| `start_time_utc` | TEXT | NOT NULL | UTC timestamp when the activity starts |
| `duration` | TEXT | - | Duration of the activity |
| `date` | TEXT | - | Date of the activity |
| `team` | TEXT | - | Team responsible for the activity (e.g., CAPS, CDA) |
| `spass_type` | TEXT | - | Type of SPASS activity (e.g., Non-SPASS) |
| `target` | TEXT | - | Target of the observation or activity |
| `request_name` | TEXT | - | Name of the request (e.g., SURVEY) |
| `library_definition` | TEXT | - | Library definition category |
| `title` | TEXT | - | Title of the activity |
| `description` | TEXT | - | Detailed description of the activity |

#### Indexes

- `idx_date` - Index on `date` column for efficient date-based queries
- `idx_team` - Index on `team` column for filtering by team
- `idx_target` - Index on `target` column for filtering by observation target
- `idx_spass_type` - Index on `spass_type` column for filtering by SPASS type

#### Sample Data

```
ID: 2
Start Time: 2004-135T18:40:00
Duration: 000T09:22:00
Date: 14-May-04
Team: CAPS
SPASS Type: Non-SPASS
Target: Saturn
Request Name: SURVEY
Library Definition: Magnetospheric survey
Title: MAPS Survey
Description: MAPS magnetospheric survey
```

---

## Relationships

The database currently has a single table with no foreign key relationships. All mission plan data is self-contained within the `master_plan` table.

---

## Data Statistics

- **Total Records**: 61,874 mission plan entries
- **Indexed Columns**: date, team, target, spass_type

---

## Notes

- Time format: ISO 8601 with day-of-year notation (e.g., 2004-135T18:40:00)
- Duration format: Days, hours, minutes, seconds (e.g., 000T09:22:00)
- Date format: DD-MMM-YY (e.g., 14-May-04)
