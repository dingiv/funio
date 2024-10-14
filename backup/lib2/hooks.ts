import { MF, Primitive, UF } from "./TypeClass"



type Accessor<T> = [() => T, (val: Setter<T>) => void]
type Initer<T> = T | ((...args: any) => T)
type Setter<T> = T | ((val: T) => T)

/**
 * useState
 * 管理一个状态
 */
export function useState<T extends boolean>(init: Initer<T>): Accessor<boolean>
export function useState<T extends number>(init: Initer<T>): Accessor<number>
export function useState<T extends bigint>(init: Initer<T>): Accessor<bigint>
export function useState<T extends string>(init: Initer<T>): Accessor<string>
export function useState<T extends symbol>(init: Initer<T>): Accessor<symbol>
export function useState<T extends undefined>(init: Initer<T>): Accessor<undefined>
export function useState<T extends null>(init: Initer<T>): Accessor<null>
export function useState<T extends Primitive>(init: Initer<T>): Accessor<T> {
	if (typeof init === 'function') {
		let data: any
		let inited = false

		const set = (val: any) => {
			if (!inited) {
				inited = true
				data = (init as Function)()
			}
			if (typeof val === 'function')
				return data = val(data)
			return data = val
		}

		const get = () => {
			if (inited) return data
			return data = (init as Function)()
		}

		return [get, set] as any
	} else {
		return [
			() => init as T,
			(val: any) => {
				if (typeof val === 'function')
					return init = val(init)
				return init = val
			}
		]
	}
}

type Hook<A1, R1, A2, R2, E, F, G> = {
	beforeCreate?: UF<A1, void>,
	created?: UF<A2, void>,
	beforeUpdate?: UF<E, F>,
	updated?: UF<unknown, unknown>,
	beforeDispose?: UF<unknown, unknown>,
	disposed?: UF<unknown, unknown>,
}

function useState2<A extends any[], R>(factory: MF<A, R>, hooks: any) {

	return (...args: A) => {

	}
}

/**
 * useStore
 * 创建一个复杂类型的状态
 */
export function useStore() {

}

/**
 * useSingleton
 * 将一个工厂函数包装为一个单例对象工厂函数
 */
export function useOnce<A extends any[], R, L extends (...args: A) => R>(factory: L): L
export function useOnce<A extends any[], R, L extends (...args: A) => R>(factory: L, canExpire: false): L
/**
 * 将一个工厂函数包装为一个单例对象工厂函数
 * @returns [factoryFn: typeof factory, expire: ()=>void]
 */
export function useOnce<A extends any[], R, L extends (...args: A) => R>(factory: L, canExpire: true): [L, () => void]
export function useOnce<A extends any[], R>(factory: (...args: A) => R, canExpire?: boolean): any {
	let result: R | undefined
	let flag = false
	const ret = (...args: A) => {
		if (flag) return result
		return result = factory(...args)
	}
	if (!canExpire) return ret
	return [ret, () => flag = false]
}




/**
 * 使用一个函数作为数据源，返回一对取值函数，get时将会调用数据源函数，如果计算过该值则返回缓存
 * 为了减少不可预测的行为，该函数应当尽量选择为纯函数，或者是只读脏函数
 * @param expiresTime 过期时间 单位毫秒
 */
export function useCache<T, A extends any[]>(
	sourceFunction: (...args: A) => T,
	getKey?: (...args: A) => string,
	expiresTime?: number,
) {
	const map = new Map<string, T>()
	const timeout = new Map<any, number>()
	expiresTime || (expiresTime = Number.MAX_SAFE_INTEGER)
	const RANDOM_KEY = String(Math.random())
	const defaultGetKey = (...x: A) => String(x[0]) || RANDOM_KEY
	const _getKey = getKey || defaultGetKey

	return [
		function get(...args: A) {
			const key = _getKey(...args)
			if (map.has(key) && (Date.now() - timeout.get(key)!) < expiresTime!)
				return map.get(key)!
			const newOne = sourceFunction(...args)
			if (newOne instanceof Promise) {
				newOne.then((val) => {
					map.set(key, val)
					timeout.set(key, Date.now())
				})
			} else {
				map.set(key, newOne)
				timeout.set(key, Date.now())
			}
			return newOne
		},
		function set(key: string, val: Awaited<T>) {
			map.set(key, val)
			timeout.set(key, Date.now())
			return val
		},
		function expire(key: string | RegExp) {
			if (typeof key === 'string') {
				map.delete(key)
				timeout.delete(key)
			} else {
				for (const _key of map.keys()) {
					if (_key.match(key)) map.delete(_key)
				}
			}
		},
	] as const
}

/**
 * 使用是一个依赖数组
 */
export function useMemo<A extends any[], R>(factory: (...args: A) => R) {
	let memo: any
	let arr: any[] = [Math.random()]
	return (depends: any[], ...args: A): R => {
		if (!Array.isArray(depends) || compareArray(depends, arr)) return memo
		else {
			arr = depends
			return memo = factory(...args)
		}
	}
}
const compareArray = (a: any[], b: any[]) => {
	if (a.length !== b.length) return false
	for (let i = 0, len = a.length; i < len; ++i) {
		if (a[i] !== b[i]) return false
	}
	return true
}

/**
 * 创建一个自主清除副作用的脏函数，该函数某次调用所产生的副作用将会在函数下一次调用时清除
 * @param effect 带有副作用的函数，该函数需要返回其值，并且附带一个清除该次调用产生的副作用的clear函数
 */
export function useEffect<A extends any[], R>(effect: ((...args: A) => [R, () => void])) {
	let prev: Function
	return (...args: A) => {
		if (prev) prev()
		const tmp = effect(...args)
		prev = tmp[1]
		return tmp[0]
	}
}


/**
 * useEffect
 * 
 */
export function useDebounce() {

}

export function useThrottle() {

}

export function useDefered<A extends any[], B>(f: MF<A, B>, delay = 0) {
	let stop
	return (...args: A) => {
		return setTimeout(f, delay, ...args)
	}
}

/**
 * 返回一个迭代n的函数，当predicate返回为真的时候，执行否则返回上次执行的值
 */
export function useCount<A extends any[], B>(f: MF<A, B>, predicate: (count: number) => boolean = () => true) {
	let count = 0
	let ret: any
	return (...args: A) => {
		const canDO = predicate(count++)
		if (canDO) ret = f(...args)
		return ret
	}
}