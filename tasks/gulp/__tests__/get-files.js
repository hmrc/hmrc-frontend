const { readdir } = require('fs').promises;
const { resolve } = require('path');

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  const entriesOfEntries = await Promise.all(entries.map((entry) => {
    const resolvedEntry = resolve(dir, entry.name);

    return entry.isDirectory() ? getFiles(resolvedEntry) : [resolvedEntry];
  }));

  return entriesOfEntries.flat();
}

module.exports = getFiles;
