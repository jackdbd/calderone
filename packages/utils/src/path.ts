import { existsSync } from "node:fs";
import {
  copyFile as copyFileP,
  opendir as openDirP,
  unlink as unlinkP,
} from "node:fs/promises";
import path from "node:path";
import makeDebug from "debug";

const debug = makeDebug("utils/path");

export const monorepoRoot = () => {
  let current_dir = path.resolve(".");
  while (!existsSync(path.join(current_dir, ".git"))) {
    current_dir = path.join(current_dir, "..");
  }
  debug(`monorepo root is [${current_dir}]`);
  return current_dir;
};

export async function* walk(dir: string): AsyncGenerator<string> {
  for await (const d of await openDirP(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) {
      yield* walk(entry);
    } else if (d.isFile()) {
      yield entry;
    }
  }
}

export const renameJsFilesToMjs = async (dir: string) => {
  debug(`rename all .js files to .mjs in ${dir}`);
  for await (const src of walk(dir)) {
    if (path.extname(src) === ".js") {
      const js = path.basename(src);
      const mjs = `${js.slice(0, js.length - 3)}.mjs`;
      const dest = path.join(path.dirname(src), mjs);
      await copyFileP(src, dest);
      await unlinkP(src);
      debug(`${src} => ${dest}`);
    }
  }
};
