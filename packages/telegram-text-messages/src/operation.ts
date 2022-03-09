import { MAX_CHARS } from "./constants.js";

export interface Config {
  title: string;
  successes: string[];
  failures: string[];
  warnings: string[];
}

export const operationText = ({
  title,
  successes,
  failures,
  warnings,
}: Config) => {
  let s = `<b>${title}</b>`;

  if (successes.length > 0) {
    s = `${s}\n${successes.map((s) => `✅ ${s}`).join("\n")}`;
  }

  if (failures.length > 0) {
    s = `${s}\n${failures.map((s) => `❌ ${s}`).join("\n")}`;
  }

  if (warnings.length > 0) {
    s = `${s}\n${warnings.map((s) => `⚠️ ${s}`).join("\n")}`;
  }

  return s.slice(0, MAX_CHARS);
};
