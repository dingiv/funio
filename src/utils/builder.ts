import { ConstructorType, KeyType, NF, UF, UF_P } from "@/types";


/**
 * 通过封装一个 class 构造函数，返回一个无须 new 即可实例化的工厂函数
 * 因为 ts 不支持高阶类型，传入一个泛型类 class，工厂函数将会丢失泛型能力
 */
export const factory = <T extends ConstructorType>(cons: T): Factory<T> => {
   const f = (...args: any[]) => new cons(...args)
   return new Proxy(f, {
      get(_, key) {
         return (cons as any)[key]
      }
   }) as any
}

export type Factory<T extends ConstructorType> = {
   [K in keyof T]: T[K];
} & ((...args: ConstructorParameters<T>) => InstanceType<T>);


/**
 * 接受一个工厂函数，使用工厂函数和链式调用的语法构造对象实例
 * 因为 ts 不支持高阶类型，传入一个泛型函数，builder 函数将会丢失泛型能力
 */
export const builder = <T extends NF>(factory: T): NF<Parameters<T>, Builder<ReturnType<T>>> => {
   const setter = {}
   return (...args: any[]) => dynamicBuilder(factory, args, setter) as any
}

const dynamicBuilder = <T extends object>(factory: NF, args: any[], setter: Record<string, Function>): Builder<T> => {
   const target = {
      [BUILDER_INSTANCE]: factory.apply(args),
      [BUILDER_SETTER]: setter,
      '$build': true
   }
   return new Proxy(target, builderProxyHandler) as Builder<T>
}

const BUILDER_INSTANCE = Symbol('builder-instance')
const BUILDER_SETTER = Symbol('builder-setter')

export const isBuilder = (maybeBuilder: any) => {
   if (!maybeBuilder) return false
   return BUILDER_INSTANCE in maybeBuilder && BUILDER_SETTER in maybeBuilder
}


export type Builder<T extends object> =
   { [K in keyof T]: UF<T[K], Builder<T>>; } &
   { [K: KeyType]: (...args: any[]) => Builder<T>; } &
   { $build: T; }

const builderProxyHandler: ProxyHandler<any> = {
   get(target, key) {
      if (key in target) {
         return target[BUILDER_INSTANCE]
      }
      let setter = target[BUILDER_SETTER][key]
      if (!setter) {
         let ins = target[BUILDER_INSTANCE]
         setter = target[BUILDER_SETTER][key] = function (value: any) {
            ins[key] = value
            return this
         }
      }
      return setter
   }
}


/**
 * 接受一个工厂函数，使用工厂函数和链式调用的语法构造对象实例
 */
builder.factory = <T extends NF>(factory: T): NF<Parameters<T>, Builder<ReturnType<T>>> => {
   const setter = {}
   return (...args: any[]) => dynamicBuilder(factory, args, setter) as any
}


/**
 * 接受一个 class 构造函数，返回一个能够使用链式构造对象的函数
 * 因为 ts 不支持高阶类型，传入一个泛型类 class，builder 5sasa函数将会丢失泛型能力
 */
builder.construct = <T extends ConstructorType>(cons: T): NF<ConstructorParameters<T>, Builder<InstanceType<T>>> => {
   const f = (...args: any[]) => new cons(...args)
   const setter = {}
   return (...args: any[]) => dynamicBuilder(f, args, setter) as any
}


/**
 * 接受一个对象作为模板，使用 for...in 循环，得到需要构造的键值对
 */
builder.template = <T extends Record<KeyType, any>>(template: T): UF_P<Partial<T>, Builder<T>> => {
   const map = new Map
   for (const key in template) {
      map.set(key, template[key])
   }
   const f = (init: Record<KeyType, any> = {}) => {
      const tmp = {}
      for (const key in map.keys()) {
         if (key in init) {
            Reflect.set(tmp, key, init[key])
         } else {
            Reflect.set(tmp, key, map.get(key))
         }
      }
      return tmp
   }
   const setter = {}
   return (...args: any[]) => dynamicBuilder(f, args, setter) as any
}


/**
 * 接受一个可迭代对象，从中获取 key，从而构造
*/
builder.from = <T extends ConstructorType>(keys: Iterable<KeyType> = []):
   NF<ConstructorParameters<T>, Builder<InstanceType<T>>> => {
   const setter = {}
   const f = () => ({})
   return (...args: any[]) => dynamicBuilder(f, args, setter) as any
}