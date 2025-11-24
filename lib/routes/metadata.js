/**
 * Metadata Routes
 * API endpoints for mission metadata (teams, targets, etc.)
 */

const express = require('express');
const router = express.Router();
const MasterPlan = require('../models/MasterPlan');

/**
 * GET /api/metadata/teams
 * Get all unique team names
 */
router.get('/teams', async (req, res, next) => {
  try {
    const teams = await MasterPlan.getTeams();

    res.json({
      data: teams,
      count: teams.length
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/metadata/targets
 * Get all unique targets
 */
router.get('/targets', async (req, res, next) => {
  try {
    const targets = await MasterPlan.getTargets();

    res.json({
      data: targets,
      count: targets.length
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/metadata/spass-types
 * Get all unique SPASS types
 */
router.get('/spass-types', async (req, res, next) => {
  try {
    const spassTypes = await MasterPlan.getSpassTypes();

    res.json({
      data: spassTypes,
      count: spassTypes.length
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/metadata/stats
 * Get database statistics
 */
router.get('/stats', async (req, res, next) => {
  try {
    const [total, teams, targets, spassTypes] = await Promise.all([
      MasterPlan.count(),
      MasterPlan.getTeams(),
      MasterPlan.getTargets(),
      MasterPlan.getSpassTypes()
    ]);

    res.json({
      data: {
        totalEntries: total,
        uniqueTeams: teams.length,
        uniqueTargets: targets.length,
        uniqueSpassTypes: spassTypes.length
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
