import { expect, test } from "vitest";
import { Pack } from '@/pack'

test('test async basic capabilities', async () => {
   const pack = Pack(1).map(x => x * 2).await

   expect(await pack.value).toBe(1)
   expect(await pack.result).toMatchObject({ value: 2, isOk: true })
   expect(await pack.unwrap).toBe(2)
   expect(await pack.func(2)).toMatchObject({ value: 4, isOk: true })

})
