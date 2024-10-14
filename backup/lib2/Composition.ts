const PIPE = Symbol()
const VALUE = Symbol()
const CATCH = Symbol()
export type Fc<A, R> = (arg: A, ctx?: Record<string, any>) => R

/**
 * 异步Pipe函子
 */
export class Compisition<A, R>  {
	[PIPE]: Fc<any, any>[]
	declare [CATCH]: Fc<any, R>

	constructor(f: Fc<Promise<A>, Promise<R>>)
	constructor(f: Fc<A, Promise<R>>)
	constructor(f: Fc<Promise<A>, R>)
	constructor(f: Fc<A, R>)
	constructor(f: any) {
		this[PIPE] = [f]
	}

	comp<E>(f: Fc<E, A>) {
		const tmp = new Compisition(f)
		for (let i = 0; i < this[PIPE].length; ++i) {
			tmp[PIPE].push(this[PIPE][i])
		}
		return <Compisition<Awaited<E>, Awaited<R>>>tmp
	}

	pipe<E>(f: Fc<R, E>) {
		const tmp = new Compisition(this[PIPE][0])
		for (let i = 1; i < this[PIPE].length; ++i) {
			tmp[PIPE].push(this[PIPE][i])
		}
		tmp[PIPE].push(f)
		return <Compisition<Awaited<A>, Awaited<E>>>tmp
	}

	catch(f: Fc<Error, R>) {
		this[CATCH] = f
		return this
	}

	declare [VALUE]: Fc<A, Promise<Awaited<R>>>
	get value() {
		// @ts-ignore
		if (!this[VALUE]) this[VALUE] = async (data: A) => {
			data = await data
			let ctx = {}
			for (const f of this[PIPE]) {
				try {
					data = await f(data, ctx)
				} catch (error) {
					if (this[CATCH]) return this[CATCH](error)
					else throw error
				}
			}
			return data
		}
		return this[VALUE]
	}
}