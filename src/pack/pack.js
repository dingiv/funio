import { onErr } from "./pipe"
import { onSomeOk } from "./pipe"
import { execSyncPipeline, execAsyncPipeline } from "./pipeline"
import { Pipe } from "./pipe"
import { Lang, Typu, Awaity, Either } from "@/shared"
import { onSomeNone, onDefault, onAll } from "./pipe"

const INNER = Symbol('pack_awaity_either')
const PIPELINE = Symbol('pack_pipeline')
const CONTEXT = Symbol('pack_context')
const STATE = Symbol('pack_state')

const BasePack = class Pack {
   [INNER] = null; /* : Awaity<Either<Val, Err>> */
   [STATE] = null;
   get value() { return Awaity.map(this[INNER], (x) => x.value) }
   get pipeline() { return this[PIPELINE] }
   get isOk() { return Awaity.map(this[INNER], (x) => !x.eflag) }
   get isErr() { return Awaity.map(this[INNER], (x) => Boolean(x.eflag)) }
   get isSync() { return !Typu.isPromise(this[INNER]) }
   get isAsync() { return Typu.isPromise(this[INNER]) }
   get isSome() { return Typu.isSome(this.value) }
   get isNone() { return Typu.isNone(this.value) }

   as(_ret) { return this }
   asErr(_err) { return this }
   new(inner, pipeline) { Lang.throw('not implemented') }
   clone() {
      return this.new(this[INNER], this[PIPELINE].slice())
   }
   append(pipe) {
      return this.new(this[INNER], this[PIPELINE].concat(pipe))
   }

   ok(arg) {
      if (Typu.isPromise(arg)) {
         return this.new(arg.then(
            (x) => ({ value: x }),
            (x) => ({ value: x, eflag: true })
         ), this.pipeline.slice())
      }
      return this.new({ value: arg }, this.pipeline.slice())
   }
   err(err) {
      if (Typu.isPromise(err)) {
         return this.new(err.then(
            (x) => ({ value: x, eflag: true }),
            (x) => ({ value: x, eflag: true })
         ), this.pipeline.slice())
      }
      return this.new({ value: err, eflag: true }, this.pipeline.slice())
   }

   map(f) {
      return this.append(Pipe(onSomeOk, f))
   }
   mapErr(f) {
      return this.append(Pipe(function (product, ctx) {
         if (product.eflag) {
            return { value: f(product.value), eflag: true }
         }
         return product
      }))
   }

   exec(pipeline, product, state, ctx) { Lang.throw('not implemented') }
   get result() {
      return Either.from(this.exec(this.pipeline, this[INNER], this[CONTEXT]))
   }
   get unwrap() {
      return this.result.value
   }

   run(argv, state, ctx) {
      const inner = argv ? { value: argv } : this[INNER]
      const result = this.exec(this.pipeline, inner, state, ctx ?? this[CONTEXT])
      return this.new(result, [])
   }
   get func() {
      const pack = this
      function self(local, ctx) {
         const value = local ?? pack[INNER].value
         const result = pack.exec(pack.pipeline, { value }, self.state, ctx ?? pack[CONTEXT])
         return Either.from(result)
      }
      self.state = {}
      return self
   }

   get vague() {
      const pack = this
      function self(local, ctx) {
         const value = local ?? pack[INNER].value
         const result = pack.exec(pack.pipeline, { value }, self.state, ctx ?? pack[CONTEXT])
         return result.value
      }
      self.state = {}
      return self
   }

   get total() { return this.vague }

   maybe(f) {
      let cb = f
      if (!Typu.isFunction(f)) { cb = () => f }
      const p = Pipe(onSomeNone, cb)
      return this.append(p)
   }
   default(defaultValue) {
      const df = (_x) => defaultValue
      const p = Pipe(onDefault, df)
      return this.append(p)
   }
   catch(f) {
      let cb = f
      if (!Typu.isFunction(f)) { cb = () => f }
      const p = Pipe(onErr, cb)
      return this.append(p)
   }
   assert(f, err) {
      const p = Pipe(function (product, ctx) {
         if (!product.eflag && !f(product.value)) {
            return {
               value: err,
               eflag: true
            }
         }
         return product
      })
      return this.append(p)
   }
   throw(err) {
      const p = Pipe(function (product, ctx) {
         return { value: err ?? product.value, eflag: true }
      })
      return this.append(p)
   }

   then(res, rej) {
      const pipeline = this.pipeline.concat(Pipe(function (product, ctx) {
         if (product.eflag) {
            return { value: rej(product.value), eflag: true }
         } else {
            return { value: res(product.value) }
         }
      }))
      if (!this[STATE]) { this[STATE] = {} }
      const result = this.exec(pipeline, this[INNER], this[STATE], this[CONTEXT])
      return this.new(result, [])
   }

   ring(f) {
      const inner = this
      const p = Pipe(function (product, state, ctx) {
         if (!product.eflag) {
            return { value: f(product.value, state, inner), eflag: false }
         }
         return product
      })
      return this.new({ value: undefined }, [p])
   }

   static GENJ = Symbol('pack_genjector')
   gen(g, j) {
      const p = Pipe(function (product, state, ctx) {
         if (!product.eflag) {
            return { value: feed(g(product.value), j ?? ctx[Pack.GENJ]), eflag: false }
         }
         return product
      })
      return this.append(p)
   }

   provide() {

   }

   static MEMO = Symbol('pack_memo')
   memo(getKey = String) {
      const old = this
      const pipeline = old.pipeline
      const p = Pipe(function (product, state, ctx) {
         if (!product.eflag) {
            let memo = state[Pack.MEMO]
            if (!memo) {
               state[Pack.MEMO] = memo = {}
            }
            const key = getKey(product.value)
            let memoed = memo[key]
            if (memoed) {
               return memoed
            }
            return memo[key] = old.exec(pipeline, product, state, ctx)
         }
         return product
      })
      return this.new(old[INNER], [p])
   }
}

