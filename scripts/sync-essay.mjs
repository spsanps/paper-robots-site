import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { resolve, basename } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

// Run with the author repository path. The rich author edition stays the source.
const authorRoot = process.argv[2];
if (!authorRoot) throw new Error('Usage: npm run sync:essay -- /path/to/sankala.me');
const root = fileURLToPath(new URL('../', import.meta.url));
const sourcePath = resolve(authorRoot, 'server/essay-previews/generated/gpt7-will-have-arms.js');
const { essayArticleHtml } = await import(pathToFileURL(sourcePath));
const article = essayArticleHtml.replace(/src="https:\/\/(?:www\.)?sankala\.me\/essays\/gpt7\/([^"]+)"/g, 'src="/assets/essays/gpt7/$1" loading="lazy"');
const contentDir = resolve(root, 'content/essays/gpt7-will-have-arms');
await mkdir(contentDir, { recursive: true });
await writeFile(resolve(contentDir,'article.html'),article + '\n');
const markdown = await readFile(resolve(authorRoot,'public/essays/gpt7-will-have-arms.md'),'utf8');
await writeFile(resolve(contentDir,'manuscript.md'),markdown);
for (const match of essayArticleHtml.matchAll(/src="https:\/\/(?:www\.)?sankala\.me\/essays\/gpt7\/([^"]+)"/g)) {
  const filename = basename(match[1]);
  if(filename !== match[1]) throw new Error('Unexpected source image path');
  await mkdir(resolve(root,'public/assets/essays/gpt7'),{recursive:true});
  await copyFile(resolve(authorRoot,'public/essays/gpt7',filename),resolve(root,'public/assets/essays/gpt7',filename));
}
await writeFile(resolve(contentDir,'source.json'),JSON.stringify({
  title: 'GPT-7 Will Have Arms', author: 'San Kala', originalPublication: '2025-12', filmPublication: '2026-09-06',
  canonical: 'https://www.sankala.me/essays/gpt7-will-have-arms',
  source: 'sankala.me/server/essay-previews/generated/gpt7-will-have-arms.js',
  sourceArticleSha256: createHash('sha256').update(essayArticleHtml).digest('hex'),
  markdownSha256: createHash('sha256').update(markdown).digest('hex'),
  transformation: 'Image URLs localized and lazy loading added; manuscript text unchanged.',
},null,2)+'\n');
console.log('Synced the complete reading edition and three original figures.');
