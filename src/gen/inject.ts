import { Pack } from "@/cnp/pack"
import { UF } from "@/types"

export type Injector = UF

export const isGeneratorFunction = (func: Function) => {
   const tag = Reflect.get(func, Symbol.toStringTag)
   return tag?.endsWith('GeneratorFunction') ?? false
}

/**
 * receives a generator function, returns a function that was injected with given env variables
 */
const feed = async (gen: Generator, injector: Injector) => {
   let value: any = undefined
   try {
      while (true) {
         const next = gen.next(value)
         if (next.done) {
            return [next.value]
         } else {
            // handle injection expression
            let ie: any = next.value
            if (ie instanceof Promise) {
               ie = await ie
            }
            if (isGeneratorFunction(ie)) {
               value = await feed(ie, injector)
               if (value[0] === undefined) {
                  return value
               }
            } else {
               value = injector(ie)
            }
            if (value instanceof Promise) {
               value = await value
            }
         }
      }
   } catch (error) {
      return [undefined, error]
   }
}

export const genject = async (gen: Generator, injector: Injector) => {
   const [result, err] = await feed(gen, injector)
   if (result === undefined) {
      return Pack.aerr(err)
   } else {
      return Pack.aok(result)
   }
}