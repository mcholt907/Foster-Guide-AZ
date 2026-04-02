const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(Buffer.concat(chunks));
    const fp = (input.tool_input && input.tool_input.file_path) || '';
    const isSrv = fp.includes('server/src') || fp.includes('server\\src');
    if (!isSrv) return;
    const { spawnSync } = require('child_process');
    const r = spawnSync('npm', ['test'], {
      cwd: process.cwd() + '/server',
      shell: true,
      encoding: 'utf8'
    });
    if (r.stdout) process.stdout.write(r.stdout.slice(-2000));
    if (r.stderr) process.stderr.write(r.stderr.slice(-500));
  } catch (_) {}
});
