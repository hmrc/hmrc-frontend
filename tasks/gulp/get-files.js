const { readdir } = require('fs').promises;
const { resolve } = require('path');

async function getFiles(dir) {
  const entries = await readdir(dir);

  return Promise.all(entries.map((entry) => {
    const resolvedEntry = resolve(dir, entry.name);

    return entry.isDirectory() ? getFiles(resolvedEntry) : resolvedEntry;
  })).flat();
}

module.exports = getFiles;
