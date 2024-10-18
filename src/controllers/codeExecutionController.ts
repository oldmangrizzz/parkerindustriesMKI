import { Request, Response } from 'express';
import replitService from '../services/replitService';
import logger from '../utils/logger';

export const executeCode = async (req: Request, res: Response) => {
  try {
    const { code, language, replId } = req.body;

    // Input validation
    if (!code || !language || !replId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Check cache first
    const cachedResult = await replitService.getCachedData(`execution:${replId}:${code}`);
    if (cachedResult) {
      return res.json({ result: cachedResult, cached: true });
    }

    const result = await replitService.executeCode(replId, language, code);
    
    // Cache the result
    replitService.setCachedData(`execution:${replId}:${code}`, result);

    // Track memory usage
    replitService.trackMemoryUsage(`execution:${replId}`, JSON.stringify(result).length);

    res.json({ result, cached: false });
  } catch (error) {
    logger.error('Error executing code:', error);
    res.status(500).json({ error: 'Code execution failed' });
  }
};

export const getMemoryUsage = async (req: Request, res: Response) => {
  try {
    const usage = replitService.getMemoryUsage();
    res.json({ memoryUsage: usage });
  } catch (error) {
    logger.error('Error getting memory usage:', error);
    res.status(500).json({ error: 'Failed to get memory usage' });
  }
};