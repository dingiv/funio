import { Primitive, ToPrimitive, UF, NF, } from "./types"

/**
 * 托管一个state，监听其生命周期
 */
export const useState: StateHookFactory

type Getter<T> = () => T
type Setter<T> = (newValOrSetter: T | UF<T, T>) => void
type Accessor<T extends Primitive> = [Getter<T>, Setter<T>]

interface StateHookFactory {
	<T extends Primitive>(init: T | (() => T)): Accessor<ToPrimitive<T>>
}

type ObjectAccessor<T extends Object> = {
	get(): T
	set(): T
}
export const useStore: StoreHookFactory
interface StoreHookFactory {
	<T extends Object>(init: T | (() => T)): ObjectAccessor<T>
}

export const useScope: ScopeHookFactory
interface ScopeHookFactory {
	<A extends any[], B>(scope: NF<A, B>): NF<A, B>
}


export const useOnce: OnceHookFactory
interface OnceHookFactory {
	<A extends any[], B>(f: NF<A, B>): NF<A, B>
	<A extends any[], B>(f: NF<A, B>, canExpire: true): [NF<A, B>, () => void]
	<A extends any[], B>(f: NF<A, B>, canExpire: false): NF<A, B>
}

export const useCache: CacheHookFactory
interface CacheHookFactory {
	<T, A extends any[]>(
		sourceFunction: (...args: A) => T,
		getKey?: (...args: A) => string,
		expiresTime?: number,
	): [NF<A, T>, (key: string, val: Awaited<T>) => Awaited<T>, (key: string | RegExp) => void]
}

export const useDebounce: DebounceHookFactory
interface DebounceHookFactory {
	<A extends any[], B>(f: NF<A, B>, delay?: number): NF<A, number>
}

export const useThrottle: ThrottleHookFactory
interface ThrottleHookFactory {
	<A extends any[], B>(f: NF<A, B>, delay?: number): NF<A, number>
}

export const useDefered: DeferedHookFactory
interface DeferedHookFactory {
	<A extends any[], B>(f: NF<A, B>, delay?: number): NF<A, number>
}

export const useCount: CountHookFactory
interface CountHookFactory {
	<A extends any[], B>(f: NF<A, B>, delay?: number): NF<A, B>
}