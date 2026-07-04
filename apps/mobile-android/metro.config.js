const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Temukan akar folder proyek ini
const projectRoot = __dirname;
// Temukan akar folder monorepo (Turborepo)
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Pantau semua file di dalam monorepo (termasuk packages/core)
config.watchFolders = [workspaceRoot];
// 2. Beri tahu Metro urutan mencari node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
// 3. Matikan pencarian hierarki agar tidak bentrok dengan Turborepo
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
