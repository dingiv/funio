import { ObjectKey } from "@/lib2/TypeClass"
import { IFunctor, IContainer, UF, NF, VALUE } from "./types"

/**
 * Functor函子
 */
export interface Functor<T> extends IFunctor {
	[VALUE]: T
	get value(): T
	map<R>(f: UF<T, R>): Functor<R>
}

export const Functor: FunctorFactory

export interface FunctorFactory {
	<T = any>(): FunctorD<T, T>
	<T>(data: T): Functor<T>
}

export interface FunctorD<A, B> extends IFunctor {
	[VALUE]: symbol
	get value(): UF<A, B>
	map<C>(f: UF<B, C>): FunctorD<A, C>
}

/**
 * Maybe函子
 */
export interface Maybe<T> extends IFunctor {
	[VALUE]: T | undefined
	get value(): T | undefined
	map<R>(f: UF<T, R>): Maybe<R>
	unwrap(defaultValue: T): T
}

export interface MaybeD<A, B> extends IFunctor {
	[VALUE]: symbol
	get value(): UF<A, B | undefined>
	map<C>(f: UF<B, C>): MaybeD<A, C>
	unwrap(defaultValue: B): MaybeD<A, B>
}

export const Maybe: MaybeFactory;

export interface MaybeFactory {
	<T = any>(): MaybeD<T, T>
	<T>(data: T): Maybe<T>
}

/**
 * Either函子
 */
export interface Either<T, E = Error> extends IFunctor {
	[VALUE]: E | T
	get value(): E | T
	map<R>(f: UF<T, R>): Either<R, E>
	catch<R>(f: UF<E, T>): Either<T, R>
}
export const Either: EitherFactory
interface EitherFactory {
	<T, E = Error>(data: T): Either<T, E>
}

/**
 * Match函子
 */
export interface Match<T> extends IFunctor {
	[VALUE]: T
	get value(): T
	map<R>(f: UF<T, R>): Match<R>
}

/**
 * Range函子，用于表式一个范围
 * 支持字母
 * 支持反向
 * 支持步长
 * 支持切片数组
 */
export interface Range extends Iterable<number> {
	[VALUE]: [number, number]
	get value(): [number, number]
	map(f: UF<[number, number], [number, number]>): Range
}
export const Range: UF<[number, number], Range>
export const $R: RangeFactory

export interface RangeFactory {
	(start: number, end: number): Range
	(end: number): Range
	(init: [number, number]): Range
	(inits: [number, number, number]): Range
	(inits: Range): Range
}

type IList = {
	[p in keyof Array<any> as Exclude<p,
		'length' | 'pop'
	>]: any
}

/**
 * List函子
 */
export interface List<T> extends IList {

	// 纯的留下
	// 不纯的改造或者删掉
	[VALUE]: T[]
	map<R>(f: UF<T, R>): List<R>
	push(value: T | Array<T>): List<T>
	pop(): List<T>
	slice(r: Range): List<T>
	slice(a: number, b: number): List<T>
	filter(predicete: UF<T, boolean>): List<T>
	sort(predicete: NF<[T, T], boolean>): List<T>
	reverse(): List<T>
	find(predicete: UF<T, boolean>): T | undefined
	findLast(predicete: UF<T, boolean>): T | undefined
	findIndex(predicete: UF<T, boolean>): number
	findIndexLast(predicete: UF<T, boolean>): number
	forEach(predicete: NF<[T, number], boolean>): List<T>
	length: number
	[Symbol.iterator](): Iterator<T>
	[index: number]: T
}

/**
 * Monad函子
 */
export interface Monad<T> extends Functor<T> {
	map<R>(f: UF<T, R>): Monad<R>
	flatMap<R extends IContainer<any>>(f: UF<T, R>): R extends IContainer<infer O> ? Monad<O> : never
}

export const Monad: MonadFactory;

export interface MonadFactory {
	<T>(data: T): Monad<T>
}

/**
 * Apply函子
 */
export interface Apply<A, B> extends IFunctor {
	[VALUE]: UF<A, B>
	get value(): UF<A, B>
	map<C, D>(f: UF<UF<A, B>, UF<C, D>>): Apply<C, D>
	apply(data: A): B
}

export const Apply: ApplyFactory;

export interface ApplyFactory {
	<A, B>(data: UF<A, B>): Apply<A, B>
}

/**
 * Unary函子
 */
export interface Unary<A, B> extends Apply<A, B> {
	map<C, D>(f: UF<UF<A, B>, UF<C, D>>): Apply<C, D>
	apply(data: A): B

	pipe<C>(f: UF<B, C>): Unary<A, C>
	comp<T>(f: UF<T, A>): Unary<T, B>
	chain<C>(f: Apply<B, C>): Unary<A, C>
}

export const Unary: UnaryFactory;

export interface UnaryFactory {
	<A, B>(f: UF<A, B>): Unary<A, B>
}