import { Pipe, execPipeline } from "./pipeline"
import { Lang, Typu } from "@/shared"
import { mapAwaity, Unpack } from "./unpack"

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
      return Pack.of(this.argv, this.pipe.concat(Pipe(f)))
   }
   mapErr(f) {
      const p = Pipe().onErr(f)
      return Pack.of(this.argv, this.pipe.concat(p))
   }

   get value() {
      const result = execPipeline(this.pipe, this.argv, this.isError, this)
      return mapAwaity(result)
   }
   get func() {
      const pack = this
      return function (local) {
         const result = execPipeline(pack.pipe, local ?? pack.argv, pack.isError, this)
         return mapAwaity(result)
      }
   }

   wrap(arg) { return Pack.of(arg, this.pipe.slice(), false) }
   wrapErr(err) { return Pack.of(err, this.pipe.slice(), true) }
   unwrap() {
      const result = execPipeline(this.pipe, this.argv, this.isError, this)
      if (Typu.isPromise(result.value)) {
         return result.value.then((x) => x.value)
      }
      return result.value
   }
   as(_ret) { return this }
   errAs(_err) { return this }

   default(defaultValue) {
      const df = (_x) => defaultValue
      const p = Pipe().onOkNone(df).onErr(df)
      return Pack.of(this.argv, this.pipe.concat(p))
   }
   maybe(f) {
      let cb = f
      if (!Typu.isFunction(f)) { cb = () => f }
      const p = Pipe().onOkNone(cb)
      return Pack.of(this.argv, this.pipe.concat(p))
   }
   catch(f) {
      let cb = f
      if (!Typu.isFunction(f)) { cb = () => f }
      const p = Pipe().onErr(cb)
      return Pack.of(this.argv, this.pipe.concat(p))
   }
   throw(err) {
      const rasie = () => { throw err }
      const p = Pipe(rasie).onOkNone(rasie).onErr(rasie)
      return Pack.of(this.argv, this.pipe.concat(p))
   }

   then(res, rej) {
      const pipeline = this.pipe.concat(Pipe.awaitPipe, Pipe().onOk(res).onErr(rej))
      const result = execPipeline(pipeline, this.argv, this.isError, this)
      return Pack.of(result, [
         Pipe.awaitPipe,
         Pipe().onOk((x) => {
            if (x.isErr) { Lang.throw(x.value) }
            return x.value
         })
      ], false)
   }
}

// 要求允许用户自定义扩展链，静态函数
export const Pack = (value) => {
   return PackImpl.of(value, [])
}