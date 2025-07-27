import { Awaity, BF, None, OUF, Result, Some, UF } from "@/types"
import { Pipe } from "./pipeline"
import { Unpack } from "./unpack"

export const Pack: PackFactory

export interface Pack<Arg, Val, Err = unknown> {
   get argv(): Arg
   run(arg?: Arg, ctx?: any): Pack<Val, Val, Err>
   get value(): Awaity<Unpack<Val, Err>>
   get unwrap(): unknown
   get func(): OUF<Arg, Awaity<Unpack<Val, Err>>>

   /**
    * Type utils for pack instance.
    */
   wrap<T>(arg: T): Pack<T, Val, Err>
   wrapErr<T>(arg: T): Pack<T, Val, Err>
   as<T>(value?: T): Pack<Arg, T, Err>
   errAs<T>(err?: T): Pack<Arg, Awaited<Val>, T>

   /**
    * Get the status of the pack.
    */
   get status(): number
   isStatus(statusCode: number): boolean
   get isSome(): boolean
   get isNone(): boolean
   get isOk(): boolean
   get isError(): boolean
   get isAsync(): boolean
   get isSync(): boolean

   /**
    * Map the value in the pack-pipeline.
    */
   map<T>(mapper: UF<Some<Val>, T>): Pack<Arg, Awaited<T>, Err>
   mapErr<T = Err>(mapper: UF<Some<Err>, T>): Pack<Arg, Awaited<Val>, T>

   /**
    * Status transformation helpers of the pack-pipeline.
   */
   maybe(mapper: UF<None, Val> | Val): Pack<Arg, Awaited<Val>, Err>
   catch(catcher: UF<Err, Val> | Val): Pack<Arg, Awaited<Val>, Err>
   default(defaultValue: Val): Pack<Arg, Awaited<Val>, Err>
   assert(predicate: UF<Arg, boolean>, error?: string): Pack<Arg, Awaited<Val>, Err>
   throw<T>(err: T): Pack<Arg, Awaited<Val>, T>


   /**
    * Advanced method to append pipeline.
    */
   pre<T>(p: UF<T, Arg>): Pack<T, Val, Err>
   pipe(p: Pipe): Pack<Arg, Val, Err>
   chain<Arg2, Val2, Err2 = unknown>(pack2: Pack<Arg2, Val2, Err2>): Pack<Arg2, Awaited<Val2>, Err2>

   /**
    * Promise-like interface.
    */
   then<TResult1, TResult2 = never>(
      onfulfilled?: UF<Some<Val>, TResult1>,
      onrejected?: UF<Err, TResult2>
   ): Pack<Arg, Awaited<TResult1>, Awaited<TResult2>>
   finally(onfinally?: () => void): Pack<Arg, Awaited<Val>, Err>

   /**
    * Stateful interface.
    */
   wrap<Arg2, Val2, Err2 = unknown>(wrapper: BF<Arg2, Pack<Arg, Val, Err>, Val2>): Pack<Arg2, Awaited<Val2>, Err2>
}

export interface PackFactory {
   <A = any>(value?: A): Pack<A, A>
}

