import { Primitive, Simple } from "@/types"

/**
 * typeof utils
 */
export function tyfBoolean(value: any) { return typeof value === 'boolean' }
export function tyfNumber(value: any) { return typeof value === 'number' }
export function tyfBigint(value: any) { return typeof value === 'bigint' }
export function tyfString(value: any) { return typeof value === 'string' }
export function tyfSymbol(value: any) { return typeof value === 'symbol' }
// tyfObject don't use
// tyfFunction don't use
// tyfUndefined don't use

/**
 * strict primitive type utils
 */
export function isBoolean(value: any) { return typeof value === 'boolean' || value instanceof Boolean }
export function isNumber(value: any) { return typeof value === 'number' || value instanceof Number }
export function isBigint(value: any) { return typeof value === 'bigint' || value instanceof BigInt }
export function isString(value: any) { return typeof value === 'string' || value instanceof String }
export function isSymbol(value: any) { return typeof value === 'symbol' || value instanceof Symbol }
export function isUndefined(value: any) { return value === (void 0) }
export function isNull(value: any) { return value === null }

export function isSome(value: any): value is NonNullable<any> { return value != null }
export function isNone(value: any): value is null | undefined { return value == null }
export function isPrimitive(value: any): value is Primitive { return value === null || (typeof value !== 'object' && typeof value !== 'function') }
export function isSomePrimitive(value: any): value is Simple {
   const t = typeof value
   return t === 'number' || t === 'string' || t === 'boolean' || t === 'symbol' || t === 'bigint'
}

/**
 * object utils
*/
export function isReference(value: any): value is object { return (typeof value === 'object' && value !== null) || typeof value === 'function' }
export function isPlainObject(value: any): value is Record<string, any> {
   if (Object.prototype.toString.call(value) !== '[object Object]') {
      return false;
   }
   const proto = Object.getPrototypeOf(value);
   return proto === null || proto === Object.prototype;
}
export function isFunction(value: any): value is Function { return typeof value === 'function' }
export function isArray(value: any) { return Array.isArray(value) }
export function isArrayLike(value: any): value is ArrayLike<any> {
   if (typeof value === 'object') {
      return typeof value?.length === 'number'
   } else if (typeof value === 'string') return true
   return false
}
export function isPromise(value: any) { return value instanceof Promise }
export function isPromiseLike(value: any): value is PromiseLike<any> { return typeof value?.then === 'function' }
