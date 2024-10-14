export const VALUE = Symbol('container_value')

export type UF<A, B> = (arg: A) => B

export type MF<A extends any[], R> = (...args: A) => R

export type IndexType = string | symbol | number

export interface TypeClass<T> { }

export interface Eq<T> {
	equals(this: TypeClass<T>, data: TypeClass<T>): boolean
}

export interface Ord<T> {
	compare(this: TypeClass<T>, data: TypeClass<T>): -1 | 0 | 1
}

export interface Semi<T> {
	[s: IndexType]: (this: TypeClass<T>, data: TypeClass<T>) => T
}

export type ContainerLike<T> = { [VALUE]: T }

export type ContainerValueType<T> = T extends ContainerLike<infer O> ? ContainerValueType<O> : T

export type ObjectKey = string | number | symbol

export type Primitive = boolean | number | bigint | string | symbol | undefined | null 