function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, _req, res, _next) {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Validation failed', errors: err.errors });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate value error', detail: err.keyValue });
  }

  console.error(err);
  return res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error',
  });
}

module.exports = { notFound, errorHandler };
