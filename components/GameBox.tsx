import React, { useMemo } from "react";
import styles from "styles/components/Box.module.css";
import { BoxType } from "utils/types";

interface GameBoxProps {
  highlighted?: boolean;
  rgb: [number, number, number];
  type?: BoxType;
  draggable?: boolean;
  clickable?: boolean;
  onClickBox?: () => void;
  handleDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export default function GameBox({
  highlighted = false,
  rgb,
  type = "source",
  draggable = false,
  clickable = false,
  onClickBox = () => {},
  handleDrop = () => {},
  handleDragStart = () => {},
}: GameBoxProps) {
  const onClick = () => {
    if (!clickable) return;
    else onClickBox();
  };

  const getCursor = useMemo(() => {
    if (type === "source" && clickable) {
      return "pointer";
    } else if (type === "tile" && draggable) {
      return "pointer";
    }
    return "default";
  }, [type, clickable, draggable]);

  const getHoverText = useMemo(() => {
    if (type === "tile") return rgb.join(",");
    return "";
  }, [type, rgb]);

  const enableDropping = (event: React.DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <div
      className={`${highlighted ? styles.highlighted : ""} ${styles[type]}`}
      draggable={draggable}
      onClick={onClick}
      onDrop={handleDrop}
      onDragOver={type === "source" ? enableDropping : undefined}
      onDragStart={handleDragStart}
      title={getHoverText}
      style={{
        backgroundColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
        cursor: getCursor,
      }}
    />
  );
}
