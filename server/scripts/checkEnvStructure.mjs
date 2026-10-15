import fs from 'fs';

const content = fs.readFileSync('.env', 'utf8');
const lines = content.split('\n');
console.log('--- Scanning .env lines ---');
for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith('#') || trimmed.length === 0) {
    if (trimmed.startsWith('#') && trimmed.includes('=')) {
      const match = trimmed.match(/^#\s*([A-Za-z0-9_]+)=(.*)$/);
      if (match) {
        console.log(`Commented Prod Var: ${match[1]}, value length: ${match[2].trim().length}`);
      }
    }
  } else {
    const match = trimmed.match(/^([A-Za-z0-9_]+)=(.*)$/);
    if (match) {
      console.log(`Active Local Var: ${match[1]}, value length: ${match[2].trim().length}`);
    }
  }
}
