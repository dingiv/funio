import { Typu } from "@/shared"

const VALUE = Symbol('unpack_value')
const ERROR = Symbol('unpack_error')
const UnpackImpl = class Unpack {
   [VALUE] = null;
   [ERROR] = false;
   static of(value, error) { return new Unpack(value, error) }
   constructor(value, error) { this[VALUE] = value; this[ERROR] = !!error }
   get value() { return this[VALUE] }
   ok() { return this[ERROR] ? null : this.value }
   err() { return this[ERROR] ? this.value : null }
   isOk() { return !this[ERROR] }
   isErr() { return this[ERROR] }
   isSome() { return this[VALUE] != null }
   isNone() { return this[VALUE] == null }
}

export const Unpack = function () {
   const un = (value, error) => new UnpackImpl(value, error)
   un.from = (result) => new UnpackImpl(result.value, result.isError)
   un.awaityFrom = (result) => {
      if (Typu.isPromise(result)) {
         return result.then((x) => Unpack.from(x))
      } else {
         return Unpack.from(result)
      }
   }
   return un
}()
