export type Disk = "b" | "w";
export type CPUStrength = "Easy" | "Normal" | "Hard";
export type OnGameChange = (
  blackCount: number,
  whiteCount: number,
  gameOver: boolean,
) => void;
type SquareState = Disk | "-" | "h";

export class Reversi {
  constructor(
    playerColor: Disk,
    aiStrength: CPUStrength,
    onGameChange: OnGameChange | null,
    moveCpu: boolean = false,
  ) {
    this.turn = "b";
    this.playerColor = playerColor;
    this.cpuStrength = aiStrength;
    this.onGameChange = onGameChange;
    if(moveCpu) {
      this.putCPU();
    }
  }

  private Direction = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  private canPutDirection(rc: [number, number], i: number, j: number): boolean {
    let x = rc[0] + i;
    let y = rc[1] + j;
    if (!this.within(x, y)) return false;

    while (this.within(x, y) && this.board[x][y] === this.b(this.turn)) {
      x += i;
      y += j;
    }

    return !((x === (rc[0] + i) && y === (rc[1] + j)) || !this.within(x, y) ||
      this.board[x][y] != this.turn);
  }

  public canPut(rc: [number, number]): boolean {
    if (this.board[rc[0]][rc[1]] != "-") {
      return false;
    }
    for (const d of this.Direction) {
      if (this.canPutDirection(rc, d[0], d[1])) {
        return true;
      }
    }
    return false;
  }

  private within(x: number, y: number) {
    return x >= 0 && x <= 7 && y >= 0 && y <= 7;
  }

  private putDirection(rc: [number, number], i: number, j: number): void {
    let x = rc[0] + i;
    let y = rc[1] + j;
    if (!this.within(x, y)) return;

    while (this.within(x, y) && this.board[x][y] === this.b(this.turn)) {
      x += i;
      y += j;
    }

    if (
      (x === (rc[0] + i) && y === (rc[1] + j)) || !this.within(x, y) ||
      this.board[x][y] != this.turn
    ) {
      return;
    }

    x -= i;
    y -= j;

    while (x !== rc[0] || y !== rc[1]) {
      this.board[x][y] = this.turn;
      x -= i;
      y -= j;
    }
  }

  isGameOver(): boolean {
    let gameOver = false;
    if (!this.canNext()) {
      this.turn = this.b(this.turn);
      if (!this.canNext()) {
        gameOver = true;
      }
    }
    return gameOver;
  }

  putPlayer(rc: [number, number]): void {
    this.put(rc);
    while (this.turn != this.playerColor) {
      if (!this.putCPU()) break;
    }
  }

  put(rc: [number, number]): boolean {
    if (!this.canPut(rc)) {
      return false;
    }
    this.board[rc[0]][rc[1]] = this.turn;
    this.Direction.forEach((v) => this.putDirection(rc, v[0], v[1]));
    this.turn = this.b(this.turn);

    const gameOver = this.isGameOver();
    const score = this.getScore();
    if (this.onGameChange) {
      this.onGameChange(score.blackCount, score.whiteCount, gameOver);
    }

    return true;
  }

  canNext(): boolean {
    for (let i = 0; i < 8; ++i) {
      for (let j = 0; j < 8; ++j) {
        if (this.canPut([i, j])) {
          return true;
        }
      }
    }
    return false;
  }

  getNextList(): [number, number][] {
    const ret: [number, number][] = [];

    for (let i = 0; i < 8; ++i) {
      for (let j = 0; j < 8; ++j) {
        if (this.canPut([i, j])) {
          ret.push([i, j]);
        }
      }
    }
    return ret;
  }

  easyPutCpu(): boolean {
    const nextList = this.getNextList();

    if (nextList.length == 0) return false;

    this.put(nextList[Math.floor(Math.random() * nextList.length)]);

    return true;
  }

  hardPutCpu(): boolean {
    return this.easyPutCpu();
  }

