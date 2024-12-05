

/**
 * map 逻辑有三种情况
 * 1. data 是一个数组 & Set
 * 2. data 是一个对象 & Map
 * 3. data 是一个原始类型
 */
const mapFunc = (data: any, args: any, ctx: any) => {
   const fn = args.map
   if (data instanceof Object) {
      if (Array.isArray(data)) {
         const result: any[] = []
         for (let i = 0; i < data.length; i++) {
            result[i] = fn(data[i], ctx)
         }
         return result
      } else if (data instanceof Set) {
         const result = new Set()
         for (const item of data) {
            result.add(fn(item, ctx))
         }
         return result
      } else if (data instanceof Map) {
         const result = new Map()
         for (const item of data) {
            result.set(item[0], fn(item[1], ctx))
         }
         return result
      } else {
         const result: Record<string, any> = {}
         for (const key in data) {
            result[key] = fn(data[key], ctx)
         }
         return result
      }
   } else {
      return fn(data, ctx)
   }
}