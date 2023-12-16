import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";
import { Board } from "../islands/Board.tsx";

export default function Home() {
  const count = useSignal(3);
  return (
    <div class="px-4 py-8 mx-auto bg-[#1a658e]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          src="/logo.svg"
          width="128"
          height="128"
        />
        <Board></Board>
        <Counter count={count} />
      </div>
    </div>
  );
}
