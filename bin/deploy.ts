#!/usr/bin/env node

import { program } from 'commander';

import { CommandLoader } from '../commands/command.loader.js';
import { packageInfo } from '../lib/utils/package-info.js';

const bootstrap = () => {
  program
    .version(packageInfo.version, '-v, --version', 'Output the current version.')
    .name('ds-deploy')
    .description('CLI tool for deployment JS projects via SSH.')
    .usage('<command> [options]')
    .helpOption('-h, --help', 'Output usage information.');

  CommandLoader.load(program);

  program.parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
};

bootstrap();
