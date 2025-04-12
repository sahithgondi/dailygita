// Learn more: https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('@react-native/metro-config');

/** @type {import('metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable CSS support
  isCSSEnabled: true,
});

// Fix the HTTPS issue by configuring server correctly
config.server = config.server || {};
config.server.https = true;

// Also support resolving to iOS localhost domains
config.resolver = config.resolver || {};
config.resolver.sourceExts = [...(config.resolver.sourceExts || []), 'mjs'];
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
};

// Export the merged configuration
module.exports = mergeConfig(getDefaultConfig(__dirname), config); 