const SyncPack = class Pack extends BasePack {
   static of(inner, pipeline) {
      const p = new Pack()
      p[INNER] = inner
      p[PIPELINE] = pipeline ?? []
      return p
   }

   new(inner, pipeline) {
      const p = new Pack()
      p[INNER] = inner
      p[PIPELINE] = pipeline ?? []
      return p
   }

   exec(pipeline, product, state, ctx) {
      return execSyncPipeline(pipeline, product, state, ctx)
   }

   get await() {
      const p = AsyncPack.of(this[INNER], this[PIPELINE])
      return p.append(Pipe.awaitPipe)
   }



}

// 要求允许用户自定义扩展链，静态函数
export const Pack = function () {
   const p = (value) => {
      return SyncPack.of({ value }, [])
   }
   p.of = SyncPack.of
   p.clone = SyncPack.clone
   p.ok = (value) => SyncPack.of({ value }, [])
   p.err = (value) => SyncPack.of({ value, eflag: true }, [])
   p.wait = (value) => AsyncPack.of({ value }, [])
   return p
}()

const AsyncPack = class Pack extends BasePack {
   static of(inner, pipeline) {
      const p = new Pack()
      p[INNER] = inner
      p[PIPELINE] = pipeline ?? []
      return p
   }

   new(inner, pipeline) {
      const p = new Pack()
      p[INNER] = inner
      p[PIPELINE] = pipeline ?? []
      return p
   }

   exec(pipeline, product, state, ctx) {
      return execAsyncPipeline(pipeline, product, state, ctx)
   }

   get result() {
      return this.exec(this.pipeline, this[INNER], this[STATE], this[CONTEXT]).then(Either.from)
   }

   get unwrap() {
      return this.result.then((x) => x.eflag ? null : x.value)
   }

   get func() {
      const pack = this
      async function self(local, ctx) {
         const value = local ?? pack[INNER].value
         const result = await pack.exec(pack.pipeline, { value }, self.state, ctx ?? pack[CONTEXT])
         return Either.from(result)
      }
      self.state = {}
      return self
   }

   get vague() {
      const pack = this
      async function self(local, ctx) {
         const value = local ?? pack[INNER].value
         const result = await pack.exec(pack.pipeline, { value }, self.state, ctx ?? pack[CONTEXT])
         return result.value
      }
      self.state = {}
      return self
   }
}

const feed = (gen, injector) => {
   let value = undefined
   while (true) {
      let next = gen.next(value)
      if (next.done) {
         return next.value
      } else {
         value = injector(next.value)
      }
   }
}
