
/**
 * implement a simple Promise
 */
export class MyPromise {
	#status: 'pending' | 'fulfilled' | 'rejected' = 'pending'

	#result: any

	#onFulfilled: Function[] = []

	#onRejected: Function[] = []

	// static resolve(result: any) {
	// 	const p = new MyPromise(() => { })
	// 	p.#status = 'fulfilled'
	// 	p.#result = result
	// 	return p
	// }

	// static reject(reason: any) {
	// 	const p = new MyPromise(() => { })
	// 	p.#status = 'rejected'
	// 	p.#result = reason
	// 	return p
	// }

	#resolve(result: any) {
		if (this.#status === 'pending') {
			this.#status = 'fulfilled'
			this.#result = result
			queueMicrotask(() => this.#onFulfilled.forEach(f => f(result)))
		}
	}

	#reject(reason: any) {
		if (this.#status === 'pending') {
			this.#status = 'rejected'
			this.#result = reason
			queueMicrotask(() => this.#onRejected.forEach(f => f(reason)))
		}
	}

	then(fn: (result: any) => any) {
		if (this.#status === 'pending') {
			return new MyPromise((s, r) => {
				this.#onFulfilled.push((ret: any) => s(fn(ret)))
				this.#onRejected.push((ret: any) => r(ret))
			})
		} else if (this.#status === 'fulfilled') {
			return new MyPromise((s, r) => {
				s(fn(this.#result))
			})
		} else {
			return this
		}
	}

	catch(fn: (reason: any) => any) {
		if (this.#status === 'pending') {
			return new MyPromise((s, r) => {
				this.#onFulfilled.push((ret: any) => s(ret))
				this.#onRejected.push((ret: any) => r(fn(ret)))
			})
		} else if (this.#status === 'rejected') {
			return new MyPromise((s, r) => {
				r(fn(this.#result))
			})
		} else return this
	}

	constructor(fn: (resolve: (value: any) => void, reject: (reason: any) => void) => void) {
		try {
			fn((a) => this.#resolve(a), (a) => this.#reject(a))
		} catch (e) {
			this.#reject(e)
		}
	}
}
