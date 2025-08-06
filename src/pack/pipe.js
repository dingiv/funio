import { Either } from "./functor"
import { Lang, Typu } from "@/shared"

const PipeImpl = class Pipe {
   static of(process, callback) {
      const p = new Pipe()
      p.process = process
      p.callback = callback
      return p
   }

   process(product, state, ctx) {
      return product
   }

   callback(value) {
      return value
   }
}

export const Pipe = function () {
   const p = PipeImpl.of
   p.awaitPipe = PipeImpl.of(Lang.id)
   p.awaitPipe.isAwait = true
   return p
}()


export const onSomeOk = function (product, state, ctx) {
   if (product.value != null && !product.eflag) {
      return {
         value: this.callback.call(undefined, product.value, state, ctx, this),
      }
   }
   return product
}

export const onSomeNone = function (product, state, ctx) {
   if (product.value == null && !product.eflag) {
      return {
         value: this.callback.call(undefined, product.value, state, ctx, this),
      }
   }
   return product
}

export const onOk = function (product, state, ctx) {
   if (product.eflag) {
      return product
   }
   return {
      value: this.callback.call(undefined, product.value, state, ctx, this),
   }
}

export const onErr = function (product, state, ctx) {
   if (!product.eflag) {
      return product
   }
   return {
      value: this.callback.call(undefined, product.value, state, ctx, this),
   }
}

export const onDefault = function (product, state, ctx) {
   if (product.eflag || product.value == null) {
      return {
         value: this.callback.call(undefined, product.value, state, ctx, this),
      }
   }
   return product
}

export const onAll = function (product, state, ctx) {
   return {
      value: this.callback.call(undefined, product.value, state, ctx, this),
   }
}