
export type NonGenerator<T> = T extends Generator<any, any, any> ?
   never : (T extends AsyncGenerator<any, any, any> ? never : T)

export type Injector = <T>(diqv: NonGenerator<T>) => any


export const isGeneratorFunction = (func: Function) => {
   const tag = Reflect.get(func, Symbol.toStringTag)
   return tag?.endsWith('GeneratorFunction') ?? false
}


/**
 * receives a generator, run the generator and inject dependencies it need with injector
 */
const feed = async (gen: Generator | AsyncGenerator, injector: Injector) => {
   let value: any = undefined
   while (true) {
      let next = gen.next(value)
      if (next instanceof Promise) {
         next = await next
      }
      if (next.done) {
         return next.value
      } else {
         // handle diqe
         let diqv: any = next.value
         if (isGeneratorFunction(diqv)) {
            value = await feed(diqv, injector)
         } else {
            value = injector(diqv)
         }
         if (value instanceof Promise) {
            value = await value
         }
      }
   }
}
 