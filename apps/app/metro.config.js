const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

// 웹(React 18)과 앱(React 19)이 한 저장소에 있어, 루트에 있는 react-native가 루트의 React 18을 가져가지 않게
// react 계열은 언제나 이 앱의 node_modules에서 찾는다
const PINNED = ['react', 'react-dom', 'scheduler'];

/**
 * 모노레포라 루트를 감시하고, 이 앱의 node_modules를 먼저 찾는다.
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
    resolveRequest: (context, moduleName, platform) => {
      const pkg = moduleName.startsWith('@') ? moduleName.split('/').slice(0, 2).join('/') : moduleName.split('/')[0];
      if (PINNED.includes(pkg)) {
        return context.resolveRequest(
          { ...context, originModulePath: path.join(__dirname, 'index.js') },
          moduleName,
          platform,
        );
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
