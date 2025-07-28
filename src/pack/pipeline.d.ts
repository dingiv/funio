import { Awaity } from "@/types";
import { Result } from "./unpack";

export const Pipe: PipeFactory
export const execPipeline: <T, R, CTX>(
   pipeline: Pipe[], argv: T, isErr: boolean, ctx?: CTX
) => Awaity<Result<T, R>>

export interface PipeProcessor<T, R> {
   (input: T, arg: any, thisArg?: any): R;
}

export interface Pipe {
   callback: { 0: {}, 1: {} }
   argument: any
   await(): Pipe
   onOk<T, R>(f: PipeProcessor<T, R>): Pipe
   onErr<T, R>(f: PipeProcessor<T, R>): Pipe
   onErr<T, R>(f: PipeProcessor<T, R>): Pipe
   onSome<T, R>(f: PipeProcessor<T, R>): Pipe
   onNone<T, R>(f: PipeProcessor<T, R>): Pipe
   onOkSome<T, R>(f: PipeProcessor<T, R>): Pipe
   onOkNone<T, R>(f: PipeProcessor<T, R>): Pipe
   onErrSome<T, R>(f: PipeProcessor<T, R>): Pipe
   onErrNone<T, R>(f: PipeProcessor<T, R>): Pipe
}

export interface PipeFactory {
   <T, R>(onOkSome?: PipeProcessor<T, R>): Pipe
   awaitPipe: Pipe
}

