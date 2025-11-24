/**
 * Mission Plan Routes
 * RESTful API endpoints for Cassini-Huygens mission data
 */

const express = require('express');
const router = express.Router();
const MasterPlan = require('../models/MasterPlan');
const { validatePagination, validateId, validateFilters } = require('../middleware/validation');

/**
 * GET /api/mission-plan/search/text
 * Search mission plan entries by text
 * Query params: q (search term), limit
 */
router.get('/search/text', async (req, res, next) => {
  try {
    const { q, limit = 100 } = req.query;

    if (!q) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Search term "q" is required'
      });
    }

    const parsedLimit = Math.min(parseInt(limit) || 100, 1000);
    const results = await MasterPlan.search(q, parsedLimit);

    res.json({
      data: results,
      query: q,
      count: results.length
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/mission-plan/:id
 * Get a single mission plan entry by ID
 */
router.get('/:id', validateId, async (req, res, next) => {
  try {
    const { id } = req.params;
    const entry = await MasterPlan.findById(parseInt(id));

    if (!entry) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Mission plan entry with id ${id} not found`
      });
    }

    res.json({
      data: entry
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/mission-plan
 * Get all mission plan entries with optional filters
 * Query params: team, target, date, spass_type, limit, offset
 */
router.get('/', [validateFilters, validatePagination], async (req, res, next) => {
  try {
    const { team, target, date, spass_type, limit = 100, offset = 0 } = req.query;

    // Build filters object
    const filters = {};
    if (team) filters.team = team;
    if (target) filters.target = target;
    if (date) filters.date = date;
    if (spass_type) filters.spass_type = spass_type;

    // Parse limit and offset
    const parsedLimit = Math.min(parseInt(limit) || 100, 1000);
    const parsedOffset = parseInt(offset) || 0;

    // Get data
    const [entries, total] = await Promise.all([
      MasterPlan.findAll(filters, parsedLimit, parsedOffset),
      MasterPlan.count(filters)
    ]);

    res.json({
      data: entries,
      pagination: {
        total,
        limit: parsedLimit,
        offset: parsedOffset,
        count: entries.length
      },
      filters: Object.keys(filters).length > 0 ? filters : null
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
