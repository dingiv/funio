import { test } from "vitest";

test('test 01', () => {

   const p = new Promise((resolve, reject) => {
      throw Error('dsf')
      resolve(1)
      // reject(1)
   })

   console.log(p)

   const p2 = p.then((x: any) => {
      console.log(x)
      throw Error('dsf')
      return x + 1
   })

   const p3 = p2.then((x) => {
      console.log(x)
      return x + 1
   })

   p3.catch((x) => {
      console.log("catch 3")
   })

   p.catch((x) => {
      console.log("catch")
   })

   p.catch((x) => {
      console.log("catch 2")
   })


})