function logger(req, res, next) {
  res.on('finish', () => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} request to: ${req.originalUrl} - Status: ${res.statusCode}`);
  });
  next();
}

module.exports = logger;
