import { Container } from "./Container"
import { UF, VALUE } from "./TypeClass"


/**
 * 函子
 */
export class Functor<T> extends Container<T> {
	protected constructor(data: T) { super(data) }
	static of<T>(data: T) { return new Functor(data) }
	map<R>(f: UF<T, R>): Functor<R> { return Functor.of(f(this[VALUE])) }

	flatMap<R extends Container<any>>(f: UF<T, R>): R { return f(this[VALUE]) }
}
export const createFunctor = Functor.of

// export class Monad<T> extends Functor<T> {
// 	static of<T>(data: T) { return new Monad(data) }
// 	map<R>(f: UF<T, R>) { return Monad.of(f(this[VALUE])) }
// 	flatMap<R extends Container<any>>(f: UF<T, R>): R {
// 		return f(this[VALUE])
// 	}
// }

/**
 * 用以表示一个可能为空的值
 */
export class Maybe<T> extends Functor<T> {
	static of<T>(data: T) { return new Maybe(data) }
	map<R>(f: UF<T, R>): Maybe<NonNullable<R>>;
	map<R>(f: UF<T, R>): Maybe<R>;
	map<R>(f: UF<T, R>): Maybe<R> {
		const val = this[VALUE]
		if (val === undefined || val === null)
			return this as any
		return Maybe.of(f(this[VALUE]))
	}
	unwrap(data: T) {
		let val = this[VALUE]
		if (val === undefined || val === null) return data
		else return val
	}
}

type Either<E, T> = Left<E, T> | Right<E, T>
const _map = (f: Function, v: any) => {
	try {
		return Right.of(f(v))
	} catch (error) {
		return Left.of(error)
	}
}
export class Left<E = Error, T = any> extends Functor<T> {
	static of<E, T>(data: E): Either<E, T> { return new Left(data) as any }
	map<R>(f: UF<T, R>): Either<E, R>;
	map<R>(f: UF<T, R>): Either<E, R>;
	map<R>(f: UF<T, R>) { return this as any }

	catch<R>(f: UF<E, R>): Either<E, R> { return _map(f, this[VALUE]) as any }

	throw<R>(f: UF<E, R>): Either<R, T> {
		try {
			return Left.of(f(this[VALUE] as any as E)) as any
		} catch (error) {
			return Left.of(new Error('Either throw error') as any) as any
		}
	}
}
export class Right<E = Error, T = any> extends Functor<T> {
	static of<T>(data: T) { return new Right(data) }

	map<R>(f: UF<T, R>): Either<E, R>;
	map<R>(f: UF<T, R>): Either<E, R>;
	map<R>(f: UF<T, R>) { return _map(f, this[VALUE]) as any }

	catch<R>(f: UF<E, R>): Either<E, R> { return this as any }
}
export const Either = Right

// 用于表示一个值为函数的容器
export class Apply<A, B> extends Functor<UF<A, B>> {
	static of<A, B>(data: UF<A, B>): Apply<A, B>;
	static of<T>(data: T): Functor<T>;
	static of(data: any) {
		if (typeof data === 'function')
			return new Apply(data)
		return new Functor(data)
	}
	protected constructor(data: UF<A, B>) { super(data) }
	apply(data: Container<A>) {
		return Functor.of(this[VALUE](data[VALUE]))
	}
}

export class Effect<A, B> extends Apply<A, B> {

	map<R>(f: UF<UF<A, B>, R>): Effect<A, R>;
	map<R>(f: UF<UF<A, B>, R>): Effect<A, R>;
	map<R>(f: UF<UF<A, B>, R>): any {

	}
}


export class Task {

}

export class Observer {

}

