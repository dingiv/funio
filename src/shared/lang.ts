import { ConstructorType, TypeofResult } from "@/types"

export const Lang = Object.freeze({
   typeof(value: any) { return typeof value as TypeofResult },
   instanceof(value: any, cons: ConstructorType) { return value instanceof cons },
   in(key: PropertyKey, object: Object) { return key in object },
   own(object: Object, key: PropertyKey) { return Object.hasOwn(object, key) },
   is(v1: any, v2: any) { return Object.is(v1, v2) },
   equals(v1: any, v2: any) { return v1 === v2 },
   like(v1: any, v2: any) { return v1 == v2 },
   same(v1: any, v2: any) { return (Number.isNaN(v1) && Number.isNaN(v2)) || v1 === v2 },
   new<A extends any[], B>(cons: ConstructorType<A, B>, ...args: A) { return new cons(...args) },
   id<T = any>(x: T) { return x },
   as<T = any>(x: any) { return x as T },
   throw(e: any): unknown { throw e },
   void(v: any) { return void v },
})
