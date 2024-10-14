import { test } from 'vitest'
import { $p, CurryFunction2, curry, pipeline, rearg, spread } from '@lib/index'


test('test curry', () => {
   const f = curry((a: number, b: string) => a * 2 + b)

   const f1 = f(2)('s')

   console.log(f1)

   const cf = curry(() => { })
   const f2 = pipeline((s: number) => 34, (as) => { return true })
   const af = curry((a: string, b: number) => { }, 3)
})

test('test rearg', () => {
   const f = rearg((a: string, b: boolean) => 2 + a + b, [1, 0])
   console.log(f.length)
   console.log(f(true, 'ssss'))


   const cf = curry(f)

   console.log(cf)
   const value = cf(true)('fs')
   const cf2 = curry((a: string, b: boolean, c: bigint) => 2 + a + b + c)
   const value2 = cf2('123')(true, BigInt(43))
   console.log(value)
   console.log(value2)
})

test('test partial', () => {
   const f1 = $p(() => true)
   const f12 = $p(() => true, 1)
   const f13 = $p(() => true, 45, 'fg', 45)
   const f14 = $p(() => true)

   const f2 = $p((s: boolean) => 0, $p)
   const f21 = $p((s: boolean) => 0, true)
   const f22 = $p((s: boolean) => 0, $p, $p)
   const f23 = $p((s: boolean) => 0, true, $p)
   const f24 = $p((a: any) => console.log(a), 3)
   f24()

   const _f3 = (s: string, b: bigint) => s + b + true
   const f3 = $p(_f3)
   const f31 = $p(_f3, '14')
   const f32 = $p(_f3, $p, $p)
   const f33 = $p(_f3, $p, 12n, 'fs')
   const f34 = $p(_f3, 'df', 123n, $p)
   console.log(f34('342n'))

   const _f4 = (...args: any[]) => 12
   const f4 = $p(_f4)
   const f41 = $p(_f4, 'df', $p, 123, $p)
})

test('test spread', () => {
   const f = (a: number, g: string) => console.log(a, g)
   const sf = spread(f)

   sf([3, 'fsd'])
})