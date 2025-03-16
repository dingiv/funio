import { test, expect } from 'vitest'
import { $f } from '@/index'


test('test sync pipe', () => {
   const f = $f(1).pipe((n: any) => {
      console.log('p1', n)
      return n + 2
   }).pipe((n: any) => {
      console.log('p2', n)
      return n + 3
   })

   expect(f(/* 1 */)).toBe(6)
   expect(f(2)).toBe(7)
})

test('test async pipe', async () => {
   const f = $f(1).pipe((n: any) => {
      console.log('p1', n)
      return n + 2
   }).pipe(async (n: any) => {
      console.log('p2', n)
      return n + 3
   }).then((n: any) => {
      console.log('p3', n)
      return n + 4
   })

   const result = await f(/* 1 */)

   expect(result).toBe(10)
})

test('test "catch" in sync pipe', () => {
   const f = $f(1).pipe((n: any) => {
      console.log('p1', n)
      return n + 2
   }).pipe((n: any) => {
      console.log('p2', n)
      throw Error('error')
   }).catch((e: any) => {
      console.log('catch', e)
      return 100
   }).pipe((n: any) => {
      console.log('p3', n)
      return n + 3
   })

   expect(f(/* 1 */)).toBe(103)
})

test('test "unhandled" in sync pipe', async () => {
   const f = $f(1).pipe((n: any) => {
      console.log('p1', n)
      return Promise.reject('reject')
   }).pipe(async (n: any) => {
      console.log('p2', n)
      return n + 3
   }).then((n: any) => {
      console.log('p3', n)
      return n + 4
   }).compose((n: any) => {
      console.log('p4', n)
      return n + 5
   }).catch((e: any) => {
      console.log('catch', e)
      return 100
   })

   expect(f(1)).toBeInstanceOf(Promise)
})


test('test unhandled in async pipe', async () => {
   const f = $f(1).pipe((n: any) => {
      console.log('p1', n)
      return n + 2
   }).then((n: any) => {
      console.log('p2', n)
      return Promise.reject('error')
   }).pipe((n: any) => {
      console.log('p3', n)
      return n + 4
   })

   await expect(f(2)).resolves.toBeInstanceOf(Error)
})

test('test "catch" in async pipe', async () => {
   const f = $f(1).pipe((n: any) => {
      console.log('p1', n)
      return n + 2
   }).then(async (n: any) => {
      console.log('p2', n)
      return Promise.reject('reject')
   }).pipe((n: any) => {
      console.log('p3', n)
      return n + 4
   }).catch((e: any) => {
      console.log('catch', e)
      return 100
   })

   expect(await f(2)).toBe(100)
})