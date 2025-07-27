import { expect, test } from "vitest";
import { Pack } from '@/pack'

test('test basic capabilities', async () => {
   const pack = Pack(1).map(x => x * 2)

   expect(pack.argv).toBe(1)
   expect(pack.value).toBe(2)
   expect(pack.func(2)).toBe(4)

   const pack2 = Pack().map(x => 1).wrap('sdf')
   expect(pack2.value).toBe(1)
})

test('test Option interface', async () => {
   const pack = Pack(1).errAs('').map((x) => x * 2)

   const double = pack.func
   expect(double(1)).toBe(2)
   expect(double()).toBe(2)
   expect(double(undefined)).toBe(2)
   expect(double(null as any)).toBe(2)

   const doubleString = pack.map((x) => x.toString()).func
   expect(doubleString(1)).toBe('2')
   const tribleString = pack.map((x) => x.toString()).wrap('3').func
   expect(tribleString()).toBe('6')

   const pack2 = Pack(null as any).default('default')
   expect(pack2.value).toBe('default')

   const pack3 = Pack(null).as<any>().map(x => x.hello).as('').maybe('filled')
   expect(pack3.value).toBe('filled')
})

test('test Result interface', async () => {
   const err = 'test error'
   const raise = () => { throw err }
   const pack = Pack(1)
      .map((x: any) => x * 2)
      .map(x => {
         raise()
         return x + "123"
      })
      .errAs<string>()

   const f = pack.func
   expect(f(1)).toBe(err)

   const f2 = pack.catch((e: string) => (e === err) + '').func
   expect(f2(1)).toBe('true')

   const f3 = pack.mapErr((e: string) => [e]).func
   expect(f3(1)).toEqual([err])

   const f4 = Pack(1).mapErr((e) => e + '123').func
   expect(f4(1)).toBe(1)
})

test('test Awaited interface', async () => {
   const pack = Pack(1)
      .map(async (x: any) => parseInt(x))
      .map((x) => x * 2)

   const f = pack.func
   expect(f(1)).toBeInstanceOf(Promise)
   expect(await f(1)).toBe(2)

   const raise = () => { throw 0 }
   const pack2 = Pack(1)
      .map(async (x: any) => parseInt(x))
      .map((x) => x * 2)
      .map(() => {
         raise()
         return '123'
      })
      .errAs<number>()

   const f2 = pack2.func
   expect(f2(1)).toBeInstanceOf(Promise)
   expect(await f2(1)).toBe(0)


   const pack3 = pack2.mapErr((e: any) => e + 1)
   const f3 = pack3.func
   expect(f3()).toBeInstanceOf(Promise)
   expect(await f3()).toBe(1)
})

test('test PromiseLike interface', async () => {
   const pack = Pack(1)
      .map((x: any) => parseInt(x))
      .map((x) => x * 2)

   const value = await pack
   expect(value).toBe(2)

   const pack2 = pack.map(async (x) => x + 3)
   const value2 = await pack2
   expect(value2).toBe(5)

   const pack3 = pack.map((x) => x + 3)
      .throw('err')
      .map((x) => console.log(x))
   const value3 = await pack3
   expect(value3).toBe(4)


})


test('test arrayLike interface', async () => {

})