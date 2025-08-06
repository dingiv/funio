import { expect, test } from "vitest";
import { Pack } from '@/pack'
import { Lang } from "@/shared";

test('test basic capabilities', async () => {
   const pack = Pack(1).map(x => x * 2)

   expect(pack.value).toBe(1)
   expect(pack.result.value).toBe(2)
   expect(pack.unwrap).toBe(2)
   expect(pack.run(2).value).toBe(4)
   expect(pack.func(3).value).toBe(6)
   expect(pack.vague(3)).toBe(6)
   expect(pack.total(3)).toBe(6)
})

test('test Option interface', async () => {
   const pack = Pack(1).asErr('').map((x) => x * 2)

   const double = pack.func
   expect(double().value).toBe(2)
   expect(double(2).value).toBe(4)
   expect(double(undefined).value).toBe(2)
   expect(double(null as any).value).toBe(2)
   expect(pack.unwrap).toBe(2)
   expect(pack.maybe(() => 3).unwrap).toBe(2)
   expect(Pack().maybe(3).unwrap).toBe(3)
   expect(Pack(null as any).maybe(3).unwrap).toBe(3)
   expect(Pack(null as any).default(3).unwrap).toBe(3)
   expect(pack.map(Lang.throw).default(3).unwrap).toBe(3)
})

test('test Either interface', async () => {
   const pack = Pack(1)
      .map((x: any) => x * 2)
      .map(Lang.throw)
      .map(x => x + "!")
      .asErr<number>()

   const throwable = pack.vague
   expect(throwable(1)).toBe(2)

   const caught = pack.catch((e?: number) => e + '@').total
   expect(caught(1)).toBe('2@')

   const mapped = pack.mapErr((e: number) => parseInt(e + '')).total
   expect(mapped(1)).toBe(2)

   const func = pack.mapErr((e: number) => Boolean(e)).func
   expect(func(1)).toMatchObject({ value: true })
   expect(func(0)).toMatchObject({ value: false })
})

test('test await capability', async () => {
   const pack = Pack(1)
      .map(async (x: any) => parseInt(x))
      .await
      .map((x) => x * 2)
      .map(String)

   expect((await pack.unwrap)).toBe('2')
   expect(await pack.vague(1)).toBe('2')
   expect((await pack.func(2)).value).toBe('4')
   expect((await pack.run(3).value)).toBe('6')
})

test('test PromiseLike interface', async () => {
   const pack = Pack(1)
      .map(String)
      .map((x) => parseInt(x))
      .map((x) => x * 2)

   const value = await pack
   expect(value).toBe(2)

   const pack2 = pack
      .map(async (x) => x + 3)
      .await
      .map(String)
   const value2 = await pack2
   expect(value2).toBe('5')

   const pack3 = pack.map((x) => x + 3)
      .throw('err')
      .map((x) => console.log(x))
   try {
      await pack3
   } catch (error) {
      expect(error).toBe('err')
   }

   const pack4 = pack3
      .mapErr(x => parseInt(x))
      .catch(Lang.id)
   const value4 = await pack4
   expect(value4).toBe(NaN)

   const pack5 = pack
      .then(String, Boolean)
      .catch(Lang.id)
   const value5 = await pack5
   expect(value5).toBe('2')

   const pack6 = pack
      .throw('err')
      .then(String, Boolean)
      .catch(Lang.id)
   const value6 = await pack6
   expect(value6).toBe(true)
})

test('test Ring interface', () => {
   const pack = Pack(1).ring((a: number, p) => {
      console.log(a)
      if (a > 1) {
         const tmp = p.unwrap as number
         return tmp
      }
      return a + 2
   })

   expect(pack.func(0)).toMatchObject({ value: 2, isErr: false })
})

test('test Generator interface', async () => {
   const pack = Pack(1)
      .map(String)
      .gen(function* (data) {
         console.log(data)
         const a: number = yield 1
         const b = yield 2
         console.log(a, b)
         return 2
      }, (diqo: any) => {
         if (diqo === 1) {
            return 100
         }
         return 200
      })
      .map((x) => x + 1)
      .map((x) => x * 2)

   console.log(await pack)

})

test('test State interface', async () => {
   const pack = Pack(1)
      .map((x, s, c) => {
         console.log('s', s)

         console.log('c', c)

         let a: any
         a.ddd

         if (x > 1) {
            return x
         }
         s.count++

         return x + 1
      })



   console.log(pack)

   console.log(pack.run(2, { count: 1 }, { helper: 1 }))

   console.log((await pack.run(2, { count: 1 }, { helper: 1 }).await.throw('hello').map(x => x + 1).result))



})