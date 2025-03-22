import { Diqo, di } from "@/diqo";
import { genject } from "./core";
import { test } from "vitest";
import { isBuilder } from "@/utils";

test('test builder', () => {
   const a = di('helle').abe(123).then

   console.log(a)
})

class User {
   name: string = ''
   age: number = 0
   son?: string
}

test('test genject', async () => {
   const userDiqo = di('user')

   async function* querySonAge(name: string) {
      const zs: User = yield userDiqo.name(name)
      console.log(zs)
      if (!zs.son) {
         return -1
      }

      const son: User = yield userDiqo.name(zs.son)
      return son.age
   }

   const v = await genject(querySonAge('zs'), (diqo: any) => {
      if (isBuilder(diqo)) {
         diqo = diqo.then
      }

      if (diqo.id === 'user') {
         const tmp = new User
         tmp.son = 'ls'
         return tmp
      }
      return diqo.name ?? 3
   })

   console.log(v)
})

test('test genject - recrusive', async () => {
   

   async function* inner(name: string) {
      const userDiqo = di('user')
      const ww: User = yield userDiqo.name('ls').version('34.32.3')

      return {
         son: 324234 + '' + ww.name
      }
   }

   function* outer(config: Record<string, string>) {
      const userDiqo = di('user')
      const zs: User = yield userDiqo.module('env=34').version('1.0.0')

      const ls: User = yield inner(zs.name)
      return ls.son
   }

   const v = await genject(outer({ env: 'a' }), (diqo: any) => {
      if (isBuilder(diqo)) {
         diqo = diqo.$build
      }

      if (diqo.id === 'user') {
         const tmp = new User
         tmp.son = 'ls'
         tmp.name = diqo.name
         return tmp
      }
      return diqo.name ?? 3
   })
 

   console.log(v)
})