  alphabeta(
    board: Reversi,
    depth: number,
    alpha: number,
    beta: number,
  ): number {
    if (board.isGameOver()) {
      return board.getAbsoluteScore(this.b(this.playerColor)) * 100;
    }

    const nextList = board.getNextList();

    const isPlayerTurn = board.getCurrentTurn() == this.playerColor;

    if (depth == 0) {
      const newBoard = board.getClone();
      newBoard.turn = this.b(board.getCurrentTurn());
      const enemyPoint = newBoard.getNextList().length;

      return isPlayerTurn
        ? nextList.length - enemyPoint
        : enemyPoint - nextList.length;
    }

    for (const child of nextList) {
      const newBoard = board.getClone(child);

      if (isPlayerTurn) {
        beta = Math.min(beta, this.alphabeta(newBoard, depth - 1, alpha, beta));
        if (alpha >= beta) {
          return beta;
        }
      } else {
        alpha = Math.max(
          alpha,
          this.alphabeta(newBoard, depth - 1, alpha, beta),
        );
        if (alpha >= beta) {
          return alpha;
        }
      }
    }

    return isPlayerTurn ? beta : alpha;
  }

  normalPutCpu(): boolean {
    const nextList = this.getNextList();

    if (nextList.length == 0) {
      return false;
    }

    const list = nextList.map((item) => {
      const newBoard = this.getClone(item);
      const point = this.alphabeta(newBoard, 3, -10000, 100000);
      return { item, point };
    }).sort((v, v2) => v2.point - v.point);

    this.put(list[0].item);

    return true;
  }

  putCPU(): boolean {
    if (this.cpuStrength == "Easy") {
      return this.easyPutCpu();
    }

    if (this.cpuStrength == "Hard") {
      return this.hardPutCpu();
    }

    return this.normalPutCpu();
  }

  getScore(): { blackCount: number; whiteCount: number } {
    let blackCount = 0;
    let whiteCount = 0;
    [...Array(8).keys()].forEach((i) => {
      [...Array(8).keys()].forEach((j) => {
        if (this.board[i][j] == "b") ++blackCount;
        if (this.board[i][j] == "w") ++whiteCount;
      });
    });
    return { blackCount, whiteCount };
  }

  getAbsoluteScore(from: Disk) {
    const score = this.getScore();
    const absoluteScore = score.blackCount - score.whiteCount;
    return from == "b" ? absoluteScore : -absoluteScore;
  }

  private b(turn: Disk): Disk {
    return turn === "b" ? "w" : "b";
  }

  public getBoard(): SquareState[][] {
    return this.board;
  }

  public getHintBoard(): SquareState[][] {
    const hintBoard = structuredClone(this.board);

    [...Array(8).keys()].forEach((i) => {
      [...Array(8).keys()].forEach((j) => {
        if (this.canPut([i, j])) {
          hintBoard[i][j] = "h";
        }
      });
    });
    return hintBoard;
  }

  public getPlayerColor() {
    return this.playerColor;
  }

  public getCurrentTurn() {
    return this.turn;
  }

  public getAIName() {
    return this.cpuStrength;
  }

  public getClone(rc: [number, number] | undefined = undefined): Reversi {
    const reversi = new Reversi(this.playerColor, this.cpuStrength, null);
    reversi.turn = this.turn;
    reversi.playerColor = this.playerColor;
    reversi.board = structuredClone(this.board);

    if (rc) {
      reversi.put(rc);
    }
    return reversi;
  }

  private board: SquareState[][] = [
    ["-", "-", "-", "-", "-", "-", "-", "-"],
    ["-", "-", "-", "-", "-", "-", "-", "-"],
    ["-", "-", "-", "-", "-", "-", "-", "-"],
    ["-", "-", "-", "w", "b", "-", "-", "-"],
    ["-", "-", "-", "b", "w", "-", "-", "-"],
    ["-", "-", "-", "-", "-", "-", "-", "-"],
    ["-", "-", "-", "-", "-", "-", "-", "-"],
    ["-", "-", "-", "-", "-", "-", "-", "-"],
  ];

  private turn: Disk;
  private playerColor: Disk;
  private cpuStrength: CPUStrength;
  private onGameChange: OnGameChange | null;
}
