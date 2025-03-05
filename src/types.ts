

/**
 * 一元函数
 */
export type UF<A = any, B = any> = (arg: A) => B

/**
 * 多元函数
 */
export type NF<A extends any[] = any[], R = any> = (...args: A) => R

/**
 * 原始类型
 */
export type Primitive = boolean | number | bigint | string | symbol | undefined | null

export type KeyType = string | number | symbol
export type RD<T> = Record<KeyType, T>
export type RDKey<T> = keyof T
export type ConstructorType<A extends any[] = any[], B extends any = any> = new (...args: A) => B

export const Type = {
   isNumber(n: any) { return typeof n === 'number' },
   isString(n: any) { return typeof n === 'string' },
   isBoolean(n: any) { return typeof n === 'boolean' },
   isUndefined(n: any) { return typeof n === 'undefined' },
   isNull(n: any) { return n === null },
   isObject(n: any) { return typeof n === 'object' && n !== null },

}


export const cast = <T = any>(v: any): T => v as T

export const identity = <A = any>(v: A): A => v

export { }