const { VM } = require('vm2');
const logger = require('../utils/logger');
const { executeOnReplit } = require('../services/replitService');

exports.executeCode = async (req, res) => {
  try {
    const { code, useReplit } = req.body;

    if (useReplit) {
      const result = await executeOnReplit(code);
      return res.json({ result });
    }

    const vm = new VM({
      timeout: 1000,
      sandbox: {}
    });

    const result = vm.run(code);
    res.json({ result });
  } catch (error) {
    logger.error('Error executing code:', error);
    res.status(500).json({ error: 'Code execution failed' });
  }
};