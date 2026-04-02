const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(Buffer.concat(chunks));
    const fp = (input.tool_input && input.tool_input.file_path) || '';
    if (!fp.match(/\.tsx?$/)) return;
    const { spawnSync } = require('child_process');
    const cwd = process.cwd();
    const isApp = fp.includes('app/src') || fp.includes('app\\src');
    const isSrv = fp.includes('server/src') || fp.includes('server\\src');
    if (!isApp && !isSrv) return;
    const dir = isApp ? cwd + '/app' : cwd + '/server';
    const r = spawnSync('npx', ['tsc', '--noEmit'], { cwd: dir, shell: true, encoding: 'utf8' });
    if (r.stdout) process.stdout.write(r.stdout);
    if (r.stderr) process.stderr.write(r.stderr);
  } catch (_) {}
});
