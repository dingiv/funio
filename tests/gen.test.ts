import { ieb } from "@/gen/expression";
import { genject } from "@/gen/inject";
import { test } from "vitest";

test('test builder', () => {
   const a = ieb('helle').abe(123).$build

   console.log(a)
})


test('test', () => {
   function* testgen() {
      const a: number = yield ieb('helle').abe(2).$build
      const file: string = yield ieb(a).$build

      return file + 'sdf'
   }

   const v = genject(testgen(), (key: any) => {
      console.log(key)
      return key.name ?? 3
   })

   console.log(v)
})