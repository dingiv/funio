import { Lang, Typu } from '@/shared';

export const execSyncPipeline = (pipeline, product, state, ctx) => {
   let callback = null
   for (let index = 0; index < pipeline.length; index++) {
      const pipe = pipeline[index]
      try {
         product = pipe.process(product, state, ctx)
      } catch (error) {
         product = { value: error, eflag: true }
      }
   }
   return product
}

export const execAsyncPipeline = async (pipeline, product, state, ctx) => {
   let callback = null
   try {
      if (Typu.isPromise(product)) {
         product = await product
      }
   } catch (error) {
      product = { value: error, eflag: true }
   }
   for (let index = 0; index < pipeline.length; index++) {
      const pipe = pipeline[index]
      try {
         if (pipe.isAwait) {
            return execAsyncPipelineInner(pipeline, product, state, ctx, index + 1)
         }
         product = pipe.process(product, state, ctx)
      } catch (error) {
         product = { value: error, eflag: true }
      }
   }
   return product
}

const execAsyncPipelineInner = async (pipeline, product, state, ctx, start) => {
   try {
      product.value = await product.value
   } catch (error) {
      product = { value: error, eflag: true }
   }
   let callback = null
   for (let index = start; index < pipeline.length; ++index) {
      const pipe = pipeline[index]
      try {
         product = pipe.process(product, state, ctx)
         if (product.value instanceof Promise) {
            product.value = await product.value
         }
      } catch (error) {
         product = { value: error, eflag: true }
      }
   }
   return product
}