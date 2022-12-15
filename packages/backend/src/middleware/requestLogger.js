const requestLogger = (req, res, next) => {
  console.log(`${req.method} ${req.url} ${JSON.stringify(req.body)} ${JSON.stringify(req.query)}`);
  next();
};

module.exports = { requestLogger };
