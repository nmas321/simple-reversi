import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { CPUStrength, Disk } from "../components/Reversi.ts";

interface StartScreenProps {
  onStartGame: (color: Disk, strength: CPUStrength) => void;
}

export function StartScreen(props: StartScreenProps) {
  const [playerColor, setPlayerColor] = useState<Disk>("b");
  const [aiStrength, setAiStrength] = useState<CPUStrength>("easy");

  function handleColorChange(
    event: JSX.TargetedEvent<HTMLSelectElement, Event>,
  ): void {
    setPlayerColor(event.currentTarget.value == "black" ? "b" : "w");
  }

  function handleAiStrengthChange(
    event: JSX.TargetedEvent<HTMLSelectElement, Event>,
  ): void {
    setAiStrength(event.currentTarget.value as CPUStrength);
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
          <option value="b">Black</option>
          <option value="w">White</option>
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
