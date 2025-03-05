import { PipeProcessor, Right } from "./pipe"

/**
  * 模式匹配
  * match 函数，用于匹配传入的值，返回匹配的值，如果返回 undefined 或者 null，则继续匹配下一个模式
  * 1. 基本模式匹配
  *    一个基本类型的值 (除了 undefined、null)，包括：bool、number、string、bigint、symbol 如果能够使用 === 判断等于，则返回该值
  * 2. 数组模式匹配
  *    如果传入的数组长度和当前值相同，则返回该值
  * 3. 对象模式匹配
  *    如果传入的对象和当前值具有相同的属性，则返回该值
  * 4. 函数模式匹配
  *    如果传入的函数能够返回 true，则返回该值
  * 
  * 特殊处理模式：
  * 1. NaN 模式匹配
  * 2. 正则匹配模式
  * 3. Range 模式匹配
  */

export const createMatchPipe = (pattern: any, callback: any, matches: [any, Function][] = []) => {
   const match = {
      pattern,
      callback,
   }
   const pipe = Right(matchProcessor)
   pipe.args = {
      matches: [...matches, match]
   }
   return pipe
}

export const doMatch = (data: any, patternValue: any) => {
   switch (typeof patternValue) {
      case 'function':
         try {
            return patternValue(data)
         } catch (_) { }
         break
      case 'object':
         if (Array.isArray(patternValue)) {
            // 数组模式匹配
            const result = []
            for (let i = 0; i < patternValue.length; i++) {
               const tmp: any = doMatch(data[i], patternValue[i])
               if (tmp === undefined || tmp === null) return
               result.push(tmp)
            }
            return result
         } else {
            // 对象模式匹配
            const result: Record<string, any> = {}
            for (const key in patternValue) {
               const tmp: any = doMatch(data[key], patternValue[key])
               if (tmp === undefined || tmp === null) return
               result[key] = tmp
            }
            return result
         }
         break
      default:
         if (isNaN(data) && isNaN(patternValue)) return NaN
         if (patternValue === data) return data
   }
}

export const matchProcessor: PipeProcessor = (data: any, args: any, ctx: any) => {
   const { matches = [] } = args
   for (const { pattern, callback } of matches) {
      let result
      try {
         result = doMatch(data, pattern)
         if (result instanceof Promise) {
            result.catch(x => {
               console.warn('match function returned a rejected promise. this match may be unexpected.')
            })
            return result
         }
      } catch {
         continue
      }
      if (result !== undefined && result !== null) {
         return callback(result, args, ctx)
      }
   }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness
 */
interface MetaMatchPattern {
   equals(a: any): any; // ===
   like(a: any): any;  // ==
   same(a: any): any  // === but NaN and NaN return true
   is(a: any): any;  // Object.is
   class(a: any): any;   // instanceof
   type(a: any): any;  // typeof
}

const metaMatchPattern: MetaMatchPattern = {
   equals(a: any) {
      return (b: any) => a === b ? b : undefined
   },
   like(a: any) {
      return (b: any) => a == b ? b : undefined
   },
   same(a: any) {
      return (b: any) => {
         if (isNaN(a) && isNaN(b)) return NaN
         return a === b ? b : undefined
      }
   },
   is(a: any) {
      return (b: any) => Object.is(a, b) ? b : undefined
   },
   class(className: any) {
      return (b: any) => b instanceof className ? b : undefined
   },
   type(type: any) {
      return (b: any) => typeof b === type ? b : undefined
   },
}

interface StringMatchPattern {
   startsWith(): any;
   endsWith(): any;
   includes(): any;
   regex(): any;
   asBool(): any;
   asInt(): any;
   asFloat(): any;
   asJSON(): any;
}

interface ArrayMatchPattern {
   length(): any;
   empty(): any;
   notEmpty(): any;
   includes(): any;
   notIncludes(): any;
   every(): any;
   some(): any;
}

export type ReturnThis = <T>(x: T) => T
export type Match = ReturnThis & MetaMatchPattern & StringMatchPattern & ArrayMatchPattern

export const Match: Match = ((x: any) => x) as any
Object.assign(Match, metaMatchPattern)

export const $m = Match