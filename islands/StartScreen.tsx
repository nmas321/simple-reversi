import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

interface StartScreenProps {
  onStartGame: (color: string, strength: string) => void;
}

export function StartScreen(props: StartScreenProps) {
  const [playerColor, setPlayerColor] = useState("black");
  const [aiStrength, setAiStrength] = useState("easy");

  function handleColorChange(
    event: JSX.TargetedEvent<HTMLSelectElement, Event>,
  ): void {
    setPlayerColor(event.currentTarget.value);
  }

  function handleAiStrengthChange(
    event: JSX.TargetedEvent<HTMLSelectElement, Event>,
  ): void {
    setAiStrength(event.currentTarget.value);
  }

  function handleStartGame(
    event: JSX.TargetedMouseEvent<HTMLButtonElement>,
  ): void {
    props.onStartGame(playerColor, aiStrength);
  }

  return (
    <div>
      <label>
        Select Your Color:
        <select value={playerColor} onChange={handleColorChange}>
          <option value="black">Black</option>
          <option value="white">White</option>
        </select>
      </label>
      <br />
      <label>
        Select AI Strength:
        <select value={aiStrength} onChange={handleAiStrengthChange}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>
      <br />
      <button onClick={handleStartGame}>Start Game</button>
    </div>
  );
}

export default StartScreen;
