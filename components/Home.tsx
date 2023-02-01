import React, { useContext, useEffect, useState } from "react";
import styles from "styles/components/Home.module.css";
import { GameData } from "utils/types";
import { MAX_CLOSEST_SCORE } from "utils/constants";
import { BASE_URL } from "utils/config";
import { GameContext } from "context/game.context";
import GameBox from "./GameBox";
import GameBoard from "./GameBoard";

const Home = () => {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState<String>("");

  const {
    moveCount,
    data,
    targetColor,
    closestKey,
    boxes,
    initData,
    evaluateBox,
  } = useContext(GameContext);

  const fetchGameData = async () => {
    setIsLoading(true);
    setError("");
    try {
      let url = `${BASE_URL}/init`;
      if (userId) url += `/user/${userId}`;
      const response = await fetch(url);
      const data: GameData = await response.json();
      initData(data);
      setUserId(data.userId);
    } catch (e: any) {
      setError("Failed to fetch.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGameData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!Object.keys(boxes).length || !boxes[closestKey]) return;
    if (
      moveCount > 0 &&
      Number(evaluateBox(boxes[closestKey].color)) < MAX_CLOSEST_SCORE
    ) {
      const action = window.confirm("Success, try again?");
      if (action) fetchGameData();
    } else if (moveCount > 0 && moveCount === data.maxMoves) {
      const action = window.confirm("Failed, try again?");
      if (action) fetchGameData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closestKey, boxes, moveCount, data]);

  return (
    <div className={styles.container}>
      {isLoading && <div className={styles.spinner}></div>}
      {error && <p>{error}</p>}
      {data && boxes[closestKey] && (
        <>
          <strong>RGB Alchemy</strong>
          <p>User ID: {userId}</p>
          <p>Moves left: {data.maxMoves - moveCount}</p>
          <div className={styles.colorStatus}>
            <span>Target color:</span>
            <GameBox rgb={targetColor} type={"tile"} />
          </div>
          <div className={styles.colorStatus}>
            <span>Closest color:</span>
            <GameBox rgb={boxes[closestKey].color} type={"tile"} />
            <span>&nbsp;&nbsp;Δ={evaluateBox(boxes[closestKey].color)}%</span>
          </div>
          <GameBoard />
          <button onClick={fetchGameData} className={styles.tryAgain}>
            Try again
          </button>
        </>
      )}
    </div>
  );
};

export default Home;
