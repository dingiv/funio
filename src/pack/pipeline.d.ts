import { Awaity, Either } from "@/shared";
import { Product } from "./pipe";

export const Pipe: PipeFactory
export const execPipeline: <T, R, CTX>(
   pipeline: Pipe[], product: Awaity<Product<T, R>>, ctx?: CTX
) => Either<T, R>

export const execAsyncPipeline: <T, R, CTX>(
   pipeline: Pipe[], product: Awaity<Product<T, R>>, ctx?: CTX
) => Promise<Either<T, R>>

export interface PipeConfig extends Record<string, any> {

}

export interface PipeProcessor<T, R> {
   (p: Either<T, R>): Either<T, R>;
   ctx: any
   cfg: PipeConfig
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

