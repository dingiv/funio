import { ConstructorType } from "@/types"


export const FUNIO_PACK = Symbol("FunioPack")
export const VALUE = Symbol('FunioPack_value')
export const IS_ERROR = Symbol('FunioPack_is_error')
export const IS_ASYNC = Symbol('FunioPack_is_async')

export interface Pack<T> {
   get [Symbol.toStringTag](): string
   [VALUE]: any
   get value(): T
   // if the value is error
   [IS_ERROR]: any

   get isAsync(): boolean
   get isOk(): boolean
   get isErr(): boolean
   // resolve(value: any): void {
   //    // do nothing
   // }
   // reject(reason?: any): void {
   //    // do nothing
   // }

   then(onfulfilled: any, onrejected: any): any

   maybe(onfulfilled: (value: T) => any): void

   catch<B>(onrejected?: (reason: T) => B): Pack<B>
   finally(onfinally?: () => void): void

   ins(clazz: ConstructorType): void

   // TODO:
   all(): void

   // TODO:
   every(): void
   // TODO:
   any(): void

   get isPrimitive(): boolean

   get isObject(): boolean

   get isReal(): boolean

   get isNone(): boolean

   equals(value: any): boolean

   same(value: any): boolean

   like(value: any): boolean

   // 添加更多工具类
   cas<T>(): void

   type(): void

   unwrap<T>(default_value: T): void
}