import { ConstructorType } from "@/types"
import { FUNIO_PACK, IS_ASYNC, IS_ERROR, VALUE } from "./init"


export class PackAsyncClass<T> {
   get [Symbol.toStringTag]() { return FUNIO_PACK }
   declare [VALUE]: any
   get value() { return this[VALUE] as T }
   // if the value is error
   declare [IS_ERROR]: boolean
   declare [IS_ASYNC]: any

   constructor(value: T) {
      if (value instanceof Error || value === undefined || value === null) {
         this[IS_ERROR] = true
      }
      this[VALUE] = value
   }

   get isAsync(): boolean {
      return false
   }

   get isOk(): boolean {
      return !this[IS_ERROR]
   }

   get isErr(): boolean {
      return !!this[IS_ERROR]
   }

   // resolve(value: any): void {
   //    // do nothing
   // }
   // reject(reason?: any): void {
   //    // do nothing
   // }

   then<T>(onfulfilled?: UF<T, any>, onrejected?: UF<any, any>): Pack<T>
   then(onfulfilled?: ((value: T) => any), onrejected?: ((reason: any) => any)): Pack<any>
   then(onfulfilled: any, onrejected: any): any {
      if (!this[IS_ERROR]) {
         if (typeof onfulfilled === 'function') {
            onfulfilled(this[VALUE])
         }
      } else {
         if (typeof onrejected === 'function') {
            onrejected(this[VALUE])
         }
      }
      return this as any
   }

   catch<B>(onrejected?: (reason: T) => B): Pack<B> {
      if (typeof onrejected === 'function' && this[IS_ERROR]) {
         onrejected(this[VALUE])
      }
      return this as any
   }

   finally(onfinally?: () => void): void {
      if (typeof onfinally === 'function') {
         onfinally()
      }
   }

   ins(clazz: ConstructorType) {
      return this[VALUE] instanceof clazz
   }

   // TODO:
   all() {

   }
   // TODO:
   every() {

   }
   // TODO:
   any() {

   }

   isPrimitive() {
      return !(this[VALUE] instanceof Object)
   }

   isObject() {
      return this[VALUE] instanceof Object
   }

   isReal() {
      return this[VALUE] !== undefined && this[VALUE] !== null
   }

   isNone() {
      return this.value === null || this.value === undefined
   }

   equals(value: any) {
      return this[VALUE] === value
   }

   same(value: any) {
      if (isNaN(value)) {
         return isNaN(this[VALUE])
      }
      return this[VALUE] === value
   }

   like(value: any) {
      return this[VALUE] == value
   }

   // 添加更多工具类
   cast<T>() {
      return this[VALUE] as T
   }

   //
   type() {

   }
}