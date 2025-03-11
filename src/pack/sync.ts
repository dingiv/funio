import { ConstructorType, UF } from "@/types"
import { FUNIO_PACK, IS_ERROR, VALUE } from "./init"
import { type Pack } from "."

export class PackClass<T> {
   get [Symbol.toStringTag]() { return FUNIO_PACK }
   declare [VALUE]: any
   get value() { return this[VALUE] as T }
   // if the value is error
   declare [IS_ERROR]: any

   constructor(value: T) {
      if (value instanceof Error || value === undefined || value === null) {
         this[IS_ERROR] = true
      } else if (this[Symbol.toStringTag] === FUNIO_PACK) {
         value = value.unwrap
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

   maybe(onfulfilled: (value: T) => any) {

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

   get isPrimitive() {
      return !(this[VALUE] instanceof Object)
   }

   get isObject() {
      return this[VALUE] instanceof Object
   }

   get isReal() {
      return this[VALUE] !== undefined && this[VALUE] !== null
   }

   get isNone() {
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

   unwrap<T>(default_value: T) {
      return this.isReal ? this[VALUE] : default_value
   }
}