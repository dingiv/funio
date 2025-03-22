
/**
 * 原始类型
 */
export type Primitive = boolean | number | bigint | string | symbol | undefined | null
export type Simple = boolean | number | bigint | string | symbol
export type ToPrimitive<T> = T extends object ? never : T

export type PropKey = string | number | symbol
export type RRecord<T> = Record<PropKey, T>
export type RecordKey<T> = keyof T
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

/**
 * Unary Function 
 * @descrption
 * a function that needs only one param and returns its computed value
 */
export type UF<A = any, B = any> = (arg: A) => B

/**
 * 多元函数 
 */
export type NF<A extends any[] = any[], R = any> = (...args: A) => R

/**
 * 谓词
 */
export type Predicate<T> = UF<T, boolean>


export { }