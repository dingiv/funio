
export interface Stream {

}

export interface Iter<T> {
   [Symbol.iterator](): Iterator<T>
   [Symbol.asyncIterator](): AsyncIterator<T>

   map<U>(callback: (value: T, index: number, array: Iterable<T>) => U): Iterable<U>
   flatMap<U>(callback: (value: T, index: number, array: Iterable<T>) => Iterable<U>): Iterable<U>
   filter(callback: (value: T, index: number, array: Iterable<T>) => boolean): Iterable<T>
   reduce<U>(callback: (accumulator: U, value: T, index: number, array: Iterable<T>) => U, initialValue: U): U
   reverse(): Iterable<T>
   every(callback: (value: T, index: number, array: Iterable<T>) => boolean): boolean
   some(callback: (value: T, index: number, array: Iterable<T>) => boolean): boolean

   sort(compareFn?: (a: T, b: T) => number): Iterable<T>

   entries(): Iterable<[number, T]>
   concat(...items: Iterable<T>[]): Iterable<T>
   unique(f?: (a: T, b: T) => boolean): Iterable<T>

   take(pred: number | Function): Iterable<T>
   skip(pred: number | Function): Iterable<T>

   collect(): Iterable<T>
}

export const Iter: IterFactory

export interface IterFactory {
   <T>(iterable: Iterable<T>): Iter<T>

   of<T>(iterable: Iterable<T>): Iter<T>
   from<T>(iterable: Iterable<T>): Iter<T>
   forIn<T>(iterable: Iterable<T>): Iter<T>
   forOwn<T>(iterable: Iterable<T>): Iter<T>
   gen<T>(gen: () => Iterable<T>): Iter<T>
}