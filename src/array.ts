
enum MapType {
   REAL, // boolean, number, bigint, string, symbol
   NIL, // null, undefined
   ARRAY,
   SET,
   MAP,
   ITER, // iterable but not array, set, map
   RECORD, // normal object access by key
}

const mapType = (data: any): MapType => {
   if (Array.isArray(data)) {
      return MapType.ARRAY
   }
   switch (typeof data) {
      case 'object':
         if (data === null) {
            return MapType.NIL
         }
         if (!data[Symbol.iterator]) {
            return MapType.RECORD
         }
         if (data instanceof Set) {
            return MapType.SET
         } else if (data instanceof Map) {
            return MapType.MAP
         } else {
            return MapType.ITER
         }
      case 'undefined':
         return MapType.NIL
      default:
         return MapType.REAL
   }
}

type Collector = (data: any, fn: any, initial: any, ctx: any) => any

const mapCollectors: Record<MapType, Collector> = {
   [MapType.REAL](data: any, fn: any, initial: any, ctx: any) {
      return fn(data, 0, initial)
   },
   [MapType.NIL](data: any, fn: any, initial: any, ctx: any) {
      return fn(null, 0, initial)
   },
   [MapType.ARRAY](data: any, fn: any, initial: any, ctx: any) {
      const result = []
      let count = 0
      for (const item of data) {
         result.push(fn(item, count++, initial))
      }
      return result
   },
   [MapType.SET](data: any, fn: any, initial: any, ctx: any) {
      const result = new Set()
      let count = 0
      for (const item of data) {
         result.add(fn(item, count++, initial))
      }
      return result
   },
   [MapType.MAP](data: any, fn: any, initial: any, ctx: any) {
      const result = new Map()
      for (const item of data) {
         result.set(item[0], fn(item[1], item[0], initial))
      }
      return result
   },
   [MapType.ITER](data: any, fn: any, initial: any, ctx: any) {
      const result = []
      let count = 0
      for (const item of data) {
         result.push(fn(item, count++, initial))
      }
      return result
   },
   [MapType.RECORD](data: any, fn: any, initial: any, ctx: any) {
      const result: Record<string, any> = {}
      for (const key in data) {
         result[key] = fn(data[key], key, initial)
      }
      return result
   }
}

/**
 * map 逻辑有 4 种情况
 * 1. data 是一个数组 & Set
 * 2. data 是一个对象 & Map
 * 3. data 是一个原始类型 & 函数
 */
export const mapFunc = (data: any, args: any, ctx: any) => {
   const fn = args.map, initial = args.initial
   const collector = mapCollectors[mapType(data)]
   return collector(data, fn, initial, ctx)
}

const isReal = (value: any) => value !== undefined && value !== null

const morphMergeArray$ = (data: any[], result: any[]) => {
   for (let left = 0, right = left + 1; right < data.length; left++, right = left + 1) {
      if (isReal(data[left])) {
         result.push(data[left], data[right])
      }
   }
}

const morphMergeMap$ = (data: any[], result: Map<any, any>) => {
   for (let left = 0, right = left + 1; right < data.length; left++, right = left + 1) {
      if (isReal(data[left])) {
         result.set(data[left], data[right])
      }
   }
}

const morphMergeRecord$ = (data: any[], result: Record<string, any>) => {
   for (let left = 0, right = left + 1; right < data.length; left++, right = left + 1) {
      if (isReal(data[left])) {
         result[data[left]] = data[right]
      }
   }
}

const morphCollectors: Record<MapType, Collector> = {
   [MapType.REAL](data: any, fn: any, initial: any, ctx: any) {
      return fn(data, 0, initial)
   },
   [MapType.NIL](data: any, fn: any, initial: any, ctx: any) {
      return fn(null, 0, initial)
   },
   [MapType.ARRAY](data: any, fn: any, initial: any, ctx: any) {
      const result: any[] = []
      for (const item of data) {
         const tmp = fn(item[0], item[1], initial)
         if (!Array.isArray(tmp)) continue
         morphMergeArray$(tmp, result)
      }
      return result
   },
   [MapType.SET](data: any, fn: any, initial: any, ctx: any) {
      const result = new Set()
      let index = 0
      for (const item of data) {
         const tmp = fn(item, index++, initial)
         if (!Array.isArray(tmp)) continue
         for (const item of tmp) {
            if (isReal(item)) result.add(item)
         }
      }
      return result
   },
   [MapType.MAP](data: Map<any, any>, fn: any, initial: any, ctx: any) {
      const result = new Map()
      for (const item of data) {
         const tmp = fn(item[1], item[0], initial)
         if (!Array.isArray(tmp)) continue
         morphMergeMap$(tmp, result)
      }
      return result
   },
   [MapType.ITER](data: any, fn: any, initial: any, ctx: any) {
      const result: any[] = []
      for (const item of data) {
         const tmp = fn(item[0], item[1], initial)
         if (!Array.isArray(tmp)) continue
         morphMergeArray$(tmp, result)
      }
      return result
   },
   [MapType.RECORD](data: any, fn: any, initial: any, ctx: any) {
      const result: Record<string, any> = {}
      for (const key in data) {
         const tmp = fn(data[key], key, initial)
         if (!Array.isArray(tmp)) continue
         morphMergeRecord$(tmp, result)
      }
      return result
   }
}

export const morphFunc = (data: any, args: any, ctx: any) => {
   const fn = args.map, initial = args.initial
   const collector = morphCollectors[mapType(data)]
   return collector(data, fn, initial, ctx)
}

const filterCollectors: Record<MapType, Collector> = {
   [MapType.REAL](data: any, fn: any, initial: any, ctx: any) {
      throw new Error("Function not implemented.")
   },
   [MapType.NIL](data: any, fn: any, initial: any, ctx: any) {
      throw new Error("Function not implemented.")
   },
   [MapType.ARRAY](data: any, fn: any, initial: any, ctx: any) {
      throw new Error("Function not implemented.")
   },
   [MapType.SET](data: any, fn: any, initial: any, ctx: any) {
      throw new Error("Function not implemented.")
   },
   [MapType.MAP](data: any, fn: any, initial: any, ctx: any) {
      throw new Error("Function not implemented.")
   },
   [MapType.ITER](data: any, fn: any, initial: any, ctx: any) {
      throw new Error("Function not implemented.")
   },
   [MapType.RECORD](data: any, fn: any, initial: any, ctx: any) {
      throw new Error("Function not implemented.")
   }
}

export const filterFunc = (data: any, args: any, ctx: any) => {
   const fn = args.filter
   const collector = filterCollectors[mapType(data)]
   return collector(data, fn, undefined, ctx)
}