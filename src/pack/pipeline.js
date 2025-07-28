import { Lang, Typu } from '@/shared';

export const Pipe = function () {
   class Pipe {
      callback = { 0: {/* ok */ }, 1: {/* err */ } }
      argument = null
      isAwait = false
      await() { this.isAwait = true; return this }
      onOk(f) { this.callback[0][0] = f; this.callback[0][1] = f; return this }
      onErr(f) { this.callback[1][0] = f; this.callback[1][1] = f; return this }
      onSome(f) { this.callback[0][0] = f; this.callback[1][0] = f; return this }
      onNone(f) { this.callback[0][1] = f; this.callback[1][1] = f; return this }
      onOkSome(f) { this.callback[0][0] = f; return this }
      onOkNone(f) { this.callback[0][1] = f; return this }
      onErrSome(f) { this.callback[1][0] = f; return this }
      onErrNone(f) { this.callback[1][1] = f; return this }
      constructor(onOkSome) { this.callback[0][0] = f }
   }
   const pipe = (f) => new Pipe(f)
   pipe.awaitPipe = { isAwait: true }
   return pipe
}()

export const execPipeline = (pipeline, data, isError, ctx) => {
   let callback = null
   isError = !!isError
   for (let index = 0; index < pipeline.length; index++) {
      const pipe = pipeline[index]
      try {
         if (pipe.isAwait) {
            return execAsyncLine(pipeline, data, isError, ctx, index + 1)
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
   return { value: data, isErr: isError }
}

const execAsyncLine = async (pipeline, data, isError, ctx, start) => {
   let callback = null
   for (let index = start; index < pipeline.length; ++index) {
      const pipe = pipeline[index]
      try {
         if (Typu.isPromise(data)) {
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
   try {
      if (Typu.isPromise(data)) {
         data = await data
      }
      return { value: data, isErr: isError }
   } catch (error) {
      return { value: error ?? Error('Unknown error'), isErr: true }
   }
}