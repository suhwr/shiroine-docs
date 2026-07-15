import fs from 'fs';
import path from 'path';

const docsDir = path.join(process.cwd(), 'public', 'docs');
const outputFile = path.join(docsDir, 'search.json');

try {
  const items = fs.readdirSync(docsDir);
  const categories = items.filter(item => {
    const itemPath = path.join(docsDir, item);
    return fs.statSync(itemPath).isDirectory();
  });

  const commands = [];

  categories.forEach(category => {
    const categoryDir = path.join(docsDir, category);
    const files = fs.readdirSync(categoryDir).filter(file => file.endsWith('.json'));

    files.forEach(file => {
      const filePath = path.join(categoryDir, file);
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const aliases = content.aliases || [];
        const commandName = file.replace('.json', '');
        const name = content.name || commandName;
        
        // Remove duplicates in tags by using Set
        const tags = Array.from(new Set([name, ...aliases]));

        commands.push({
          aliases: aliases,
          category: category,
          name: name,
          path: `/commands/${category}/${commandName}`,
          tags: tags
        });
      } catch (err) {
        console.error(`Error parsing ${filePath}:`, err);
      }
    });
  });

  fs.writeFileSync(outputFile, JSON.stringify({ commands }, null, 2));
  console.log(`Generated search.json with ${commands.length} commands.`);
} catch (err) {
  console.error("Failed to generate search.json:", err);
  process.exit(1);
}
