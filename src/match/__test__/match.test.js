import { expect, test } from "vitest";
import { Pattern } from "../pattern";
import { Lang, Typu } from "@/shared";

test('test value pattern', () => {
   let p = Pattern(1)

   expect(p.match(1).value).toBe(1)
   expect(p.match(2).value).toBeUndefined()

   p = Pattern('1')
   expect(p.match('1').isSome).toBe(true)
   expect(p.match('1').value).toBe('1')
   expect(p.match('2').isNone).toBe(true)

   p = Pattern(true)
   expect(p.match(true).value).toBe(true)
   expect(p.match(false).value).toBeUndefined()

   p = Pattern(false)
   expect(p.match(true).value).toBeUndefined()
   expect(p.match(false).value).toBe(false)

   p = Pattern(undefined)
   expect(p.match(undefined).isSome).toBe(true)
   expect(p.match(undefined).value).toBeUndefined()

   p = Pattern(null)
   expect(p.match(null).isSome).toBe(true)
   expect(p.match(null).value).toBeNull()

   p = Pattern(NaN)
   expect(p.match(NaN).isSome).toBe(true)
   expect(p.match(NaN).value).toBeNaN()
})

test('test enum pattern', () => {
   let p = Pattern.enum(1, 2, 3)

   expect(p.match(1).isSome).toBe(true)
   expect(p.match(1).value).toBe(1)
   expect(p.match(2).isSome).toBe(true)
   expect(p.match(3).isSome).toBe(true)
   expect(p.match(4).isNone).toBe(true)

   p = Pattern.enum('a', 'b', Typu.isArrayLike)

   expect(p.match('a').isSome).toBe(true)
   expect(p.match('b').isSome).toBe(true)
   expect(p.match([]).isSome).toBe(true)
   expect(p.match([]).value).toMatchObject([])
   expect(p.match({}).isNone).toBe(true)
})

test('test extract', () => {
   let p = Pattern(user => user.name)
   expect(p.match({ name: 'abc' }).value).toBe('abc')

   p = Pattern([a0 => a0 + 1, a1 => a1 + 1])
   expect(p.match([1, 2]).value).toMatchObject([2, 3])
})

test('test function pattern', () => {
   let p = Pattern((v) => v === 1)

   expect(p.match(1).value).toBe(1)
   expect(p.match(2).isNone).toBe(true)

   p = Pattern((v) => v)
   expect(p.match(1).value).toBe(1)
   expect(p.match(2).value).toBe(2)
   expect(p.match(true).value).toBe(true)
   expect(p.match(false).value).toBeUndefined()
})

test('test object pattern', () => {
   let p = Pattern({ a: 1, b: 2 })

   expect(p.match({ a: 1, b: 2 }).isSome).toBe(true)
   expect(p.match({ a: 1, b: 3 }).isNone).toBe(true)

   p = Pattern({ a: 1, b: Pattern((v) => v) })
   expect(p.match({ a: 1, b: 2 }).isSome).toBe(true)
   expect(p.match({ a: 1, b: 3 }).isSome).toBe(true)
   expect(p.match({ a: 1, b: 3 }).value).toMatchObject({ a: 1, b: 3 })

   p = Pattern({
      a: Pattern.enum(1, 2, 3),
      b: Typu.tyfString
   })

   expect(p.match({ a: 1, b: 'abc' }).isSome).toBe(true)
   expect(p.match({ a: 4, b: 'abc' }).isNone).toBe(true)
})

test('test array pattern', () => {
   let p = Pattern([1, 2, 3])

   expect(p.match([1, 2, 3]).isSome).toBe(true)
   expect(p.match([1, 2, 4]).isNone).toBe(true)
   expect(p.match([1, 2]).isNone).toBe(true)

   p = Pattern([Typu.tyfNumber, Typu.tyfString])
   expect(p.match([1, 'abc']).isSome).toBe(true)
   expect(p.match([1, 2]).isNone).toBe(true)

   p = Pattern([
      {
         name: Typu.tyfString,
         age: Typu.tyfNumber,
      },
      [1, 2, Typu.isBoolean]
   ])

   expect(p.match([{ name: 'abc', age: 1 }, [1, 2, true]]).isSome).toBe(true)
   expect(p.match([{ name: 'abc', age: 1 }, [1, 2, false]]).value)
      .toMatchObject([{ name: 'abc', age: 1 }, [1, 2, false]])
   expect(p.match([[1, 2, false]]).isNone).toBe(true)

   p = Pattern({
      a: Pattern.enum(1, 2, 3),
      b: Pattern.enum('zs', 'ls')
   })

   expect(p.match({ a: 1, b: 'zs' }).isSome).toBe(true)
   expect(p.match({ a: 2, b: 'ls' }).isSome).toBe(true)
   expect(p.match({ a: 1, b: 'ww' }).isNone).toBe(true)
   expect(p.match({ a: 4, b: 'zs' }).isNone).toBe(true)
})

test('test static function', () => {
   let p = Pattern.struct({
      name: Typu.isString,
      age: Typu.isNumber,
   })

   expect(p.match({ name: 'abc', age: 1 }).isSome).toBe(true)
   expect(p.match({ name: 'abc', age: '1' }).isNone).toBe(true)

   p = Pattern.tuple([{
      name: Pattern.enum('zs', 'ls'),
      age: Pattern.enum(1, 2, 3),
   }, (x) => x < 3])

   expect(p.match([{ name: 'zs', age: 1 }, 2]).isSome).toBe(true)
   expect(p.match([{ name: 'ls', age: 2 }, 2]).isSome).toBe(true)
   expect(p.match([{ name: 'ls', age: 2 }, 4]).isNone).toBe(true)
})

test('test method', () => {
   let p = Pattern({
      name(n) {
         return n.startsWith('a') && n.endsWith('b')
      },
      age(a) {
         return a > 10 && a < 18
      },
   })

   expect(p.match({ name: 'abc', age: 11 }).isNone).toBe(true)
   expect(p.match({ name: 'ab', age: 11 }).isSome).toBe(true)
   expect(p.match({ name: 'abc', age: 19 }).isNone).toBe(true)
})