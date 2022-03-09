import { MAX_CHARS } from "./constants.js";

export interface Config {
  category: string;
  glass: string;
  is_alcoholic: boolean;
  name: string;
  preparation: string;
  thumbnail: string;
}

export const cocktailText = ({
  category,
  glass,
  is_alcoholic,
  name,
  preparation,
  thumbnail,
}: Config) => {
  let s = `<b>${name}</b>`;

  s = `${s}\n<i>category: ${category}</i>`;

  const g = glass.toLowerCase();
  // https://emojipedia.org/tumbler-glass/
  // https://emojipedia.org/wine-glass/
  // https://emojipedia.org/cocktail-glass/
  if (g.includes("collins") || g.includes("old-fashioned")) {
    s = `${s}\n🥃 ${glass}`;
  } else if (g.includes("cocktail")) {
    s = `${s}\n🍸 ${glass}`;
  } else {
    s = `${s}\n🍷 ${glass}`;
  }

  if (is_alcoholic) {
    s = `${s}\n<b>alcoholic</b>`;
  } else {
    s = `${s}\n<b>non alcoholic</b>`;
  }

  s = `${s}\n\n${preparation}\n\n${thumbnail}`;

  return s.slice(0, MAX_CHARS);
};
