const express = require('express');
const { storeMemory, retrieveMemory, updateMemory, deleteMemory, listMemories } = require('../controllers/memoryController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.post('/store', storeMemory);
router.get('/retrieve/:key', retrieveMemory);
router.put('/update/:key', updateMemory);
router.delete('/delete/:key', deleteMemory);
router.get('/list', listMemories);

module.exports = router;