import { Typu } from "@/shared"

const VALUE = Symbol('functor_value')
const EFLAG = Symbol('functor_eflag')

const SomeImpl = class Some {
   static of(value) {
      const tmp = new SomeImpl()
      tmp[VALUE] = value
      return tmp
   }

   get isSome() {
      return true
   }

   get isNone() {
      return false
   }
}

export const Some = SomeImpl.of

export const None = {
   get value() {
      return null
   },
   get isNone() {
      return true
   },
   get isSome() {
      return false
   }
}

const OptionImpl = class Option {
   static of(value) {
      const tmp = new Option()
      tmp[VALUE] = value
      return tmp
   }

   get isSome() {
      return this.value != null
   }

   get isNone() {
      return this.value == null
   }
}

export const Option = OptionImpl.of


const LeftImpl = class Left {
   static of(value) {
      const tmp = new Left()
      tmp[VALUE] = value
      return tmp
   }
   get value() {
      return this[VALUE]
   }
   get isOk() {
      return true
   }

   get isErr() {
      return false
   }
}

export const Left = (val) => LeftImpl.of(val, true)

const RightImpl = class Right {
   static of(value, isErr) {
      const tmp = new Right()
      tmp[VALUE] = value
      tmp[EFLAG] = true
      return tmp
   }

   get value() {
      return this[VALUE]
   }

   get isOk() {
      return false
   }

   get isErr() {
      return true
   }
}

export const Right = (val) => RightImpl.of(val, false)

const EitherImpl = class Either {
   static of(value) {
      const tmp = new Either()
      tmp[VALUE] = value
      return tmp
   }

   get value() {
      return this[VALUE]
   }

   get isOk() {
      return !this[EFLAG]
   }

   get isErr() {
      return Boolean(this[EFLAG])
   }
}


export const Either = function () {
   const tmp = EitherImpl.of
   tmp.from = (another) => {
      if (another.eflag) {
         return Right(another.value)
      } else {
         return Left(another.value)
      }
   }
   tmp.try = (f) => {
      return function (...args) {
         try {
            return Left(f.call(this, ...args))
         } catch (e) {
            return Right(e)
         }
      }
   }
   return tmp
}()

const SyncImpl = class Sync {
   static of(value) {
      const tmp = new Sync()
      tmp[VALUE] = value
      return tmp
   }

   get isSync() {
      return true
   }

   get isAsync() {
      return false
   }
}

export const Sync = SyncImpl.of

const AsyncImpl = class Async {
   static of(value) {
      const tmp = new Async()
      if (!Typu.isPromise(value)) {
         value = Promise.resolve(value)
      }
      tmp[VALUE] = value
      return tmp
   }

   get isSync() {
      return false
   }

   get isAsync() {
      return true
   }
}

export const Async = AsyncImpl.of

export const AwaityImpl = class Awaity {
   static of(value) {
      const tmp = new Awaity()
      tmp[VALUE] = value
      return tmp
   }

   get isSync() {
      return !Typu.isPromise(this.value)
   }

   get isAsync() {
      return Typu.isPromise(this.value)
   }

   map(f) {
      if (this.isSync) {
         return SyncImpl.of(f(this.value))
      } else {
         return AsyncImpl.of(this.value.then(f))
      }
   }

   then(res, rej) {
      if (this.isSync) {
         return SyncImpl.of(res(this.value))
      } else {
         return AsyncImpl.of(this.value.then(res, rej))
      }
   }
}

export const Awaity = function () {
   const a = AwaityImpl.of
   a.map = (a, f) => {
      if (Typu.isPromise(a)) {
         return a.then(f)
      } else {
         return f(a)
      }
   }
   return a
}()