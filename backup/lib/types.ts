
/**
 * 一元函数
 */
export type UF<A = any, B = any> = (arg: A) => B

/**
 * 多元函数
 */
export type NF<A extends any[] = any[], R = any> = (...args: A) => R

/**
 * 容器私有字段
 */
export const VALUE = Symbol('container_value')

export type IContainer<T> = { [VALUE]: T }


export interface IFunctor {
	[VALUE]: any
	get value(): any
	map(f: UF): IFunctor
}

export type ObjectKeyType = string | symbol | number

export type Primitive = boolean | number | bigint | string | symbol | undefined | null

export type ToPrimitive<T extends Primitive> =
	T extends number ? number :
	T extends string ? string :
	T extends boolean ? boolean :
	T extends bigint ? bigint :
	T extends symbol ? symbol :
	T extends undefined ? undefined :
	T extends null ? null : never;
