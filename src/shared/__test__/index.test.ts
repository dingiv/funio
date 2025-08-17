import { test } from "vitest";

test('test decorator', () => {

   function log(value: any, context: any) {
      console.log(value)
      console.log(122)
      console.log(context)
      console.log(11111)
      context.metadata.log = true
      return class Human {}
   }

   @log
   class User {

   }

   console.log(User)
})