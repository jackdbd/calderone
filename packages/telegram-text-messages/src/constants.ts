/**
 * In a Telegram message, `text` has a limit of 4096 characters
 *
 * https://core.telegram.org/bots/api#message
 */
export const MAX_CHARS = 4096

/**
 * Emojis
 *
 * @see [Emojipedia](https://emojipedia.org/)
 */
export enum Emoji {
  // https://emojipedia.org/cocktail-glass/
  CocktailGlass = '🍸',
  Error = '🚨',
  Failure = '❌',
  Finished = '🏁',
  Notification = '💬',
  Ok = '✅',
  Started = '🎬',
  Stop = '🛑',
  Success = '✅',
  Timer = '⏱️',
  // https://emojipedia.org/tumbler-glass/
  TumblerGlass = '🥃',
  // https://emojipedia.org/wine-glass/
  WineGlass = '🍷',
  User = '👤',
  Warning = '⚠️'
}
