#!/bin/zsh
# Start the local mock server and the Expo app together for development

# Start the mock server in the background
node mock-server-fixed.js &

# Start the Expo app
expo start
