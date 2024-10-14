import { test } from 'vitest'
import { useState, useOnce, useCache } from '@/lib/hooks'
const state = useState(3)

test('useState', () => {

	const [count, setCount] = state

	console.log(count())

	// setCount(x => x + 2)

	console.log(count())
})

test('useOnce', () => {
	const [onceLog, expires] = useOnce((a: number) => {
		console.log(a)
		return a * 4
	}, true)

	console.log((onceLog(34)))
	console.log(onceLog(3))
	expires()
	console.log(onceLog(2))
})

test('useCache', () => {
	const [cachedRandom] = useCache((str: string) => {
		return Math.random()
	})

	console.log(cachedRandom('4'))
	console.log(cachedRandom('4'))
	console.log(cachedRandom('s'))
})

test('useDebounce', () => {
	setInterval(() => {
		console.log(123)
	}, 453)
})