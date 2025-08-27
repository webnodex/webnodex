import type { Handler } from '../types.js';

export const healthHandler: Handler = (_req, res) => {
  res.json({ status: 'ok' });
};
