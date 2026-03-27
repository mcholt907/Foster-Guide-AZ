import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';

const ROOT = 'C:/Users/farkh/OneDrive/Documents/Foster Guide AZ';
process.chdir(ROOT);

if (existsSync('web')) {
  console.log('web/ already exists, skipping create-next-app');
} else {
  console.log('Creating Next.js app...');
  execSync(
    'npx create-next-app@latest web --typescript --tailwind --app --src-dir --no-eslint --no-import-alias --yes',
    { stdio: 'inherit', timeout: 120000 }
  );
}

console.log('Installing extra deps...');
process.chdir(`${ROOT}/web`);
execSync(
  'npm install framer-motion @phosphor-icons/react lucide-react @ducanh2912/next-pwa',
  { stdio: 'inherit', timeout: 120000 }
);

console.log('Done!');
