
export function forEach(object, f) {
   for (const key in object) {
      f(key, object[key])
   }
}

export function map(object, f) {
   const tmp = {}
   for (const key in object) {
      tmp[key] = f(key, object[key])
   }
   return tmp
}

export function mapEntry(object, f) {
   const tmp = {}
   for (const key in object) {
      const [k, v] = f(key, object[key])
      tmp[k] = v
   }
   return tmp
}

export function reverse(object) {
   const tmp = {}
   for (const key in object) {
      const ret = object[key]
      const a = tmp[ret]
      if (a) {
         if (Array.isArray(a)) {
            a.push(key)
         } else {
            tmp[ret] = [a, key]
         }
      } else {
         tmp[ret] = key
      }
   }
   return tmp
}

export function zip(keyList, valueList) {
   const tmp = {}, len = keyList.length
   if (len > 0) {
      for (let i = 0; i < len; i++) {
         tmp[keyList[i]] = valueList[i]
      }
   } else {
      try {
         let index = 0
         for (const item of keyList) {
            tmp[item] = valueList[index++]
         }
      } catch (error) { }
   }
   return tmp
}

export const fromEntries = Object.fromEntries

// export const keys = Object.keys
// export const values = Object.values
// export const entries = Object.entries

export function assign(from, to) {
   for (const key in from) {
      to[key] = from[key]
   }
}

export function equals(x, y) {
   if (typeof x === "number" && typeof y === "number") {
      // x and y are equal (may be -0 and 0) or they are both NaN
      return x === y || (x !== x && y !== y);
   }
   return x === y;
}
