import path from 'node:path';
import fs from 'node:fs';
import { WebnodexConfigSchema, type WebnodexConfig } from './schemas/config.js';
import z from 'zod';

/**
 * Loads the Webnodex configuration file.
 * @param configPath The path to the configuration file.
 * @returns The parsed configuration object.
 */
export const loadConfig = function (configPath?: string): WebnodexConfig {
  try {
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
      console.error(`Config file not found: ${fullConfigPath}`);
      throw new Error(`Config file not found: ${fullConfigPath}`);
    }

    // read and parse config file
    const rawConfig = fs.readFileSync(fullConfigPath, 'utf-8');
    const configFile = JSON.parse(rawConfig);

    // validate config
    const config = WebnodexConfigSchema.safeParse(configFile);

    if (!config.success) {
      console.error(z.prettifyError(config.error));
      throw new Error('Invalid config file');
    }

    console.log('Config loaded successfully:');
    return config.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error loading config file: ${error.message}`);
    } else {
      console.error('Unknown error loading config file', error);
    }
    throw error;
  }
};
