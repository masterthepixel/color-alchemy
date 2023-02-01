export type RGB = [number, number, number];
export type BoxType = "source" | "tile" | "empty";

export interface GameData {
  height: number;
  maxMoves: number;
  target: RGB;
  userId: string;
  width: number;
}

export interface Box {
  x: number;
  y: number;
  type: BoxType;
  color: RGB;
}
