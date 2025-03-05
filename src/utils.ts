import { Pack } from "./cnp/pack"
import { ConstructorType, NF, RD, UF } from "./types"

export function reverse(object: any) {
   const tmp = {}
   for (const key in object) {
      const ret = object[key]
      const a = Reflect.get(tmp, ret)
      if (a) {
         if (Array.isArray(a)) {
            a.push(key)
         } else {
            Reflect.set(tmp, ret, [a, key])
         }
      } else {
         Reflect.set(tmp, ret, key)
      }
   }
   return tmp
}

export const zip = (keyList: Iterable<any>, valueList: Iterable<any>) => {
   const tmp = {}
   const it = valueList[Symbol.iterator]()
   for (const key of keyList) {
      Reflect.set(tmp, key, it.next().value)
   }
   return tmp
}

export const fromEntries = Object.fromEntries

export const assign = (from: any, to: any) => {
   for (const key in from) {
      to[key] = from[key]
   }
}

export const clone = (target: any) => {
   return JSON.parse(JSON.stringify(target))
}

export const deepClone = (target: any): any => {
   if (target instanceof Array) {
      return target.map(deepClone)
   } else if (target instanceof Object) {
      const tmp = {}
      for (const key in target) {
         Reflect.set(tmp, key, deepClone(target[key]))
      }
      return tmp
   } else {
      return target
   }
}

// export type Factory<T extends ConstructorType> = {
//    [K in keyof T]: T[K];
// } & ((...args: ConstructorParameters<T>) => InstanceType<T>);

export type Factory<T extends ConstructorType> = {
   [K in keyof T]: T[K];
} & (<A>(...args: ConstructorParameters<T>) => InstanceType<T>);

export const factory = <T extends ConstructorType>(cons: T): Factory<T> => {
   const f = (...args: any[]) => new cons(...args)
   return new Proxy(f, {
      get(_, key) {
         return (cons as any)[key]
      }
   }) as any
}

type Builder<T extends object> = { [K in keyof T]: UF<T[K], Builder<T>>; } & { $build: T; }
const BUILDER_INSTANCE = Symbol('builder-instance')
const BUILDER_SETTER = Symbol('builder-setter')
const BUILDER_PROXY = Symbol('builder-proxy')

const Builder = <T extends object>(ins: T, setter: Record<string, Function>): Builder<T> => {
   const b: any = { [BUILDER_INSTANCE]: ins, [BUILDER_SETTER]: setter }
   const p = new Proxy(b, builderProxyHandler) as Builder<T>
   b[BUILDER_PROXY] = p
   return p
}

const builderProxyHandler: ProxyHandler<any> = {
   get(target, key) {
      if (key === '$build') {
         return target[BUILDER_INSTANCE]
      }
      let setter = target[BUILDER_SETTER][key]
      if (!setter) {
         let ins = target[BUILDER_INSTANCE]
         setter = target[BUILDER_SETTER][key] = function (value: any) {
            ins[key] = value
            return target[BUILDER_PROXY]
         }
      }
      return setter
   }
}

/**
 * 接受一个 class 构造函数，返回一个能够使用链式语法构建对象的函数
 */
export const builder = <T extends ConstructorType>(cons: T): NF<ConstructorParameters<T>, Builder<InstanceType<T>>> => {
   const clazz = cons
   const setter: Record<string, Function> = {}
   return ((...args: any[]) => {
      const instance = new clazz(...args)
      return Builder(instance, setter)
   }) as any
}

const asyncGenerate = async (next: any, gen: Generator) => {
   let { value, done } = next
   while (!done) {
      if (value instanceof Promise) {
         value = await value
      }
      next = gen.next(value)
      value = next.value
      done = next.done
   }
   return value
}

export const divide = <A extends any[], R extends any>(genFunc: (...args: A) => Generator<any, R, unknown>): NF<A, Pack<R>> => {
   return ((...args: A) => {
      const gen = genFunc(...args)
      let next = gen.next()
      let isAsync = false
      while (!next.done) {
         if (next.value instanceof Promise) {
            isAsync = true
            break
         }
         next = gen.next(next.value)
      }
      if (isAsync) {
         return asyncGenerate(next, gen)
      } else {
         return next.value
      }
   }) as NF<A, Pack<R>>
}

export const freeze = (obj: any) => {
   Object.freeze(obj)
   Object.values(obj).forEach(v => {
      if (typeof v === 'object') {
         freeze(v)
      }
   })
}
