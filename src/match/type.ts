import { ConstructorType, PropKey, TypeofResult } from "@/types"

/**
 * funio type utils
 */
const typeUtils = {
   isBoolean(value: any) { return typeof value === 'boolean' },
   isNumber(value: any) { return typeof value === 'number' },
   isBigint(value: any) { return typeof value === 'bigint' },
   isString(value: any) { return typeof value === 'string' },
   isSymbol(value: any) { return typeof value === 'symbol' },
   isUndefined(value: any) { return value === undefined },
   isNull(value: any) { return value === null },
   isObject(value: any) { return typeof value === 'object' && value !== null },
   isFunction(value: any) { return typeof value === 'function' },

   isNone(value: any) { return value == null },
   notNone(value: any) { return value != null },
   isPrimitive(value: any) { return !(value instanceof Object) },
   isComplex(value: any) { return value instanceof Object },
   isSimple(value: any) { return !(value instanceof Object || value == null) },

   insBoolean(value: any) { return value instanceof Boolean },
   insNumber(value: any) { return value instanceof Number },
   insBigint(value: any) { return value instanceof BigInt },
   insString(value: any) { return value instanceof String },
   insSymbol(value: any) { return value instanceof Symbol },

   isIterable(value: any) {
      const iter = Reflect.get(value, Symbol.iterator) || Reflect.get(value, Symbol.asyncIterator)
      return typeof iter === 'function'
   },
   isArray(value: any) { return Array.isArray(value) },
   isArrayLike(value: any) { },
   isPromise(value: any) { },
   isPromiseLike(value: any) { },

   id<T>(value: T) { return value as T },
   as<T>(value: any) { return value as T },

   type(value: any, type: TypeofResult) { return typeof value === type },
   insof(value: any, cons: ConstructorType) { return value instanceof cons },
   in(key: PropKey, object: Object) { return key in object },
   own(key: PropKey, object: Object) { return Object.hasOwn(object, key) },
   is(v1: any, v2: any) { return Object.is(v1, v2) },
   equals(v1: any, v2: any) { return v1 === v2 },
   like(v1: any, v2: any) { return v1 == v2 },
   same(v1: any, v2: any) {
      if (isNaN(v1) && isNaN(v2)) return true
      return v1 === v2
   },
}

export const typu: TypeUtils = function () {
   let tmp = (value: any) => typeof value
   Object.assign(tmp, typeUtils)
   return tmp as any
}()

type _TypeUtils = typeof typeUtils
export interface TypeUtils extends _TypeUtils {
   (value: any): TypeofResult
}
