import { expect, test } from "vitest";
import { $f } from "@/index";

test('test "assert"', () => {
   const f = $f(0).pipe((n: any) => {
      return n + 1
   }).assert((n: number) => {
      return n > 0
   })
   expect(f(/* 0 */)).toBe(1)
})

test('test "assert" failed', () => {
   const f = $f(0).pipe((n: any) => {
      return n + 1
   }).assert((n: number) => {
      return n === 0
   })

   console.log(f(/* 0 */))
   expect(f(/* 0 */)).toBeInstanceOf(Error)
})

test('test async "assert"', async () => {
   const f = $f(0).pipe((n: any) => {
      return n + 1
   }).assert(async (n: number) => {
      return n > 0
   })
   expect(await f(/* 0 */)).toBe(1)
})

test('test async "assert" failed', async () => {
   const f = $f(0).pipe((n: any) => {
      return n + 1
   }).assert(async (n: number) => {
      return n === 0
   })

   // console.log(await f(/* 0 */))
   const p = f(/* 0 */)
   expect(p).toBeInstanceOf(Promise)
   p.then(console.log).catch(() => { })
})

