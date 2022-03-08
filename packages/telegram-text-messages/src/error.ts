import { MAX_CHARS } from "./constants.js";
import type { Link } from "./interfaces.js";

interface Config {
  app_name: string;
  app_version?: string;
  error_message: string;
  error_title: string;
  links?: Link[];
}

export const errorText = ({
  app_name,
  app_version,
  error_message,
  error_title,
  links,
}: Config) => {
  let s = `<b>${app_name}</b>`;

  if (app_version) {
    s = `${s}\n<i>vers. ${app_version}</i>`;
  }

  s = `${s}\n\n<b>❌ ${error_title}</b>\n\n<pre>${error_message}</pre>`;

  if (links && links.length > 0) {
    const anchor_tags = links.map(
      (link) => `<a href="${link.href}">${link.text}</a>`
    );
    s = `${s}\n\n${anchor_tags.join("\n")}`;
  }

  return s.slice(0, MAX_CHARS);
};
