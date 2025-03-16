import { ConstructorType, KeyType, NF, UF } from "@/types";


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
 * 接受一个构造函数和键数组，返回一个能够使用链式语法构建对象的函数
 * 因为 ts 不支持高阶类型，传入一个泛型类 class，工厂函数将会丢失泛型能力
*/
export const builder = <T extends ConstructorType>(cons: T, keys: KeyType[]): NF<ConstructorParameters<T>, Builder<InstanceType<T>>> => {
   let proto = {}
   for (const key of keys) {
      Reflect.set(proto, key, function (this: any, value: any) {
         Reflect.set(this[BUILDER_INSTANCE], key, value)
      })
   }
   Reflect.set(proto, '$build', function (this: any) {
      return this[BUILDER_INSTANCE]
   })
   return (...args: any) => {
      const tmp = Object.create(proto)
      tmp[BUILDER_INSTANCE] = new cons(...args)
      return tmp
   }
}

const BUILDER_INSTANCE = Symbol('builder-instance')

export type Builder<T extends object> = { [K in keyof T]: UF<T[K], Builder<T>>; } & { $build: T; }


/**
 * 接受一个 class 构造函数，返回一个能够使用链式语法构建对象的函数
 * 因为 ts 不支持高阶类型，传入一个泛型类 class，工厂函数将会丢失泛型能力
 */
export const dynamicBuilder = <T extends ConstructorType>(cons: T): NF<ConstructorParameters<T>, Builder<InstanceType<T>>> => {
   const clazz = cons
   const setter: Record<string, Function> = {}
   return ((...args: any[]) => {
      const instance = new clazz(...args)
      return DanymicBuilder(instance, setter)
   }) as any
}
const BUILDER_SETTER = Symbol('builder-setter')
const DanymicBuilder = <T extends object>(ins: T, setter: Record<string, Function>): Builder<T> => {
   return new Proxy({
      [BUILDER_INSTANCE]: ins,
      [BUILDER_SETTER]: setter
   }, builderProxyHandler) as Builder<T>
}

const builderProxyHandler: ProxyHandler<any> = {
   get(target, key) {
      if (key === '$build') {
         return target[BUILDER_INSTANCE]
      }
      let setter = target[BUILDER_SETTER][key]
      if (!setter) {
         let ins = target[BUILDER_INSTANCE]
         setter = target[BUILDER_SETTER][key] = (value: any) => {
            ins[key] = value
            return this
         }
      }
      return setter
   }
}