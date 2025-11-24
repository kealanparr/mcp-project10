/**
 * Database Connection Service
 * Manages SQLite3 database connections for the Cassini-Huygens mission data
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/**
 * Database service class for managing connections
 */
class DatabaseService {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, '../../data/master_plan.db');
  }

  /**
   * Connect to the database
   * @returns {Promise<sqlite3.Database>} Database connection
   */
  connect() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        return resolve(this.db);
      }

      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Database connection error:', err.message);
          reject(err);
        } else {
          console.log('Connected to master_plan database');
          resolve(this.db);
        }
      });
    });
  }

  /**
   * Get the current database connection
   * @returns {sqlite3.Database|null} Current database connection or null
   */
  getConnection() {
    return this.db;
  }

  /**
   * Execute a query with parameters
   * @param {string} sql - SQL query to execute
   * @param {Array} params - Query parameters
   * @returns {Promise<Array>} Query results
   */
  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject(new Error('Database not connected'));
      }

      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.error('Query error:', err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Execute a query and return a single row
   * @param {string} sql - SQL query to execute
   * @param {Array} params - Query parameters
   * @returns {Promise<Object|null>} Single row result or null
   */
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject(new Error('Database not connected'));
      }

      this.db.get(sql, params, (err, row) => {
        if (err) {
          console.error('Query error:', err.message);
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  /**
   * Execute a write query (INSERT, UPDATE, DELETE)
   * @param {string} sql - SQL query to execute
   * @param {Array} params - Query parameters
   * @returns {Promise<Object>} Result with lastID and changes
   */
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject(new Error('Database not connected'));
      }

      this.db.run(sql, params, function(err) {
        if (err) {
          console.error('Query error:', err.message);
          reject(err);
        } else {
          resolve({
            lastID: this.lastID,
            changes: this.changes
          });
        }
      });
    });
  }

  /**
   * Close the database connection
   * @returns {Promise<void>}
   */
  close() {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return resolve();
      }

      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
          reject(err);
        } else {
          console.log('Database connection closed');
          this.db = null;
          resolve();
        }
      });
    });
  }
}

// Export singleton instance
module.exports = new DatabaseService();
