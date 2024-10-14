import { test } from 'vitest'
import { $R, Monad, Maybe, Either, Apply, Unary, Functor } from '@lib/index'


test('range', () => {
	const r = $R(1, 4)

	const a = r.map(([a, b]) => [3, 8])

	console.log(a)

	for (const i of a) {
		console.log(i)
	}
})

test('Maybe', () => {
	const a = Maybe(3)
		.map(x => {
			const a = undefined as any
			return a as string
		})
		.map(x => parseInt(x))
		.unwrap(1)

	console.log(a)
})

test('Either', () => {
	const either = Either(4)

	const nv = either
		.map(x => parseInt(x + ''))
		.catch(err => {
			console.log('错误1', err)
			return 1
		})
		.map(x => {
			throw new Error
			return 123
		})
		.map(x => 's')
		.map(x => parseInt(x))
		.catch<Error>(err => {
			console.log('错误2', err)
			return 2
		})

	console.log(nv.value)
})

test('Monad', () => {
	const m = Monad(2)

	const str = m.map(x => x + '!')

	const str2 = str.flatMap(x => Maybe(342))

	console.log(str)

	console.log(str2)
})

test('Apply', () => {
	const apply = Apply((f: number) => { return f + 1 + "!" })

	console.log(apply.apply(2))
})

class User {
	name = 'zs'
	age = 19

	constructor(name: string, age: number) {
		this.name = name
		this.age = age
	}
}

test('Unary', () => {
	const f = Unary((a: string) => parseInt(a, 10) || 0)

	const ap = f.apply('123')
	console.log(ap)

	const pipeed = f.pipe(x => x + 3 > 10)

	console.log(pipeed.value('2s'))

	const comped = pipeed.comp((x: User) => x.name + "")

	console.log(comped.value(new User('33', 1)))

	const chianed = comped.chain(Unary(x => ({ isAdult: x })))

	console.log(chianed.value(new User('53', 3)))
})

test('Functor defered', () => {

	const functor = Functor(1)
	const functord = Functor<number>()
		.map(x => x + 1 + '!')

	console.log(functor.map(x => x + 1 + '!'))
	console.log(functord.map(x => x + '......'))

	const defered = functord.value
	console.log(defered(1))

	const d2 = functord.map(x => x + '.....').value(2)
	console.log(d2)
})

test('Maybe defered', () => {
	const maybe = Maybe<User>()
		.map((x: User) => x.name + "!!")
		.map((x: string) => parseInt(x) || 0)
		.map((x: number) => x > 10)
		.unwrap(false)

	console.log(maybe.value(new User('zs', 3)))
})
