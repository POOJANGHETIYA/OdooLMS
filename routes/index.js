var express = require('express');
var router = express.Router();

// GET home page.
router.get('/', function(req, res, next) {
  try {
    res.status(200).json({message: "Welcome to BookWize API"});    
} catch (error) {
    return res.status(500).json({error: error.message});
  }
});

// health check
router.get('/health', function(req, res, next) {
  try {
    res.status(200).json({message: "BookWize Server is up and running"});
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});

module.exports = router;