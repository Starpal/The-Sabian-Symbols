// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  'circular-natal-horoscope-js': require.resolve('circular-natal-horoscope-js/dist/index.js'),
};

module.exports = config;
