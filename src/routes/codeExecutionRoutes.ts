import express from 'express';
import { executeCode, getMemoryUsage } from '../controllers/codeExecutionController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.post('/execute', executeCode);
router.get('/memory-usage', getMemoryUsage);

export default router;