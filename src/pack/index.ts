import { FUNIO_PACK } from "./core"
import { PackAsyncClass } from "./impl/async"
import { PackSync } from "./impl/sync"


export interface pack<T> extends PackSync<T> { }
/**
 * 使用 Pack 代替 Promise，将 async 函数或者可能失败的函数，使用 $f 包裹
 */
export const pack = <T>(value: T): pack<T> => {
   if (value instanceof Promise) {
      return new PackAsyncClass<T>(value) as any
   } else {
      return new PackSync<T>(value) as pack<T>
   }
}

pack.try = (fn: Function) => {
   return (...args: any[]) => {
      try {
         return fn(...args)
      } catch (e) {
         return pack(e)
      }
   }
}
pack.ok = (value: any) => pack(value)
pack.err = (e: Error) => pack(e)
pack.aok = (value: any) => pack(Promise.resolve(value))
pack.aerr = (e: Error) => pack(Promise.reject(e))
pack.isPack = (value: any) => value && value[Symbol.toStringTag] === FUNIO_PACK

