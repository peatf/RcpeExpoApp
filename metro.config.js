const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure react-native-reanimated is properly configured
config.resolver.assetExts.push('bin');

module.exports = config;
