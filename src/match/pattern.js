import { Lang, None, Some, Typu } from "@/shared"

const PATTERN_INFO = Symbol('pattern')

const R_VALUE = Symbol('value')
const R_ARRAY = Symbol('array')
const R_OBJECT = Symbol('object')
const R_ENUM = Symbol('enum')
const R_EXTRACT = Symbol('extract')
const R_TEST = Symbol('test')
const R_FUNC = Symbol('function')
const R_PATTERN = Symbol('function')

const FAIL = Symbol('fail')

const matchValue = (data, value) => {
   if (Lang.same(data, value)) {
      return data
   }
   return FAIL
}

const matchExtract = (data, extract) => {
   const result = extract(data)
   if (result != null) {
      return result
   }
   return FAIL
}

const matchTest = (data, test) => {
   if (test(data) === true) {
      return data
   }
   return FAIL
}

const matchFunction = (data, func) => {
   const result = func(data)
   switch (result) {
      case true:
         return data
      case false:
      case null:
      case undefined:
         return FAIL
   }
   return result
}

const matchArray = (data, infoArray) => {
   if (!Array.isArray(data)) return FAIL
   data = [...data]
   for (let i = 0; i < infoArray.length; i++) {
      const result = matchAny(data[i], infoArray[i])
      if (result === FAIL) {
         return FAIL
      }
      data[i] = result
   }
   return data
}

const matchObject = (obj, infoObj) => {
   if (obj == null) return FAIL
   const struct = { ...obj }
   for (const key in infoObj) {
      const result = matchAny(struct[key], infoObj[key])
      if (result === FAIL) {
         return FAIL
      }
      struct[key] = result
   }
   return struct
}

const matchEnum = (data, options) => {
   for (const option of options) {
      const result = matchAny(data, option)
      if (result !== FAIL) {
         return result
      }
   }
   return FAIL
}

const matchPattern = (data, pattern) => {
   const result = pattern.match(data)
   if (result.isNone) {
      return FAIL
   }
   return result.value
}

const Rule = Object.freeze({
   [R_VALUE]: matchValue,
   [R_EXTRACT]: matchExtract,
   [R_TEST]: matchTest,
   [R_FUNC]: matchFunction,
   [R_OBJECT]: matchObject,
   [R_ARRAY]: matchArray,
   [R_ENUM]: matchEnum,
   [R_PATTERN]: matchPattern,
})

const matchAny = (data, info) => {
   return Rule[info.type](data, info.args)
}

const Info = (type, args) => {
   return { type, args }
}

const createAnyInfo = (src) => {
   let info
   switch (typeof src) {
      case 'function':
         info = Info(R_FUNC, src)
         break
      case 'object':
         if (Array.isArray(src)) {
            info = createArrayInfo(src)
         } else if (src === null) {
            info = Info(R_VALUE, src)
         } else if (PATTERN_INFO in src) {
            info = Info(R_PATTERN, src)
         } else {
            info = createObjectInfo(src)
         }
         break
      default:
         info = Info(R_VALUE, src)
   }
   return info
}

const createObjectInfo = (obj) => {
   const info = {}
   for (const key in obj) {
      info[key] = createAnyInfo(obj[key])
   }
   return { type: R_OBJECT, args: info }
}

const createArrayInfo = (array) => {
   const info = []
   for (let i = 0; i < array.length; i++) {
      info.push(createAnyInfo(array[i]))
   }
   return { type: R_ARRAY, args: info }
}

const PatternImpl = class Pattern {
   [PATTERN_INFO] = null
   static of(info, ...guards) {
      const p = new Pattern
      p[PATTERN_INFO] = { info, guards }
      return p
   }

   append(guard) {
      this[PATTERN_INFO].guards.push(guard)
      return this
   }

   match(data) {
      try {
         const inner = this[PATTERN_INFO]
         const result = matchAny(data, inner.info)
         if (result === FAIL) {
            return None
         }
         for (const guard of inner.guards) {
            if (guard(result) !== true) {
               return None
            }
         }
         return Some(result)
      } catch { }
      return None
   }

   typeof(type) { return this.append((data) => typeof data === type) }
   instanceof(cons) { return this.append((data) => Lang.instanceof(data, cons)) }
   is(v2) { return this.append((data) => Lang.is(data, v2)) }
   equals(v2) { return this.append((data) => Lang.equals(data, v2)) }
   like(v2) { return this.append((data) => Lang.like(data, v2)) }
   same(v3) { return this.append((data) => Lang.same(data, v3)) }

   guard(pred) {
      if (Typu.isFunction(pred))
         return this.append(pred)
      Lang.throw(Error('guard must be a function'))
      return this
   }
   option(other) {
      const inner = this[PATTERN_INFO]
      const info = inner.info
      if (info.type === R_ENUM) {
         info.args.push(createAnyInfo(other))
         return Pattern.of(info, ...inner.guards)
      } else {
         return Pattern.of(createEnumInfo([this, other]))
      }
   }
}

const createEnumInfo = (options) => {
   let info = []
   for (const option of options) {
      info.push(createAnyInfo(option))
   }
   return { type: R_ENUM, args: info }
}

export const Pattern = function () {
   const Pattern = (sugar, ...args) => PatternImpl.of(createAnyInfo(sugar), ...args)

   Pattern.enum = (...args) => PatternImpl.of(createEnumInfo(args))
   Pattern.struct = (obj) => PatternImpl.of(createObjectInfo(obj))
   Pattern.tuple = (iter) => PatternImpl.of(createArrayInfo(iter))

   return Pattern
}()