

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

export type RecordKey = string | number | symbol
export type RealRecord = Record<RecordKey, any>

export { }