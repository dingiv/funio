import { KeyType } from "@/types"
import { builder } from "@/utils"

export interface InjectionExpression extends ReturnType<typeof InjectionExpression> { }
export const InjectionExpression = (key: KeyType) => {
   const ie = new InjectionExpressionClass(key)

   return ie
}

class InjectionExpressionClass {
   [s: KeyType]: any
   constructor(key: KeyType) {
      this.name = key
   }
}
export const ieb = builder(InjectionExpressionClass)