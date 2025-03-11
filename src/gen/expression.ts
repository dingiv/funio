import { KeyType } from "@/types"
import { builder } from "@/utils"

export interface InjectionQueryObject extends ReturnType<typeof InjectionQueryObject> { }
export const InjectionQueryObject = (key: KeyType) => {
   const ie = new InjectionQueryObjectClass(key)

   return ie
}

class InjectionQueryObjectClass {
   [s: KeyType]: any
   constructor(key: KeyType) {
      this.name = key
   }
}
export const ieb = builder(InjectionQueryObjectClass)