import { UF } from "./TypeClass"

export function pipeline<A, B>(f1: UF<A, B>): UF<A, B>;
export function pipeline<A, B, C>(f1: UF<A, B>, f2: UF<B, C>): UF<A, C>;
export function pipeline<A, B, C, D>(f1: UF<A, B>, f2: UF<B, C>, f3: UF<C, D>): UF<A, D>;
export function pipeline<A, B, C, D, E>(f1: UF<A, B>, f2: UF<B, C>, f3: UF<C, D>, f4: UF<D, E>): UF<A, E>;
export function pipeline<A, B, C, D, E, F>(f1: UF<A, B>, f2: UF<B, C>, f3: UF<C, D>, f4: UF<D, E>, f5: UF<E, F>): UF<A, F>;
export function pipeline<A, B, C, D, E, F, G>(f1: UF<A, B>, f2: UF<B, C>, f3: UF<C, D>, f4: UF<D, E>, f5: UF<E, F>, f6: UF<F, G>): UF<A, G>;
export function pipeline<T extends Function[]>(...functions: T): UF<any, any>;
export function pipeline(...functions: ((data: any) => any)[]) {
	return (data: any) => {
		for (let i = 0, len = functions.length; i < len; ++i) {
			data = functions[i](data)
		}
		return data
	}
}

export function pipelineAsync<A, B>(f1: UF<A, B>): UF<A, Promise<Awaited<B>>>;
export function pipelineAsync<A, B, C>(f1: UF<A, B>, f2: UF<B, C>): UF<A, Promise<Awaited<C>>>;
export function pipelineAsync<A, B, C, D>(f1: UF<A, B>, f2: UF<B, C>, f3: UF<C, D>): UF<A, Promise<Awaited<D>>>;
export function pipelineAsync<A, B, C, D, E>(f1: UF<A, B>, f2: UF<B, C>, f3: UF<C, D>, f4: UF<D, E>): UF<A, Promise<Awaited<E>>>;
export function pipelineAsync<A, B, C, D, E, F>(f1: UF<A, B>, f2: UF<B, C>, f3: UF<C, D>, f4: UF<D, E>, f5: UF<E, F>): UF<A, Promise<Awaited<F>>>;
export function pipelineAsync(...functions: ((data: any) => any)[]): UF<any, Promise<Awaited<any>>>;
export function pipelineAsync(...functions: ((data: any) => any)[]) {
	return async (data: any) => {
		for (let f of functions) { data = await f(data) }
		return data
	}
}

export function compose<A, B>(f1: UF<A, B>): UF<A, B>;
export function compose<A, B, C>(f2: UF<B, C>, f1: UF<A, B>): UF<A, C>;
export function compose<A, B, C, D>(f3: UF<C, D>, f2: UF<B, C>, f1: UF<A, B>): UF<A, D>;
export function compose<A, B, C, D, E>(f4: UF<D, E>, f3: UF<C, D>, f2: UF<B, C>, f1: UF<A, B>,): UF<A, E>;
export function compose<A, B, C, D, E, F>(f5: UF<E, F>, f4: UF<D, E>, f3: UF<C, D>, f2: UF<B, C>, f1: UF<A, B>): UF<A, F>;
export function compose(...functions: ((data: any) => any)[]) {
	return (data: any) => {
		for (let i = functions.length - 1; i >= 0; --i) {
			data = functions[i](data)
		}
		return data
	}
}


// type FF<T extends any[]> = T extends [infer F1, ...infer R]?

/**
 * 科里化
 */
export function curry<A, B>(f: (a: A) => B): CurryFunction1<A, B>;
export function curry<A, B, C>(f: (a: A, b: B) => C): CurryFunction2<A, B, C>;
export function curry<A, B, C, D>(f: (a: A, b: B, c: C) => D): CurryFunction3<A, B, C, D>;
export function curry<A, B, C, D, E>(f: (a: A, b: B, c: C, d: D) => E): CurryFunction4<A, B, C, D, E>;
export function curry<A, B, C, D, E, F>(f: (a: A, b: B, c: C, d: D, e: E) => F): CurryFunction5<A, B, C, D, E, F>;
export function curry<A, B, C, D, E, F, G>(f: (a: A, b: B, c: C, d: D, e: E, f: F) => G): CurryFunction6<A, B, C, D, E, F, G>;
export function curry(func: Function) {
	return function curried(this: any, ...args: any[]) {
		if (args.length >= func.length) {
			return func.apply(this, args);
		} else {
			return function (this: any, ...args2: any[]) {
				return curried.apply(this, args.concat(args2));
			}
		}
	};
}

interface CurryFunction1<A, B> {
	(a: A): B
}

interface CurryFunction2<A, B, C> {
	(a: A): CurryFunction1<B, C>
	(a: A, b: B): C
}

interface CurryFunction3<A, B, C, D> {
	(a: A): CurryFunction2<B, C, D>
	(a: A, b: B): CurryFunction1<C, D>
	(a: A, b: B, c: C): D
}

interface CurryFunction4<A, B, C, D, E> {
	(a: A): CurryFunction3<B, C, D, E>
	(a: A, b: B): CurryFunction2<C, D, E>
	(a: A, b: B, c: C): CurryFunction1<D, E>
	(a: A, b: B, c: C, d: D): E
}

interface CurryFunction5<A, B, C, D, E, F> {
	(a: A): CurryFunction4<B, C, D, E, F>
	(a: A, b: B): CurryFunction3<C, D, E, F>
	(a: A, b: B, c: C): CurryFunction2<D, E, F>
	(a: A, b: B, c: C, d: D): CurryFunction1<E, F>
	(a: A, b: B, c: C, d: D, e: E): F
}

interface CurryFunction6<A, B, C, D, E, F, G> {
	(a: A): CurryFunction5<B, C, D, E, F, G>
	(a: A, b: B): CurryFunction4<C, D, E, F, G>
	(a: A, b: B, c: C): CurryFunction3<D, E, F, G>
	(a: A, b: B, c: C, d: D): CurryFunction2<E, F, G>
	(a: A, b: B, c: C, d: D, e: E): CurryFunction1<F, G>
	(a: A, b: B, c: C, d: D, e: E, f: F): G
}

// export function curry(f: Function) {
// 	const len = f.length
// 	const arr: any[] = []
// 	const tmp = (...args: any[]) => {

// 		arr.push(...args)
// 		if (arr.length >= len)
// 			return f(...arr)
// 		else
// 			return tmp

// 	}
// 	return tmp
// }

