import { createRequire } from 'module';

import { PackageJson } from '../package-managers/package-json.interface';

const require = createRequire(import.meta.url);
export const packageInfo = require('../../package.json') as PackageJson;
