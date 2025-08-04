import { PropKey } from '@/types'

export * from './builder'

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

export const zip = <K extends PropKey, V>(keyList: Iterable<K>, valueList: Iterable<V>) => {
   const tmp: Record<K, V> = {} as any
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

export const freeze = (obj: any) => {
   Object.freeze(obj)
   Object.values(obj).forEach(v => {
      if (typeof v === 'object') {
         freeze(v)
      }
   })
}