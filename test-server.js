const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

console.log('Setting up middleware...');
app.use(cors());
app.use(express.json());

console.log('Setting up health endpoint...');
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

console.log('Starting server...');
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET /health - Health check');
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
});
