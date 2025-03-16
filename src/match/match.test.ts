import { $f, FPipe } from "@/index";
import { $m, Match } from "@/match";
import { expect, test } from "vitest";

test('test value-mode', () => {
   const f: FPipe = $f(0).match(0, (a: any, b: any, c: any) => {
      console.log('match 0')
      console.log(a, b, c)
      return a + b + c
   }).match(1, (a: any, b: any, c: any) => {
      console.log('match 1')
      console.log(a, b, c)
      return a + b + c
   }).match('1', (a: any, b: any, c: any) => {
      console.log('match "1"')
      console.log(a, b, c)
      return a + b + c
   })


   expect(f()).toBeTypeOf('string')
   expect(f(1)).toBeTypeOf('string')
   expect(f('1')).toBeTypeOf('string')
})

test('test regex', () => {
   const regex = /hello, my name is (\w+), and I am (\d+) years old./;

   const matches = "hello, my name is Mike, and I am 18 years old.".match(regex)

   console.log(matches)

   let text = "Price: $30, Discount: $10";
   const r = /\$(\d+)/g
   console.log(r)
   console.log(text.match(r));
})

test('test function', () => {
   const f: FPipe = $f(0).match((x: any) => x + 1, (a: any, b: any, c: any) => {
      console.log('match function')
      console.log(a, b, c)
      return a + b + c
   }).match(1, (a: any, b: any, c: any) => {
      console.log('match 1')
      console.log(a, b, c)
      return a + b + c
   }).match('1', (a: any, b: any, c: any) => {
      console.log('match "1"')
      console.log(a, b, c)
      return a + b + c
   })


   expect(f()).toBeTypeOf('string')
})

test('test function pick', () => {
   const f: FPipe = $f(0).match((x: any) => x.name, (a: any, b: any, c: any) => {
      console.log('match function')
      console.log(a, b, c)
      return a + b + c
   }).match(1, (a: any, b: any, c: any) => {
      console.log('match 1')
      console.log(a, b, c)
      return a + b + c
   }).match('1', (a: any, b: any, c: any) => {
      console.log('match "1"')
      console.log(a, b, c)
      return a + b + c
   })


   expect(f({ name: 'Mike' })).toBeTypeOf('string')
   expect(f({ age: 13 })).toBeUndefined()
})

test('test match object 1', () => {
   const f: FPipe = $f(0).match((x: any) => x.name, (a: any, b: any, c: any) => {
      console.log('match function')
      console.log(a, b, c)
      return a + b + c
   }).match(1, (a: any, b: any, c: any) => {
      console.log('match 1')
      console.log(a, b, c)
      return a + b + c
   }).match('1', (a: any, b: any, c: any) => {
      console.log('match "1"')
      console.log(a, b, c)
      return a + b + c
   })


   expect(f({ name: 'Mike' })).toBeTypeOf('string')
   expect(f({ age: 13 })).toBeUndefined()
})

test('test match object 2', () => {
   const f: FPipe = $f(0).match((x: any) => x.gender, (a: any, b: any, c: any) => {
      console.log('gender')
      console.log(a, b, c)
      return a + b + c
   }).match({ name: $m, age: $m, son: { age: 2 } }, (a: any, b: any, c: any) => {
      console.log('name and age')
      console.log(a, b, c)
      return a + b + c
   }).match('1', (a: any, b: any, c: any) => {
      console.log('match "1"')
      console.log(a, b, c)
      return a + b + c
   })


   expect(f({ name: 'Mike', age: 33, son: { age: 2 } })).toBeTypeOf('string')
   expect(f({ name: 'Mike', age: 33, son: { age: 3 } })).toBeUndefined()
})