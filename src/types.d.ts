
/**
 * 原始类型
 */
export type Primitive = boolean | number | bigint | string | symbol | undefined | null
export type Simple = boolean | number | bigint | string | symbol
export type ToPrimitive<T> = T extends object ? never : T
export type PropKey = string | number | symbol
export type KeyOf<T> = keyof T
export type ConstructorType<A extends any[] = any[], B extends any = any> = new (...args: A) => B

export type TypeofResult =
   | "undefined"
   | "boolean"
   | "number"
   | "bigint"
   | "string"
   | "symbol"
   | "object"
   | "function"

export type Some<T = unknown> = NonNullable<T>
export type None = null | undefined
export type Option<T> = T | None
export type Result<L, R> = L | R | None
export type Awaity<T> = T | Promise<T>

// unarity function
export type UF<A = any, B = any> = (arg: A) => B
// optional unarity function
export type OUF<A = any, B = any> = (arg?: A) => B
// binary function
export type BF<A = any, B = any, C = any> = (arg1: A, arg2: B) => C
// narity function
export type NF<A extends any[] = any[], R = any> = (...args: A) => R

// predicate function
export type Predicate<T> = UF<T, boolean>

// assertion error
export type FunioAssertionError = {
   message: string
   name: string
   stack?: string
}
