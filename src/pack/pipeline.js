import { Typu } from '@/shared';

export const Pipe = function () {
   class Pipe {
      callback = { 0: {}, 1: {} }
      argument = null
      args_(args) { this.argument = args; return this }
      ok_some_(f) { this.callback[0][0] = f; return this }
      ok_none_(f) { this.callback[0][1] = f; return this }
      error_some_(f) { this.callback[1][0] = f; return this }
      error_none_(f) { this.callback[1][1] = f; return this }
      error_(f) { this.callback[1][0] = f; this.callback[1][1] = f; return this }
      constructor(f) { this.callback[0][0] = f }
   }
   const pipe = (f) => new Pipe(f)
   return pipe
}()

export const executePipeline = (pipeline, data, isError, ctx) => {
   let isAsync = false, index = 0, callback = null
   isError = !!isError
   for (index = 0; index < pipeline.length; index++) {
      const pipe = pipeline[index]
      try {
         if (Typu.isPromise(data)) {
            isAsync = true
            break
         }
         if (callback = pipe.callback[+isError][+Typu.isNone(data)]) {
            data = callback.call(ctx, data, pipe.argument, ctx)
            isError = false
         }
      } catch (error) {
         isError = true
         data = error ?? Error('Unknown error')
      }
   }
   if (isAsync) {
      return execAsyncLine(pipeline, data, ctx, index, isError)
   }
   return { value: data, isError }
}

const execAsyncLine = async (pipeline, data, ctx, start, isError) => {
   let callback = null
   for (let i = start; i < pipeline.length; ++i) {
      const pipe = pipeline[i]
      try {
         if (data instanceof Promise) {
            data = await data
         }
         if (callback = pipe.callback[+isError][+Typu.isNone(data)]) {
            data = callback.call(ctx, data, pipe.argument, ctx)
            isError = false
         }
      } catch (error) {
         isError = true
         data = error ?? Error('Unknown error')
      }
   }
   return { value: data, isError }
}