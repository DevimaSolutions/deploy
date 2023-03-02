import fs from 'node:fs/promises';

import { AbstractPackageManager } from './abstract.package-manager.js';
import { NpmPackageManager } from './npm.package-manager.js';
import { PackageManager } from './package-manager.js';
import { PnpmPackageManager } from './pnpm.package-manager.js';
import { YarnPackageManager } from './yarn.package-manager.js';

export class PackageManagerFactory {
  public static create(name: PackageManager | string): AbstractPackageManager {
    switch (name) {
      case PackageManager.NPM:
        return new NpmPackageManager();
      case PackageManager.YARN:
        return new YarnPackageManager();
      case PackageManager.PNPM:
        return new PnpmPackageManager();
      default:
        throw new Error(`Package manager ${name} is not managed.`);
    }
  }

  public static async find(): Promise<AbstractPackageManager> {
    try {
      const files = await fs.readdir(process.cwd());
      if (files.findIndex((filename) => filename === 'yarn.lock') > -1) {
        return this.create(PackageManager.YARN);
      } else if (files.findIndex((filename) => filename === 'pnpm-lock.yaml') > -1) {
        return this.create(PackageManager.PNPM);
      } else {
        return this.create(PackageManager.NPM);
      }
    } catch (e) {
      return this.create(PackageManager.NPM);
    }
  }
}
