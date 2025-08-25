import path from 'node:path';
import fs from 'node:fs';
import { WebnodexConfigSchema, type WebnodexConfig } from './schemas/config.js';
import { logger, logZodError } from './logger.js';

let currentConfig: WebnodexConfig | null = null;

/**
 * Reads and validates the Webnodex configuration file.
 * @param fullPath The absolute path to the configuration file.
 * @returns The parsed and validated configuration object.
 */
const readConfigFile = function (fullPath: string): WebnodexConfig {
  const rawConfig = fs.readFileSync(fullPath, 'utf-8');
  const configFile = JSON.parse(rawConfig);

  // validate config
  const config = WebnodexConfigSchema.safeParse(configFile);

  if (!config.success) {
    logZodError(config.error);
    throw new Error('Invalid config file');
  }

  return config.data;
};

/**
 * Loads the Webnodex configuration file.
 * @param configPath The path to the configuration file.
 * @returns The parsed configuration object.
 */
export const loadConfig = function (configPath?: string): WebnodexConfig {
  let fullConfigPath: string;

  if (configPath) {
    fullConfigPath = path.isAbsolute(configPath)
      ? configPath
      : path.resolve(process.cwd(), configPath);
  } else {
    fullConfigPath = path.resolve(process.cwd(), 'webnodex.config.json');
  }

  // check if config file exists
  if (!fs.existsSync(fullConfigPath)) {
    logger.error(`Config file not found: ${fullConfigPath}`);
    throw new Error(`Config file not found: ${fullConfigPath}`);
  }

  try {
    currentConfig = readConfigFile(fullConfigPath);
    logger.info('Config loaded successfully:');
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error loading config file: ${error.message}`);
    } else {
      logger.error('Unknown error loading config file');
    }
    throw error;
  }

  // watch for changes
  fs.watchFile(fullConfigPath, { interval: 1000 }, () => {
    try {
      const updatedConfig = readConfigFile(fullConfigPath);
      currentConfig = updatedConfig;
      logger.info('Config file updated successfully:');
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error updating config file: ${error.message}`);
      } else {
        logger.error('Unknown error updating config file');
      }
      throw error;
    }
  });

  return currentConfig;
};

/**
 * Always get the latest valid version of config
 */
export const getConfig = function (): WebnodexConfig {
  if (!currentConfig) {
    logger.error('Config not loaded');
    throw new Error('Config not loaded');
  }
  return currentConfig;
};
