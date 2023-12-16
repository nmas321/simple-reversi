import { useState } from "preact/hooks";
import { ReversiBoard } from "./ReversiBoard.tsx";
import StartScreen from "./StartScreen.tsx";

export function Game() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [playerColor, setPlayerColor] = useState("");
  const [aiStrength, setAiStrength] = useState("");

  const startGame = (color: string, strength: string) => {
    setPlayerColor(color);
    setAiStrength(strength);
    setIsGameStarted(true);
  };

  return (
    <div>
      {isGameStarted
        ? (
          <div>
            <h2>Reversi Game</h2>
            <p>Player Color: {playerColor}</p>
            <p>AI Strength: {aiStrength}</p>
            <ReversiBoard playerColor={playerColor} aiStrength={aiStrength}>
            </ReversiBoard>
          </div>
        )
        : <StartScreen onStartGame={startGame} />}
    </div>
  );
}
