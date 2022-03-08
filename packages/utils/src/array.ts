export const range = (start: number, stop: number, step = 1) =>
  Array<number>(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);

/**
 * Shuffle an input array in place.
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array/2450976#2450976
 */
export const fisherYatesShuffle = <T>(array: T[]) => {
  let j = 0;
  let temp: T;

  for (let i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};
