import { Awaity } from "@/types";
import { ResultWrapper } from "./unpack";

export const Pipe: PipeFactory
export const executePipeline: <T, R>(pipeline: Pipe[], data: T, isError: boolean, ctx?: R) => Awaity<ResultWrapper<T, R>>

export interface PipeProcessor<T, R> {
   (input: T, arg: any, thisArg?: any): R;
}

export interface Pipe<Input = any, Output = any> {
   callback: { 0: {}, 1: {} }
   argument: any
   args_(args: any): Pipe
   ok_some_(f: PipeProcessor<Input, Output>): Pipe
   ok_none_(f: PipeProcessor<Input, Output>): Pipe
   error_some_(f: PipeProcessor<Input, Output>): Pipe
   error_none_(f: PipeProcessor<Input, Output>): Pipe
   error_(f: PipeProcessor<Input, Output>): Pipe
}

export interface PipeFactory {

}

