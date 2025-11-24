/**
 * Request Validation Middleware
 * Validates query parameters and request data
 */

/**
 * Validate pagination parameters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
function validatePagination(req, res, next) {
  const { limit, offset } = req.query;

  if (limit !== undefined) {
    const parsedLimit = parseInt(limit);
    if (isNaN(parsedLimit) || parsedLimit < 1) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Limit must be a positive integer'
      });
    }
    if (parsedLimit > 1000) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Limit cannot exceed 1000'
      });
    }
  }

  if (offset !== undefined) {
    const parsedOffset = parseInt(offset);
    if (isNaN(parsedOffset) || parsedOffset < 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Offset must be a non-negative integer'
      });
    }
  }

  next();
}

/**
 * Validate ID parameter
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
function validateId(req, res, next) {
  const { id } = req.params;
  const parsedId = parseInt(id);

  if (isNaN(parsedId) || parsedId < 1) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'ID must be a positive integer'
    });
  }

  next();
}

/**
 * Validate search query
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
function validateSearch(req, res, next) {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Search query "q" is required and must be a string'
    });
  }

  if (q.trim().length < 2) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Search query must be at least 2 characters'
    });
  }

  if (q.length > 200) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Search query cannot exceed 200 characters'
    });
  }

  next();
}

/**
 * Validate filter parameters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
function validateFilters(req, res, next) {
  const allowedFilters = ['team', 'target', 'date', 'spass_type', 'limit', 'offset'];
  const providedFilters = Object.keys(req.query);

  const invalidFilters = providedFilters.filter(f => !allowedFilters.includes(f));

  if (invalidFilters.length > 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: `Invalid filter parameters: ${invalidFilters.join(', ')}`,
      allowedFilters
    });
  }

  next();
}

module.exports = {
  validatePagination,
  validateId,
  validateSearch,
  validateFilters
};
