import { $f } from "@/index";
import { test } from "vitest";
import { Range } from "@/range";

test('test array', () => {
   const f = $f(Range(1, 10))
      .map((x: number) => x + 1)
      .filter((x: number) => x % 2 === 0)

   console.log(f())
})