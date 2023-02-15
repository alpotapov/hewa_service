const globalErrorHandler = (f) => (req, res, next) => f(req, res).catch(next);

module.exports = globalErrorHandler;
