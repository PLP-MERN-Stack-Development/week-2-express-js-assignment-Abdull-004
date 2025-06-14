module.exports = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    const err = new Error('Unauthorized'); // Changed from 'error' to 'err'
    err.status = 401;
    return next(err);
  }
  next();
};