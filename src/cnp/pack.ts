import { runInThisContext } from "vm"
import { ConstructorType, UF } from "../types"

/**
 * 使用 Pack 代替 Promise，将 async 函数或者可能失败的函数，使用 $f 包裹
 */
export interface Pack<T> extends PackClass<T> { }
export const Pack = <T>(value: T) => new PackClass<T>(value) as Pack<T>
const FUNIO_PACK = Symbol("FunioPack")
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


class PackClass<T> {
   get [Symbol.toStringTag]() { return FUNIO_PACK }
   declare value: any
   declare error: Error

   constructor(value: T) {
      if (value instanceof Error) {
         this.error = value
      } else if (value instanceof Promise) {
         this.value = value.catch(e => e)
      } else if (value instanceof PackClass) {
         this.value = value
      }
   }

   get isAsync(): boolean {
      return false
   }

   get isSucceed(): boolean {
      return false
   }

   get isFailed(): boolean {
      return false
   }

   resolve(value: any): void {

   }
   reject(reason?: any): void {

   }

   then<T>(onfulfilled?: UF<T | undefined, any>, onrejected?: UF<any, any>): Pack<T>
   then(onfulfilled?: ((value: T) => any), onrejected?: ((reason: any) => any)): Pack<any>
   then(onfulfilled: any, onrejected: any): any {
      if (this.value !== undefined) {
         if (this.value instanceof Promise) {
            this.value.then(onfulfilled).catch(onrejected)
         } else {
            if ()
         }
      }
   }

   catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined): Promise<T | TResult> {
      throw new Error("Method not implemented.")
   }

   finally(onfinally?: (() => void) | null | undefined): Promise<T> {
      throw new Error("Method not implemented.")
   }

   ins(clazz: ConstructorType) {
      return this.value instanceof clazz
   }

   all() {

   }

   every() {

   }

   any() {

   }

   isPrimitive() {

   }

   isObject() {

   }

   isReal() {

   }

   isNone() {
      return this.value === null || this.value === undefined
   }

   equals(value: any) {
      return this.value === value
   }

   same(value: any) {

   }

   like() {

   }

   // 添加更多工具类
   cast() {

   }

   //
   type() {

   }
}


