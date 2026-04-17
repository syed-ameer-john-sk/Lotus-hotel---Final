const { spawn } = require('child_process');
const server = spawn('python3', ['-m', 'http.server', '8080']);
server.stdout.on('data', d => console.log('stdout:', d.toString()));
server.stderr.on('data', d => console.log('stderr:', d.toString()));
setTimeout(() => server.kill(), 5000);
