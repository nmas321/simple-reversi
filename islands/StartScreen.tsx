import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { CPUStrength, Disk } from "../components/Reversi.ts";

interface StartScreenProps {
  onStartGame: (color: Disk, strength: CPUStrength) => void;
}

export function StartScreen(props: StartScreenProps) {
  const [playerColor, setPlayerColor] = useState<Disk>("b");
  const [aiStrength, setAiStrength] = useState<CPUStrength>("Normal");

  function handleColorChange(
    event: JSX.TargetedEvent<HTMLSelectElement, Event>,
  ): void {
    setPlayerColor(event.currentTarget.value as Disk);
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
      <div class="flex flex-col">
        <label>Color</label>
        <select
          value={playerColor}
          onChange={handleColorChange}
          class="bg-black text-white p-2 rounded"
        >
          <option value="b">Black</option>
          <option value="w">White</option>
        </select>

        <label>Difficulty</label>
        <select
          value={aiStrength}
          onChange={handleAiStrengthChange}
          class="bg-black text-white p-2 rounded"
        >
          <option value="Easy">Easy</option>
          <option value="Normal">Normal</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div class="flex flex-col">
        <button
          class="px-8 py-4 bg-white text-black font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg mt-3"
          onClick={handleStartGame}
        >
          👍Play👍
        </button>
      </div>
    </div>
  );
}

export default StartScreen;
