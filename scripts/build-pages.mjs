import { readFile, writeFile, mkdir } from 'node:fs/promises';

const output = new URL('../dist/', import.meta.url);
const template = await readFile(new URL('index.html', output), 'utf8');
const pages = [
  { path: 'story', title: 'Our Story | MEHCHANA', description: 'From village mornings in Faridpur, Haryana, to your family table. Discover the story behind Mehchana and our traditional bilona ghee.' },
  { path: 'process', title: 'Our Process | MEHCHANA', description: 'Follow the Mehchana bilona journey, from fresh milk and curd churning to slow heating, careful filtering, and the finished ghee jar.' },
];

for (const page of pages) {
  const directory = new URL(`${page.path}/`, output);
  const html = template
    .replace(/<title>.*?<\/title>/s, `<title>${page.title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*("\s*\/?>)/, `$1${page.description}$2`);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL('index.html', directory), html);
}
console.log('Built direct-entry pages: /story/ and /process/');
