import { MAX_CHARS } from "./constants.js";
import type { Link } from "./interfaces.js";

export interface Config {
  app_name: string;
  app_version?: string;
  links?: Link[];
  warning_message: string;
  warning_title: string;
}

export const warningText = ({
  app_name,
  app_version,
  links,
  warning_message,
  warning_title,
}: Config) => {
  let s = `<b>${app_name}</b>`;

  if (app_version) {
    s = `${s}\n<i>vers. ${app_version}</i>`;
  }

  s = `${s}\n\n<b>❌ ${warning_title}</b>\n\n<pre>${warning_message}</pre>`;

  if (links && links.length > 0) {
    const anchor_tags = links.map(
      (link) => `<a href="${link.href}">${link.text}</a>`
    );
    s = `${s}\n\n${anchor_tags.join("\n")}`;
  }

  return s.slice(0, MAX_CHARS);
};
