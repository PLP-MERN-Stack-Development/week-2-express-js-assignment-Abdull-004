module.exports = (err, req, res, next) => {
  console.error('ERROR:', err.message);
  console.error('STACK:', err.stack);
  
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error'
    }
  });
};