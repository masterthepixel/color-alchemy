import { Box, BoxType, RGB } from "./types";

export const generateGameBoxes = (width: number, height: number) => {
  const boxData: Record<string, Box> = {};
  let index = 0;
  for (let row = 0; row < height + 2; row++) {
    for (let col = 0; col < width + 2; col++) {
      let type: BoxType = "tile";
      if (
        (row === 0 && col === 0) ||
        (col === width + 1 && row === 0) ||
        (col === 0 && row === height + 1) ||
        (col === width + 1 && row === height + 1)
      ) {
        type = "empty";
      } else if (
        col === 0 ||
        col === width + 1 ||
        row === 0 ||
        row === height + 1
      ) {
        type = "source";
      }
      boxData[`${col}-${row}`] = {
        index,
        x: col,
        y: row,
        type,
        color: [0, 0, 0],
      };
      index++;
    }
  }
  return boxData;
};

export const scaleColor = (color: RGB, ratio: number): RGB => {
  return color.map((i) => Math.min(i * ratio, 255)) as RGB;
};
