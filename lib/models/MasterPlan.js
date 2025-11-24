/**
 * MasterPlan Model
 * Represents a mission plan entry from the Cassini-Huygens mission
 */

const db = require('../services/database');

/**
 * @typedef {Object} MasterPlanEntry
 * @property {number} id - Unique identifier
 * @property {string} start_time_utc - UTC timestamp when activity starts
 * @property {string|null} duration - Duration of the activity
 * @property {string|null} date - Date of the activity
 * @property {string|null} team - Team responsible for the activity
 * @property {string|null} spass_type - Type of SPASS activity
 * @property {string|null} target - Target of the observation
 * @property {string|null} request_name - Name of the request
 * @property {string|null} library_definition - Library definition category
 * @property {string|null} title - Title of the activity
 * @property {string|null} description - Detailed description
 */

/**
 * MasterPlan model class for database operations
 */
class MasterPlan {
  /**
   * Find all master plan entries with optional filters
   * @param {Object} filters - Filter criteria
   * @param {string} [filters.team] - Filter by team
   * @param {string} [filters.target] - Filter by target
   * @param {string} [filters.date] - Filter by date
   * @param {string} [filters.spass_type] - Filter by SPASS type
   * @param {number} [limit=100] - Maximum number of results
   * @param {number} [offset=0] - Offset for pagination
   * @returns {Promise<MasterPlanEntry[]>} Array of master plan entries
   */
  static async findAll(filters = {}, limit = 100, offset = 0) {
    let sql = 'SELECT * FROM master_plan WHERE 1=1';
    const params = [];

    // Add filters dynamically
    if (filters.team) {
      sql += ' AND team = ?';
      params.push(filters.team);
    }
    if (filters.target) {
      sql += ' AND target = ?';
      params.push(filters.target);
    }
    if (filters.date) {
      sql += ' AND date = ?';
      params.push(filters.date);
    }
    if (filters.spass_type) {
      sql += ' AND spass_type = ?';
      params.push(filters.spass_type);
    }

    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    return await db.query(sql, params);
  }

  /**
   * Find a single master plan entry by ID
   * @param {number} id - Entry ID
   * @returns {Promise<MasterPlanEntry|null>} Master plan entry or null
   */
  static async findById(id) {
    const sql = 'SELECT * FROM master_plan WHERE id = ?';
    return await db.get(sql, [id]);
  }

  /**
   * Count total entries with optional filters
   * @param {Object} filters - Filter criteria
   * @param {string} [filters.team] - Filter by team
   * @param {string} [filters.target] - Filter by target
   * @param {string} [filters.date] - Filter by date
   * @param {string} [filters.spass_type] - Filter by SPASS type
   * @returns {Promise<number>} Total count
   */
  static async count(filters = {}) {
    let sql = 'SELECT COUNT(*) as count FROM master_plan WHERE 1=1';
    const params = [];

    if (filters.team) {
      sql += ' AND team = ?';
      params.push(filters.team);
    }
    if (filters.target) {
      sql += ' AND target = ?';
      params.push(filters.target);
    }
    if (filters.date) {
      sql += ' AND date = ?';
      params.push(filters.date);
    }
    if (filters.spass_type) {
      sql += ' AND spass_type = ?';
      params.push(filters.spass_type);
    }

    const result = await db.get(sql, params);
    return result ? result.count : 0;
  }

  /**
   * Get all unique teams
   * @returns {Promise<string[]>} Array of team names
   */
  static async getTeams() {
    const sql = 'SELECT DISTINCT team FROM master_plan WHERE team IS NOT NULL ORDER BY team';
    const rows = await db.query(sql);
    return rows.map(row => row.team);
  }

  /**
   * Get all unique targets
   * @returns {Promise<string[]>} Array of target names
   */
  static async getTargets() {
    const sql = 'SELECT DISTINCT target FROM master_plan WHERE target IS NOT NULL ORDER BY target';
    const rows = await db.query(sql);
    return rows.map(row => row.target);
  }

  /**
   * Get all unique SPASS types
   * @returns {Promise<string[]>} Array of SPASS types
   */
  static async getSpassTypes() {
    const sql = 'SELECT DISTINCT spass_type FROM master_plan WHERE spass_type IS NOT NULL ORDER BY spass_type';
    const rows = await db.query(sql);
    return rows.map(row => row.spass_type);
  }

  /**
   * Search entries by text in title or description
   * @param {string} searchTerm - Search term
   * @param {number} [limit=100] - Maximum number of results
   * @returns {Promise<MasterPlanEntry[]>} Array of matching entries
   */
  static async search(searchTerm, limit = 100) {
    const sql = `
      SELECT * FROM master_plan
      WHERE title LIKE ? OR description LIKE ?
      LIMIT ?
    `;
    const likePattern = `%${searchTerm}%`;
    return await db.query(sql, [likePattern, likePattern, limit]);
  }
}

module.exports = MasterPlan;
