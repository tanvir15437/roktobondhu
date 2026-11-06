import { spawn } from 'child_process';

console.log('\x1b[35m%s\x1b[0m', '=======================================================');
console.log('\x1b[35m%s\x1b[0m', '   ROKTOBONDHU FULL-STACK DEVELOPMENT ENVIRONMENT      ');
console.log('\x1b[35m%s\x1b[0m', '=======================================================');

console.log('\x1b[36m%s\x1b[0m', '-> Starting Express Backend on http://127.0.0.1:5000...');
const backend = spawn('npx tsx server/src/server.ts', {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '5000' },
});

console.log('\x1b[32m%s\x1b[0m', '-> Starting Next.js App on http://localhost:3000...');
const frontend = spawn('npx next dev', {
  stdio: 'inherit',
  shell: true,
});

const cleanup = () => {
  console.log('\nShutting down RoktoBondhu dev servers...');
  try {
    backend.kill();
    frontend.kill();
  } catch {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

