import { createRequire } from 'node:module';
import { join } from 'node:path';

import { PackageJson } from '../package-managers/package-json.interface.js';

const require = createRequire(import.meta.url);
export const packageInfo = require(join(process.cwd(), 'package.json')) as PackageJson;
