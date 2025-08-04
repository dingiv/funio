import { BF, OUF, UF } from "@/types"
import { Pipe } from "./pipe"
import { Awaity, Either } from "./functor"

export const Pack: PackFactory

export interface PackFactory {
   <A = any>(value?: A): SyncPack<A, A>
}

export interface Pack<Val> {
   get value(): Val | Promise<Val>

   get isSome(): boolean
   get isNone(): boolean
   get isOk(): boolean
   get isErr(): boolean
   get isAsync(): boolean
   get isSync(): boolean

   /**
    * |isAsync|isErr|isNone|
    * |---|---|---|
    * |2^2|2^1|2^0|
    * |0400|0020|0001|
    */
   get status(): number
   isStatus(statusCode: number): boolean
}

export interface SyncPack<Val, Ok, Err = unknown> extends Pack<Val> {
   get value(): Val
   map<T>(mapper: UF<Ok, T>): SyncPack<Val, T, Err>
   get result(): Either<Ok, Err>
   get unwrap(): unknown
   run(argv?: Val, ctx?: any): SyncPack<Ok, Ok, Err>

   get func(): OUF<Val, Either<Ok, Err>>
   get vague(): OUF<Val, unknown>
   get total(): OUF<Val, number>

   /**
    * Type utils for pack instance.
    */
   ok<T>(arg: T): SyncPack<T, Ok, Err>
   err<T>(arg: T): SyncPack<T, Ok, Err>
   as<T>(value?: T): SyncPack<Val, T, Err>
   asErr<T>(err?: T): SyncPack<Val, Ok, T>
   mapErr<T = Err>(mapper: UF<Err, T>): SyncPack<Val, Ok, T>

   /**
    * Status transformation helpers of the pack-pipeline.
   */
   maybe(mapper: Ok | UF<undefined | null, Ok>): SyncPack<Val, Ok, Err>
   catch<T, E = unknown>(catcher: UF<Err, T>): SyncPack<Val, Awaited<T>, Awaited<E>>
   catch<T, E = unknown>(catcher: T): SyncPack<Val, Awaited<T>, Awaited<E>>
   default<T = unknown>(defaultValue: Ok): SyncPack<Val, Ok, T>
   assert<T = unknown>(predicate: UF<Val, boolean>, err?: T): SyncPack<Val, Ok, T>
   // expect. 左右括号 .end
   throw<T = unknown>(err: T): SyncPack<Val, Ok, T>

   /**
    * Advanced method to append pipeline.
    */
   pre<T>(p: UF<T, Val>): SyncPack<T, Ok, Err>
   pipe(p: Pipe): SyncPack<Val, Ok, Err>
   chain<Arg2, Val2, Err2 = unknown>(pack2: SyncPack<Arg2, Val2, Err2>): SyncPack<Arg2, Val2, Err2>

   /**
    * Promise-like interface.
    */
   get await(): AsyncPack<Awaited<Val>, Awaited<Ok>, Awaited<Err>>
   then<TResult1, TResult2 = never>(
      onfulfilled?: UF<NonNullable<Ok>, TResult1>,
      onrejected?: UF<Err, TResult2>
   ): SyncPack<TResult1, TResult1, TResult2>
   finally(onfinally?: () => void): SyncPack<Val, Ok, Err>

   /**
    * Stateful interface. 
    */
   ring<Arg2, Val2, Err2 = unknown>(wrapper: BF<Arg2, SyncPack<Val, Ok, Err>, Val2>): SyncPack<Arg2, Awaited<Val2>, Err2>
   hook(): void
   gen<T>(gf: UF<Ok, Generator<any, T, any>>): SyncPack<Val, Awaited<T>, Err>

   /**
    * utils
    */
   match: void

}


export interface AsyncPack<Val, Ok, Err = unknown> extends Pack<Val> {
   map<T>(mapper: UF<Ok, T>): AsyncPack<Val, Awaited<T>, Err>
   get value(): Promise<Val>
   get result(): Promise<Either<Ok, Err>>
   get unwrap(): Promise<unknown>
   run(argv?: Val, ctx?: any): AsyncPack<Ok, Ok, Err>

   get func(): OUF<Val, Promise<Either<Ok, Err>>>
   get vague(): OUF<Val, Promise<unknown>>
   get total(): OUF<Val, Promise<number>>

   /**
    * Type utils for pack instance.
    */
   ok<T>(arg: T): AsyncPack<Awaited<T>, Ok, Err>
   err<T>(arg: T): AsyncPack<Awaited<T>, Ok, Err>
   as<T>(value?: T): AsyncPack<Val, Awaited<T>, Err>
   asErr<T>(err?: T): AsyncPack<Val, Ok, Awaited<T>>
   mapErr<T = Err>(mapper: UF<Err, T>): AsyncPack<Val, Ok, Awaited<T>>

   /**
    * Status transformation helpers of the pack-pipeline.
   */
   maybe(mapper: Ok | UF<undefined | null, Ok>): AsyncPack<Val, Ok, Err>
   catch<T, E = unknown>(catcher: T): SyncPack<Val, Awaited<T>, Awaited<E>>
   catch<T, E = unknown>(catcher: UF<Err, T>): SyncPack<Val, Awaited<T>, Awaited<E>>
   default<T = unknown>(defaultValue: Ok): AsyncPack<Val, Ok, Awaited<T>>
   assert<T = unknown>(predicate: UF<Val, boolean>, err?: T): AsyncPack<Val, Ok, Awaited<T>>
   // expect. 左右括号 .end
   throw<T = unknown>(err: T): AsyncPack<Val, Ok, Awaited<T>>

   /**
    * Advanced method to append pipeline.
    */
   pre<T>(p: UF<T, Val>): AsyncPack<T, Ok, Err>
   pipe(p: Pipe): AsyncPack<Val, Ok, Err>
   chain<Arg2, Val2, Err2 = unknown>(pack2: AsyncPack<Arg2, Val2, Err2>): AsyncPack<Arg2, Val2, Err2>

   /**
    * Promise-like interface.
    */
   then<TResult1, TResult2 = never>(
      onfulfilled?: UF<NonNullable<Ok>, TResult1>,
      onrejected?: UF<Err, TResult2>
   ): AsyncPack<Val, TResult1, TResult2>
   finally(onfinally?: () => void): AsyncPack<Val, Ok, Err>

   /**
    * Stateful interface. 
    */
   wrap<Arg2, Val2, Err2 = unknown>(wrapper: BF<Arg2, AsyncPack<Val, Ok, Err>, Val2>): AsyncPack<Arg2, Awaited<Val2>, Err2>
}