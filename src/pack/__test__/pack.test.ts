import { test } from "vitest";


test('test promise', async () => {
   async function ay() {
      return {
         then(r: Function, j: Function) {
            r()
         }
      } as Promise<number>
   }

   await ay()
   console.log('d')
})