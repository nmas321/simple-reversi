type Turn = "b" | "w";
type SquareState = Turn | "-" | "h";

export class Reversi {
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

  put(rc: [number, number]): boolean {
    if (!this.canPut(rc)) {
      return false;
    }
    this.board[rc[0]][rc[1]] = this.turn;
    this.Direction.forEach((v) => this.putDirection(rc, v[0], v[1]));
    this.turn = this.b(this.turn);
    return true;
  }

  isUserTurn() {
    return this.turn === "b";
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
  private turn: Turn = "b";

  private b(turn: Turn): Turn {
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
}
