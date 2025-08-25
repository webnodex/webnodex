import type { Application, NextFunction, Request, Response } from 'express';
import express from 'express';
import { getConfig, loadConfig } from './load-config.js';
import {
  GatewayOptionsSchema,
  type GatewayOptions,
} from './schemas/gateway.js';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { logger, logZodError } from './logger.js';

/**
 * Creates an API-Gateway
 */
export const createGateway = (optionsInput: GatewayOptions) => {
  // validate options
  const options = GatewayOptionsSchema.safeParse(optionsInput);

  if (!options.success) {
    logZodError(options.error);
    throw new Error('Invalid gateway options');
  }

  // start hot reloading config
  loadConfig(options.data.configPath);

  const app: Application = express();

  app.use(express.json());

  // proxy all registered services
  app.use('/:service', (req: Request, res: Response, next: NextFunction) => {
    const { service } = req.params;
    const config = getConfig();

    const target = config.services[service];
    if (!target) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    return createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: {
        [`^/${service}`]: '',
      },
    })(req, res, next);
  });

  const start = () => {
    const port = options.data.port;

    return app.listen(port, () => {
      logger.info(`Gateway listening on http://localhost:${port}`);
    });
  };

  return {
    app,
    start,
  };
};
