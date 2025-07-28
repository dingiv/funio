import { ConstructorType, PropKey, TypeofResult } from "@/types"

export const Lang = Object.freeze({
   typeof(value: any, type: TypeofResult) { return typeof value === type },
   instanceof(value: any, cons: ConstructorType) { return value instanceof cons },
   in(key: PropKey, object: Object) { return key in object },
   own(object: Object, key: PropKey) { return Object.hasOwn(object, key) },
   is(v1: any, v2: any) { return Object.is(v1, v2) },
   equals(v1: any, v2: any) { return v1 === v2 },
   like(v1: any, v2: any) { return v1 == v2 },
   same(v1: any, v2: any) { if (isNaN(v1) && isNaN(v2)) return true; return v1 === v2 },
   identity<T = any>(x: T) { return x },
   as<T = any>(x: any) { return x as T },
   new<A extends any[], B>(cons: ConstructorType<A, B>, ...args: A) { return new cons(...args) },
   throw(e: any) { throw e },
})
