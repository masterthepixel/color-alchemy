import React, { useState, createContext } from "react";
import { GameData, RGB, Box } from "utils/types";
import { generateGameBoxes, scaleColor } from "utils/helpers";

interface GameContextInterface {
  data: GameData;
  moveCount: number;
  targetColor: RGB;
  closestKey: string;
  boxes: Record<string, Box>;
  increaseMoveCount: () => void;
  setTargetColor: (color: RGB) => void;
  initData: (data: GameData) => void;
  updateSourceColor: (box: Box, color: RGB) => void;
  updateTileColor: (box: Box) => void;
  evaluateBox: (color: RGB) => string;
}

export const GameContext = createContext<GameContextInterface>({
  data: {
    width: 0,
    height: 0,
    maxMoves: 0,
    target: [0, 0, 0],
    userId: "",
  },
  moveCount: 0,
  targetColor: [0, 0, 0],
  closestKey: "1-1",
  boxes: {},
  increaseMoveCount: () => {},
  setTargetColor: () => {},
  initData: () => {},
  updateSourceColor: () => {},
  updateTileColor: () => {},
  evaluateBox: () => "",
});

export const GameContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<GameData>({
    width: 0,
    height: 0,
    maxMoves: 0,
    target: [0, 0, 0],
    userId: "",
  });
  const [moveCount, setMoveCount] = useState(0);
  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  const [targetColor, setTargetColor] = useState<RGB>([0, 0, 0]);
  const [closestKey, setClosestKey] = useState("1-1");
  const extWidth = data.width + 2;
  const extHeight = data.height + 2;

  const initData = (d: GameData) => {
    setData(d);
    setBoxes(generateGameBoxes(d.width, d.height));
    setTargetColor(d.target);
    setMoveCount(0);
    setClosestKey("1-1");
  };

  const increaseMoveCount = () => {
    setMoveCount(moveCount + 1);
  };

  const evaluateBox = (color: RGB) => {
    return (
      (1 / 255 / Math.sqrt(3)) *
      Math.sqrt(
        Math.pow(targetColor[0] - color[0], 2) +
          Math.pow(targetColor[1] - color[1], 2) +
          Math.pow(targetColor[2] - color[2], 2)
      ) *
      100
    ).toFixed(2);
  };

  const updateSourceColor = (box: Box, color: RGB) => {
    const temp = { ...boxes };
    temp[`${box.x}-${box.y}`].color = color;
    setBoxes(temp);
  };

  const updateTileColor = (box: Box) => {
    const temp = { ...boxes };
    const top = scaleColor(
      boxes[`${box.x}-0`].color,
      1 - box.y / (extHeight - 1)
    );
    const left = scaleColor(
      boxes[`0-${box.y}`].color,
      1 - box.x / (extWidth - 1)
    );
    const bottom = scaleColor(
      boxes[`${box.x}-${extHeight - 1}`].color,
      1 - (extHeight - box.y - 1) / (extHeight - 1)
    );
    const right = scaleColor(
      boxes[`${extWidth - 1}-${box.y}`].color,
      1 - (extWidth - box.x - 1) / (extWidth - 1)
    );

    const r = top[0] + left[0] + bottom[0] + right[0];
    const g = top[1] + left[1] + bottom[1] + right[1];
    const b = top[2] + left[2] + bottom[2] + right[2];
    const f = 255 / Math.max(r, g, b, 255);
    const color: RGB = [
      Math.floor(r * f),
      Math.floor(g * f),
      Math.floor(b * f),
    ];
    temp[`${box.x}-${box.y}`].color = color;
    setBoxes(temp);
    if (evaluateBox(boxes[closestKey].color) > evaluateBox(color)) {
      setClosestKey(`${box.x}-${box.y}`);
    }
  };

  return (
    <GameContext.Provider
      value={{
        data,
        moveCount,
        targetColor,
        closestKey,
        boxes,
        increaseMoveCount,
        setTargetColor,
        initData,
        updateSourceColor,
        updateTileColor,
        evaluateBox,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
