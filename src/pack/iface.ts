import { UF } from "@/types"

interface Functor {
   map<A, B>(f: (a: A) => B): Functor
   flatMap<A, B>(f: (a: A) => Functor): Functor
}

interface Option<T> {
   isSome(): boolean
   isNone(): boolean

   unwrap(): T
   unwrapOr(defaultValue: T): T
   unwrapOrElse(f: () => T): T

}


export interface Result<L, R> {
   isOk(): boolean
   isErr(): boolean

   ok(): Option<R>
   err(): Option<L>

   unwrap(): R
   unwrapOr(defaultValue: R): R
   unwrapOrElse(f: () => R): R

   map<U>(f: (value: R) => U): Result<L, U>
   mapErr<F>(f: (error: L) => F): Result<F, R>
   andThen<U>(f: (value: R) => Result<L, U>): Result<L, U>
}

export interface Range {
   start: number
   end: number
   step?: number
}

export interface PromiseLike<T> {
   then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) |
         null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>)
         | null): PromiseLike<TResult1 | TResult2>;
   catch<TResult = never>(

      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
   ): PromiseLike<T | TResult>;
   finally(onfinally?: (() => void) | null): PromiseLike<T>;

   await(): T | PromiseLike<T>;
}

export interface Wrapper<T> {
   value: T
   wrap<U>(value: U, f: UF): Wrapper<U>
}

export interface Feeder {
   feed(data: any): void
   getData(): any
   reset(): void
}

export interface Iterator <T> {
   next(): IteratorResult<T>
   skip(): void
   return(value?: any): IteratorResult<T>
   throw(e?: any): IteratorResult<T>
   [Symbol.iterator](): Iterator<T>
}

export interface Iterable<T> {
   [Symbol.iterator](): Iterator<T>
   forEach(callback: (value: T, index: number, array: Iterable<T>) => void): void
   map<U>(callback: (value: T, index: number, array: Iterable<T>) => U): Iterable<U>
   filter(callback: (value: T, index: number, array: Iterable<T>) => boolean): Iterable<T>
   reduce<U>(callback: (accumulator: U, value: T, index: number, array: Iterable<T>) => U, initialValue: U): U
   some(callback: (value: T, index: number, array: Iterable<T>) => boolean): boolean
   every(callback: (value: T, index: number, array: Iterable<T>) => boolean): boolean
   find(callback: (value: T, index: number, array: Iterable<T>) => boolean): T | undefined
   findIndex(callback: (value: T, index: number, array: Iterable<T>) => boolean): number
   includes(value: T): boolean
   indexOf(value: T): number
   lastIndexOf(value: T): number
   toArray(): T[]
   length(): number
   isEmpty(): boolean
   concat(...items: Iterable<T>[]): Iterable<T>
   slice(start?: number, end?: number): Iterable<T>

   flatMap<U>(callback: (value: T, index: number, array: Iterable<T>) => Iterable<U>): Iterable<U>
   flat(depth?: number): Iterable<T>
   reduceRight<U>(callback: (accumulator: U, value: T, index: number, array: Iterable<T>) => U, initialValue: U): U
   join(separator?: string): string
   toString(): string
   everyAsync(callback: (value: T, index: number, array: Iterable<T>) => Promise<boolean>): Promise<boolean>
   someAsync(callback: (value: T, index: number, array: Iterable<T>) => Promise<boolean>): Promise<boolean>
   findAsync(callback: (value: T, index: number, array: Iterable<T>) => Promise<boolean>): Promise<T | undefined>
   mapAsync<U>(callback: (value: T, index: number, array: Iterable<T>) => Promise<U>): Promise<Iterable<U>>
   filterAsync(callback: (value: T, index: number, array: Iterable<T>) => Promise<boolean>): Promise<Iterable<T>>
   reduceAsync<U>(callback: (accumulator: U, value: T, index: number, array: Iterable<T>) => Promise<U>, initialValue: U): Promise<U>
   forEachAsync(callback: (value: T, index: number, array: Iterable<T>) => Promise<void>): Promise<void>
   findIndexAsync(callback: (value: T, index: number, array: Iterable<T>) => Promise<boolean>): Promise<number>
}

export interface Collector<T> {
   collect(value: T): void
}

export interface Matcher<T> {

   match<U>(value: T, cases: { [key: string]: UF<T, U> }): U
   matchWith<U>(value: T, cases: { [key: string]: UF<T, U> }): U
   default<U>(f: UF<T, U>): Matcher<T>
}

export interface Singleton<T> {

}

export interface State<T> {
   get(): T
   set(value: T): void
   update(updater: UF<T, T>): void
   reset(): void
   subscribe(listener: UF<T, void>): () => void
   unsubscribe(listener: UF<T, void>): void
}

export interface Effect<T> {
   
}

export interface Builder<T> {
   builder(): T
   
}