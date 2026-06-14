import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const serverEntryPath = path.resolve(currentDir, '../dist/server/server.js');
let serverEntry;

async function getServerEntry() {
  if (serverEntry) {
    return serverEntry;
  }

  if (!existsSync(serverEntryPath)) {
    throw new Error(
      `Expected built server entry at ${serverEntryPath}. Ensure the production build completed successfully.`,
    );
  }

  const module = await import(pathToFileURL(serverEntryPath).href);
  serverEntry = module.default ?? module;
  return serverEntry;
}

export default {
  async fetch(request, env, ctx) {
    const handler = await getServerEntry();
    return handler.fetch(request, env, ctx);
  },
};
