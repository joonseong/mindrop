const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * pnpm 모노레포라 루트를 감시하고, 이 앱의 node_modules를 먼저 찾는다.
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  watchFolders: [path.resolve(__dirname, '../..')],
  resolver: {
    extraNodeModules: new Proxy(
      {},
      { get: (target, name) => (name in target ? target[name] : path.join(__dirname, `node_modules/${name}`)) },
    ),
    unstable_enablePackageExports: true,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
