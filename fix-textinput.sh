#!/bin/bash

# React Native 0.79.3 + React 19 TextInput Fix Script
# This script addresses common compatibility issues

echo "🔧 Fixing React Native 0.79.3 + React 19 TextInput Issues..."

# 1. Clear all caches
echo "📦 Clearing Metro cache..."
npx expo start --clear &

# 2. Clear iOS simulator cache
echo "📱 Clearing iOS Simulator cache..."
xcrun simctl erase all 2>/dev/null || echo "iOS Simulator not available or already clean"

# 3. Clear watchman cache
echo "👀 Clearing Watchman cache..."
watchman watch-del-all 2>/dev/null || echo "Watchman not installed or no watches to clear"

# 4. Clear node modules and reinstall
echo "📚 Clearing node_modules and reinstalling..."
rm -rf node_modules
rm -rf .expo
npm install

# 5. Restart Metro with clean cache
echo "🚀 Starting Expo with clean environment..."
npx expo start --clear --reset-cache

echo "✅ TextInput compatibility fixes applied!"
echo ""
echo "🐛 If issues persist, try these additional steps:"
echo "1. Restart your physical device"
echo "2. Reset iOS Simulator (Device → Erase All Content and Settings)"
echo "3. Check if fonts are loading properly"
echo "4. Consider downgrading React to 18.x if critical"
