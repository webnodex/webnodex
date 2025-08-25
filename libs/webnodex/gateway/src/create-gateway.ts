import type { Application } from 'express';
import express from 'express';

/**
 * Creates an API-Gateway
 */
const createGateway = () => {
  const app: Application = express();

  return {
    app,
  };
};

export { createGateway };
