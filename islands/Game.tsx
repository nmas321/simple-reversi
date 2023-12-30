import { useEffect, useState } from "preact/hooks";
import { ReversiBoard } from "./ReversiBoard.tsx";
import StartScreen from "./StartScreen.tsx";
import { CPUStrength, Disk, Reversi } from "../components/Reversi.ts";

type GameState = "start" | "game" | "end";

export function Game() {
  const [gameState, setGameState] = useState<GameState>("start");
  const [reversi, setReversi] = useState<Reversi | undefined>(undefined);
  const [[blackCount, whiteCount], setScore] = useState<[number, number]>([
    2,
    2,
  ]);

  const startGame = (playerColor: Disk, strength: CPUStrength) => {
    const reversi = new Reversi(playerColor, strength, gameChange);
    if(playerColor == 'w') {
      reversi.putCPU();
    }
    setReversi(reversi);
    setGameState("game");
  };

  const gameChange = (
    blackCount: number,
    whiteCount: number,
    gameOver: boolean,
  ) => {
    setScore([blackCount, whiteCount]);
    if (gameOver) {
      setGameState("end");
    }
  };

  if (reversi !== undefined) {
    let yourScore = blackCount;
    let cpuScore = whiteCount;
    if (reversi.getPlayerColor() == "w") {
      [yourScore, cpuScore] = [cpuScore, yourScore];
    }

    if (gameState == "game") {
      return (
        <div>
          <p>
            Player Color: {reversi.getPlayerColor() == "b" ? "Black" : "White"}
          </p>
          <p>CPU Strength: {reversi.getAIName()}</p>
          <p>Score: You {yourScore} vs CPU {cpuScore}</p>
          <ReversiBoard reversi={reversi} />
        </div>
      );
    }

    if (gameState == "end") {
      let message = "🎉 Win!!! 🎉";
      if (yourScore == cpuScore) {
        message = "🤷 Draw 🤷";
      } else if (yourScore < cpuScore) {
        message = "😞 Lose... 😞";
      }
      return (
        <div>
          <p>Game Over</p>
          <p>{message}</p>
          <ReversiBoard reversi={reversi} />
        </div>
      );
    }
  }

  return (
    <div>
      <StartScreen onStartGame={startGame} />
    </div>
  );
}
