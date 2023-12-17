import { assertEquals } from "$std/assert/assert_equals.ts";
import { Reversi } from "./Reversi.ts";

Deno.test("canNext test", () => {
  const reversi = new Reversi("b", "Easy", () => {});
  assertEquals(reversi.canNext(), true);
});

Deno.test("getScore", () => {
  const reversi = new Reversi("b", "Easy", () => {});
  const score = reversi.getScore();
  assertEquals(score.blackCount, 2);
  assertEquals(score.whiteCount, 2);
});
