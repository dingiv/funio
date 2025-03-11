import { PackAsyncClass } from "./async"
import { FUNIO_PACK } from "./init"
import { PackClass } from "./sync"


export interface Pack<T> extends PackClass<T> { }
/**
 * 使用 Pack 代替 Promise，将 async 函数或者可能失败的函数，使用 $f 包裹
 */
export const Pack = <T>(value: T): Pack<T> => {
   if (value instanceof Promise) {
      return new PackAsyncClass<T>(value) as any
   } else {
      return new PackClass<T>(value) as Pack<T>
   }
}

Pack.try = (fn: Function) => {
   return (...args: any[]) => {
      try {
         return fn(...args)
      } catch (e) {
         return Pack(e)
      }
   }
}
Pack.ok = (value: any) => Pack(value)
Pack.err = (e: Error) => Pack(e)
Pack.aok = (value: any) => Pack(Promise.resolve(value))
Pack.aerr = (e: Error) => Pack(Promise.reject(e))
Pack.isPack = (value: any) => value && value[Symbol.toStringTag] === FUNIO_PACK

