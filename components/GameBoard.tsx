import React, { useContext } from "react";
import { GameContext } from "context/game.context";
import styles from "styles/components/GameBoard.module.css";
import { Box } from "utils/types";
import { FIRST_3_COLORS } from "utils/constants";
import GameBox from "./GameBox";

export default function GameBoard() {
  const {
    boxes,
    closestKey,
    moveCount,
    data,
    updateSourceColor,
    increaseMoveCount,
    updateTileColor,
  } = useContext(GameContext);

  const handleClickBox = (box: Box) => {
    updateSourceColor(box, FIRST_3_COLORS[moveCount]);
    updateRelatedBoxColors(box);
    increaseMoveCount();
  };

  const updateRelatedBoxColors = (box: Box) => {
    if (box.y === 0 || box.y === data.height + 1) {
      // clicked top and bottom source - update colors of vertical tiles
      for (let i = 0; i < data.height + 1; i++) {
        updateTileColor(boxes[`${box.x}-${i}`]);
      }
    } else {
      // clicked left and right source - update colors of horizontal tiles
      for (let i = 0; i < data.width + 1; i++) {
        updateTileColor(boxes[`${i}-${box.y}`]);
      }
    }
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    originBox: Box
  ) => {
    const dragBox = event.dataTransfer.getData("drag-box");
    const dragData = JSON.parse(dragBox) as Box;
    updateSourceColor(originBox, dragData.color);
    updateRelatedBoxColors(originBox);
    increaseMoveCount();
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    box: Box
  ) => {
    event.dataTransfer.setData("drag-box", JSON.stringify(box));
  };

  return (
    <div className={styles.container} style={{ width: (data.width + 2) * 34 }}>
      {Object.keys(boxes).map((key) => {
        const box = boxes[key];
        return (
          <GameBox
            key={key}
            type={box.type}
            rgb={box.color}
            highlighted={key === closestKey}
            draggable={
              box.type === "tile" && moveCount >= 3 && moveCount < data.maxMoves
            }
            clickable={box.type === "source" && moveCount < 3}
            onClickBox={() => handleClickBox(box)}
            handleDrop={(e) => handleDrop(e, box)}
            handleDragStart={(e) => handleDragStart(e, box)}
          />
        );
      })}
    </div>
  );
}
