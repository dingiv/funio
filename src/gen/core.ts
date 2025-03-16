
export type NonGenerator<T> = T extends Generator<any, any, any> ?
   never : (T extends AsyncGenerator<any, any, any> ? never : T)

export type Injector = <T>(diqo: NonGenerator<T>) => any


export const isGenerator = (func: Function) => {
   const tag = Reflect.get(func, Symbol.toStringTag)
   return tag?.endsWith?.('Generator') ?? false
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
         // handle diqo
         let diqo: any = next.value
         if (isGenerator(diqo)) {
            value = feed(diqo, injector)
         } else {
            value = injector(diqo)
         }

         // 检查 promise，一个 yield 的返回值一定不是 Promise
         if (value instanceof Promise) {
            value = await value
         }
      }
   }
}

export type Result<R, E> = { value?: R, error?: E }
export const genject = async <R, E>(gen: Generator | AsyncGenerator, injector: Injector): Promise<Result<R, E>> => {
   try {
      const value = await feed(gen, injector)
      return { value }
   } catch (error: any) {
      return { error }
   }
}