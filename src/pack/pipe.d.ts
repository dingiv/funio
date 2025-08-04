import { Either } from "./functor"
import { UF } from "@/types"


export type Pipe = {
   process: Processor
   [key: string]: any
   isAwait?: boolean
   callback?: Function
}

export const Pipe: PipeConstructor

export type PipeConstructor = {
   of(process?: Processor, callback?: Function): Pipe
   awaitPipe: Pipe
}

export type Processor = {
   <L1, R1, L2, R2>(this: Pipe, data: Product<L1, R1>, ctx: PipeContext): Product<L2, R2>
}

export interface PipeContext extends Record<string, any> {
   callback: UF
   config: Pipe
}

export interface Product<L, R> {
   value: L | R
   eflag?: boolean
}
