import type { Application, Request, Response } from 'express';
import express from 'express';
import { loadConfig } from './load-config.js';
import {
  GatewayOptionsSchema,
  type GatewayOptions,
} from './schemas/gateway.js';
import z from 'zod';

/**
 * Creates an API-Gateway
 */
export const createGateway = (optionsInput: GatewayOptions) => {
  // validate options
  const options = GatewayOptionsSchema.safeParse(optionsInput);

  if (!options.success) {
    console.error(z.prettifyError(options.error));
    throw new Error('Invalid gateway options');
  }

  const app: Application = express();
  const config = loadConfig(options.data.configPath);

  app.use(express.json());

  // services stub
  Object.entries(config.services).forEach(([name, url]) => {
    app.get(`/api/${name}`, (_req: Request, res: Response) => {
      res.json({ message: `Proxying request to ${url}` });
    });
  });

  const start = () => {
    const port = options.data.port;

    return app.listen(port, () => {
      console.log(`🚀 Gateway listening on http://localhost:${port}`);
    });
  };

  return {
    app,
    start,
  };
};
