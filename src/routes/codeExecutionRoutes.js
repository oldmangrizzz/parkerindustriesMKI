const express = require('express');
const { executeCode } = require('../controllers/codeExecutionController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.post('/', executeCode);

module.exports = router;