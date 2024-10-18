const { ConvexService } = require('../services/convexService');
const { RedisService } = require('../services/redisService');
const logger = require('../utils/logger');

exports.storeMemory = async (req, res) => {
  try {
    const { key, value } = req.body;
    await ConvexService.storeMemory(key, value);
    await RedisService.set(key, JSON.stringify(value));
    res.status(201).json({ message: 'Memory stored successfully' });
  } catch (error) {
    logger.error('Error storing memory:', error);
    res.status(500).json({ error: 'Failed to store memory' });
  }
};

exports.retrieveMemory = async (req, res) => {
  try {
    const { key } = req.params;
    const cachedValue = await RedisService.get(key);
    if (cachedValue) {
      return res.json({ value: JSON.parse(cachedValue) });
    }
    const value = await ConvexService.retrieveMemory(key);
    if (value) {
      await RedisService.set(key, JSON.stringify(value));
    }
    res.json({ value });
  } catch (error) {
    logger.error('Error retrieving memory:', error);
    res.status(500).json({ error: 'Failed to retrieve memory' });
  }
};

exports.updateMemory = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    await ConvexService.updateMemory(key, value);
    await RedisService.set(key, JSON.stringify(value));
    res.json({ message: 'Memory updated successfully' });
  } catch (error) {
    logger.error('Error updating memory:', error);
    res.status(500).json({ error: 'Failed to update memory' });
  }
};

exports.deleteMemory = async (req, res) => {
  try {
    const { key } = req.params;
    await ConvexService.deleteMemory(key);
    await RedisService.del(key);
    res.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    logger.error('Error deleting memory:', error);
    res.status(500).json({ error: 'Failed to delete memory' });
  }
};

exports.listMemories = async (req, res) => {
  try {
    const memories = await ConvexService.listMemories();
    res.json(memories);
  } catch (error) {
    logger.error('Error listing memories:', error);
    res.status(500).json({ error: 'Failed to list memories' });
  }
};