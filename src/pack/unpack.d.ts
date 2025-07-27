import { Result, Option, Awaity } from "@/types"

export const Unpack: UnpackFactory

export type Unpack<Val, Err> = {
   get value(): Result<Val, Err>
   get ok(): Option<Val>
   get err(): Option<Err>
   get isOk(): boolean
   get isErr(): boolean
   get isSome(): boolean
   get isNone(): boolean
}

export interface UnpackFactory {
   <Val, Err>(value: Val | Err, error: boolean): Unpack<Val, Err>
   from<Val, Err>(result: ResultWrapper<Val, Err>): Unpack<Val, Err>
   awaityFrom<Val, Err>(result: Awaity<ResultWrapper<Val, Err>>): Awaity<Unpack<Val, Err>>
}

export interface ResultWrapper<Val, Err> {
   value: Result<Val, Err>
   isError: boolean
}