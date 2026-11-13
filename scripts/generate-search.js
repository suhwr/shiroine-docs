import fs from 'fs';
import path from 'path';

const docsDir = path.join(process.cwd(), 'public', 'docs');
const searchOutputFile = path.join(docsDir, 'search.json');

try {
  const items = fs.readdirSync(docsDir);
  const categories = items.filter((item) => {
    const itemPath = path.join(docsDir, item);
    return fs.statSync(itemPath).isDirectory();
  });

  const allSearchCommands = [];

  categories.forEach((category) => {
    const categoryDir = path.join(docsDir, category);
    const files = fs
      .readdirSync(categoryDir)
      .filter((file) => file.endsWith('.json') && file !== 'index.json');

    const categoryIndexCommands = [];

    files.forEach((file) => {
      const filePath = path.join(categoryDir, file);
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const content = JSON.parse(raw);

        const commandName = file.replace('.json', '');
        const name = content.name || commandName;
        const aliases = Array.isArray(content.aliases) ? content.aliases : [];

        // Descriptions
        let descId = '';
        let descEn = '';
        let primaryDesc = '';

        if (typeof content.description === 'string') {
          primaryDesc = content.description;
          descEn = content.description;
        } else if (content.description && typeof content.description === 'object') {
          descId = content.description.id || '';
          descEn = content.description.en || '';
          primaryDesc = descId || descEn;
        }

        const combinedDescLower = `${descId} ${descEn} ${primaryDesc}`.toLowerCase();

        // Permissions detection
        const permissions = { ...(content.permissions || {}) };
        if (
          category === 'developer' ||
          category === 'owner' ||
          combinedDescLower.includes('owner only') ||
          combinedDescLower.includes('khusus owner')
        ) {
          permissions.owner = true;
        }
        if (
          category === 'store_admin' ||
          category === 'admin' ||
          combinedDescLower.includes('admin only') ||
          combinedDescLower.includes('khusus admin')
        ) {
          permissions.admin = true;
        }

        // Premium detection
        let premiumOnly = content.premiumOnly || '';
        if (
          !premiumOnly &&
          (combinedDescLower.includes('khusus premium') ||
            combinedDescLower.includes('premium only') ||
            combinedDescLower.includes('khusus pengguna premium'))
        ) {
          premiumOnly = 'user';
        }

        // Limit Cost & Limit Type
        const limitCost = typeof content.limitCost === 'number' ? content.limitCost : 0;
        let limitType = 'none';

        if (category === 'ai' || combinedDescLower.includes('ai limit')) {
          limitType = 'ai';
        } else if (category === 'game' || category === 'minigame') {
          limitType = 'game';
        } else if (limitCost > 0) {
          limitType = 'daily';
        }

        const nsfwOnly = Boolean(content.nsfwOnly);
        const delaySeconds = typeof content.delaySeconds === 'number' ? content.delaySeconds : 0;
        const minArgs = typeof content.minArgs === 'number' ? content.minArgs : 0;

        let requireMedia = [];
        if (Array.isArray(content.requireMedia)) {
          requireMedia = content.requireMedia;
        } else if (typeof content.requireMedia === 'string' && content.requireMedia.trim()) {
          requireMedia = [content.requireMedia.trim()];
        }

        // Tag set assembly
        const rawTags = Array.isArray(content.tags) ? content.tags : [];
        const tagSet = new Set([
          name.toLowerCase(),
          ...aliases.map((a) => String(a).toLowerCase()),
          ...rawTags.map((t) => String(t).toLowerCase()),
          category.toLowerCase(),
        ]);

        if (premiumOnly) {
          tagSet.add('premium');
          tagSet.add('vip');
        }
        if (permissions.owner) {
          tagSet.add('owner');
          tagSet.add('developer');
        }
        if (permissions.admin) {
          tagSet.add('admin');
        }
        if (permissions.subowner) {
          tagSet.add('subowner');
        }
        if (limitType === 'ai') {
          tagSet.add('ai');
          tagSet.add('limit-ai');
          tagSet.add('limit ai');
        } else if (limitType === 'game') {
          tagSet.add('game');
          tagSet.add('limit-game');
        } else if (limitCost > 0) {
          tagSet.add('limit');
          tagSet.add('limit harian');
        }
        if (nsfwOnly) {
          tagSet.add('nsfw');
          tagSet.add('18+');
        }

        const tags = Array.from(tagSet);

        // Item for category index.json
        const categoryItem = {
          name,
          description: primaryDesc,
          descriptionId: descId,
          descriptionEn: descEn,
          aliases,
          category,
          permissions,
          premiumOnly,
          limitCost,
          limitType,
          nsfwOnly,
          delaySeconds,
          minArgs,
          requireMedia,
          tags,
        };
        categoryIndexCommands.push(categoryItem);

        // Item for global search.json
        allSearchCommands.push({
          name,
          aliases,
          category,
          path: `/command/${category}/${name}`,
          description: primaryDesc,
          permissions,
          premiumOnly,
          limitCost,
          limitType,
          nsfwOnly,
          delaySeconds,
          tags,
        });
      } catch (err) {
        console.error(`Error parsing file ${filePath}:`, err);
      }
    });

    // Write updated category index.json
    const categoryIndexFile = path.join(categoryDir, 'index.json');
    categoryIndexCommands.sort((a, b) => a.name.localeCompare(b.name));
    fs.writeFileSync(
      categoryIndexFile,
      JSON.stringify({ commands: categoryIndexCommands }, null, 2)
    );
  });

  allSearchCommands.sort((a, b) => a.name.localeCompare(b.name));
  fs.writeFileSync(
    searchOutputFile,
    JSON.stringify({ commands: allSearchCommands }, null, 2)
  );

  console.log(
    `Berhasil memperbarui ${categories.length} index.json kategori dan search.json dengan ${allSearchCommands.length} perintah.`
  );
} catch (err) {
  console.error('Gagal memperbarui search.json & index.json:', err);
  process.exit(1);
}
