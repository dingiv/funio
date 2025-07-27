import { Pipe, executePipeline } from "./pipeline"
import { Typu } from "@/shared"
import { Unpack } from "./unpack"

const ARGV = Symbol('pack_value')
const PIPE = Symbol('pack_pipeline')
const ERROR = Symbol('pack_error')
const PackImpl = class Pack {
   [ARGV] = undefined;
   [ERROR] = undefined;
   [PIPE] = [];
   get argv() { return this[ARGV] }
   get pipe() { return this[PIPE] }
   get isErr() { return this[ERROR] }

   static of(value, pipeline, isError) {
      const p = new Pack()
      p[ARGV] = value
      p[PIPE] = pipeline
      p[ERROR] = isError
      return p
   }
   static from(another) {
      return Pack.of(another[ARGV], another[PIPE], another[ERROR])
   }

   map(f) {
      return Pack.of(this.arg, this.pipe.concat(Pipe(f)))
   }
   mapErr(f) {
      const p = Pipe().error_(f)
      return Pack.of(this.arg, this.pipe.concat(p))
   }

   get value() {
      const result = executePipeline(this.pipe, this.arg, this.isError, this)
      return Unpack.awaityFrom(result)
   }
   get func() {
      const pack = this
      return function (local) {
         const result = executePipeline(pack.pipe, local, pack.isError, this)
         return Unpack.awaityFrom(result)
      }
   }
   
   wrap(arg) { return Pack.of(arg, this.pipe.slice(), false) }
   wrapErr(err) { return Pack.of(err, this.pipe.slice(), true) }
   unwrap() {
      const result = executePipeline(this.pipe, this.arg, this.isError, this)
      if (Typu.isPromise(result.value)) {
         return result.value.then((x) => x.value)
      }
      return result.value
   }
   as(_ret) { return this }
   errAs(_err) { return this }

   default(defaultValue) {
      const df = (_x) => defaultValue
      const p = Pipe().ok_none_(df).error_(df)
      return Pack.of(this.arg, this.pipe.concat(p))
   }
   maybe(f) {
      let cb = f
      if (!Typu.isFunction(f)) { cb = () => f }
      const p = Pipe().ok_none_(cb)
      return Pack.of(this.arg, this.pipe.concat(p))
   }
   catch(f) {
      let cb = f
      if (!Typu.isFunction(f)) { cb = () => f }
      const p = Pipe().error_(cb)
      return Pack.of(this.arg, this.pipe.concat(p))
   }
   throw(err) {
      const rasie = () => { throw err }
      const p = Pipe(rasie).ok_none_(rasie).error_(rasie)
      return Pack.of(this.arg, this.pipe.concat(p))
   }

   then(res, rej) { return this.value }
}

// 要求允许用户自定义扩展链，静态函数
export const Pack = (value) => {
   if (value instanceof Promise) {
      value = value.catch((err) => err)
   }
   return PackImpl.of(value, [])
}