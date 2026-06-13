const fs = require('fs');
const path = require('path');

const directories = ['app', 'components', 'context'];
const oldUrl = 'http://localhost:5000';
const newUrl = 'https://the-lables.onrender.com';

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(oldUrl)) {
        const newContent = content.split(oldUrl).join(newUrl);
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

directories.forEach(replaceInDir);
console.log('Finished updating URLs');
