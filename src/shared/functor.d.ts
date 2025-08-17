import { NF, UF } from "@/types"

// abstract type
export type Option<T> = {
   get value(): T | undefined | null
   get isSome(): boolean
   get isNone(): boolean
}
export const Option: OptionFactory
export interface OptionFactory {
   <T>(value: T): Option<T>
   Some: SomeFactory
   None: None
}

export const Some: SomeFactory
export interface SomeFactory {
   <T extends NonNullable<unknown>>(value: T): Some<T>
}
export interface Some<T extends NonNullable<unknown>> extends Option<T> {
   get value(): T
}

export interface None extends Option<undefined | null> {
   get value(): undefined
}
export const None: None

// abstract type
export type Either<OK, ERR> = {
   get value(): OK | ERR
   get isOk(): boolean
   get isErr(): boolean
}

export interface Left<OK> extends Either<OK, any> {
   get value(): OK
}

export interface Right<ERR> extends Either<any, ERR> {
   get value(): ERR
}

export const Left: LeftFactory
export interface LeftFactory {
   <OK>(value: OK): Left<OK>
}

export const Right: RightFactory
export interface RightFactory {
   <ERR>(value: ERR): Right<ERR>
}

export const Either: EitherFactory
export interface EitherFactory {
   <OK, ERR>(value: OK): Left<OK>
   <ERR>(value: ERR, isErr: true): Right<ERR>
   <OK>(value: OK, isErr: false): Left<OK>
   from<OK, ERR = unknown>(result: { value: OK | ERR, eflag?: boolean }): Either<OK, ERR>
   try<Args extends any[], Ret, Err = unknown>(f: NF<Args, Ret>): NF<Args, Either<Ret, Err>>
}

// abstract type
export type Awaity<T> = {
   get value(): T | Promise<T>
   get isAsync(): boolean
   get isSync(): boolean
}

export interface Sync<T> extends Awaity<T> {
   get value(): T
}

export const Sync: SyncFactory
export interface SyncFactory {
   <T>(value: T): Sync<T>
}

export interface Async<T> extends Awaity<T> {
   get value(): Promise<T>
}
export const Async: AsyncFactory
export interface AsyncFactory {
   <T>(value: Promise<T>): Async<T>
}

export const Awaity: AwaityFactory
export interface AwaityFactory {
   <T>(value: T): Sync<T>
   <T>(value: Promise<T>): Async<T>
   from<T>(result: { value: T | Promise<T> }): Awaity<T>
   map<T, U>(awaity: Awaity<T>, f: UF<T, U>): Awaity<U>
}