import { test, expect } from "vitest";
import { builder, isBuilder } from "../builder";


test('test dynamic builer - factory', () => {
   const userBuilder = builder(() => ({
      name: 'd',
      age: 12
   }))

   const user = userBuilder().name('vadf').age(34).gender(true).$build

   console.log(user)
   console.log(userBuilder())
})

test('test dynamic builer - construct', () => {
   const userBuilder = builder.construct(class User {
      name = ''
      age = 0
   })

   const user = userBuilder().name('vadf').age(34).gender(true).$build

   console.log(user)
   console.log(userBuilder())
})

test('test dynamic builer - template', () => {
   const userBuilder = builder.template({
      name: 'd',
      age: 12
   })

   const user = userBuilder().name('vadf').age(34).gender(true).$build

   console.log(user)
   console.log(userBuilder())
})

test('test dynamic builer - isBuilder', () => {
   const userBuilder = builder.from(['dfs', 'age'])

   console.log(userBuilder().ax('34'))

   expect(isBuilder(userBuilder())).toBeTruthy()
})