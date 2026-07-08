// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Forza Metro a usare il percorso corretto
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'circular-natal-horoscope-js') {
    return {
      filePath: require.resolve('circular-natal-horoscope-js/dist/index.js'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
