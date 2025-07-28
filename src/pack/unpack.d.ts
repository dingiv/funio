import { Option, Either, Awaity } from "@/types"

export interface Result<Val, Err> {
   value: Either<Val, Err>
   isErr: boolean
}

export const Unpack: UnpackFactory

export type Unpack<Val, Err> = {
   get value(): Either<Val, Err>
   get ok(): Option<Val>
   get err(): Option<Err>
   get isOk(): boolean
   get isErr(): boolean
   get isSome(): boolean
   get isNone(): boolean
}

export interface UnpackFactory {
   <Val, Err>(value: Val | Err, error: boolean): Unpack<Val, Err>
   from<Val, Err>(result: Result<Val, Err>): Unpack<Val, Err>
   awaityFrom<Val, Err>(result: Awaity<Result<Val, Err>>): Awaity<Unpack<Val, Err>>
}

export function mapAwaity<Val, Err>(result: Awaity<Result<Val, Err>>): Awaity<Unpack<Val, Err>>