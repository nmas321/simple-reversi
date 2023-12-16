import { useEffect, useRef, useState } from "preact/hooks";
import { Reversi } from "../components/Reversi.ts";

const reversi = new Reversi();

const BoardItemSize = 72;
const BoardSize = BoardItemSize * 8;

function getRowCol(ev: MouseEvent): [number, number] {
  const canvas = ev.target as HTMLCanvasElement;
  const rect = canvas.getBoundingClientRect();
  const x = ev.clientX - rect.left;
  const y = ev.clientY - rect.top;

  return [Math.floor(x / (rect.width / 8)), Math.floor(y / (rect.height / 8))];
}

export function Board() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  function onclick(ev: MouseEvent): any {
    // if (!reversi.isUserTurn()) {
    //   return;
    // }
  
    reversi.put(getRowCol(ev));
    setIsDrawing(true);
  }
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvasRef.current?.getContext("2d");
    if (!canvas || !context) return;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.margin = "10px";
    canvas.width = BoardSize;
    canvas.height = BoardSize;
    const b = reversi.getHintBoard();
    drawBoard(b, context);
    canvas.onclick = onclick;
    setIsDrawing(false);
  }, [isDrawing]);

  return <canvas ref={canvasRef}></canvas>;
}

function drawBoard(board: string[][], context: CanvasRenderingContext2D) {
  context.fillStyle = "#008000";
  context.strokeStyle = "#000000";
  context.fillRect(0, 0, BoardSize, BoardSize);
  context.strokeRect(0, 0, BoardSize, BoardSize);
  for (let i = 0; i < 8; ++i) {
    for (let j = 0; j < 8; ++j) {
      drawBoardItem(i * BoardItemSize, j * BoardItemSize, board[i][j], context);
    }
  }
}

function drawBoardItem(
  x: number,
  y: number,
  item: string,
  context: CanvasRenderingContext2D,
) {
  context.fillStyle = "#008000";
  context.strokeStyle = "#000000";
  context.strokeRect(x, y, BoardItemSize, BoardItemSize);

  if (item == "b" || item == "w") {
    context.beginPath();
    context.arc(
      x + BoardItemSize / 2,
      y + BoardItemSize / 2,
      BoardItemSize / 2 - 5,
      0,
      Math.PI * 2,
    );
    context.fillStyle = item == "w" ? "white" : "black";
    context.fill();
    context.strokeStyle = item == "w" ? "black" : "white";
    context.lineWidth = 1;
    context.stroke();
  }
  
  if (item == "h") {
    context.beginPath();
    context.arc(
      x + BoardItemSize / 2,
      y + BoardItemSize / 2,
      BoardItemSize / 2 - 20,
      0,
      Math.PI * 2,
    );
    context.fillStyle = 'green'
    context.fill();
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.stroke();
  }
}
