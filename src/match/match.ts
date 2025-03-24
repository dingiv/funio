import { Simple, PropKey, UF } from "@/types"
import { typu } from "./type";

/**
 * @module match
 * 模式匹配四要素：
 * 1. 待匹配的值 data
 * 2. 匹配模式 pattern
 * 3. 回调函数 callback
 * 
 * pattern = 
 * 
 * 支持的匹配模式
 * 1. 非空基本值
 *    一个基本类型的值 (除了 undefined、null)，包括：bool、number、string、bigint、symbol 如果能够使用 === 判断等于，则返回该值
 * 2. 函数取值
 *    一个一元函数，如果能够返回一个非空值，则匹配成功
 * 3. 迭代器
 *    如果传入的数组长度和当前值相同，则返回该值
 * 4. 可枚举
 *    如果传入的对象和当前值具有相同的属性，则返回该值
 * 
 * 特殊处理模式：
 * 1. NaN 模式匹配
 * 2. 正则匹配模式
 * 3. Range 模式匹配
 */
export const match: MatchFactory = (patterns: PatternSugar[]) => {
   const patternList: any[] = [...patterns]
   for (let i = 0; i < patternList.length; i++) {
      try {
         patternList[i] = pattern(...patternList[i])
      } catch {
         continue
      }
   }

   if (patternList.length === 0) {
      return () => undefined
   }

   return <DataType>(data: DataType) => exec(data, patternList)
}

export interface MatchFactory {
   <PickType = any, ResultType = any>
      (arms: PatternSugar<PickType, ResultType>[]): UF<any, ResultType | undefined>
   exec<PickType = any, ResultType = any>
      (data: any, arms: Pattern<PickType, ResultType>[]): ResultType | undefined;
}

const exec = <PickType = any, ResultType = any>(
   data: any, patterns: Pattern<PickType, ResultType>[]
) => {
   for (let index = 0; index < patterns.length; ++index) {
      try {
         const p = patterns[index]
         const pick = p.pick(data)
         if (p.test(pick)) {
            return p.callback(pick)
         }
      } catch {
         continue
      }
   }
}

match.exec = exec


/**
 * @module match
 * @description
 * 模式
 * pattern = pick + test + callback
 */
export const pattern: PatternFactory = <PickType, ResultType>(
   pick?: UF<any, PickType>, test?: UF<PickType, boolean>, callback?: UF<PickType, ResultType>
): Pattern<PickType, ResultType> => {
   const tmp = Object.create(patternProto)
   tmp.pick = pick ?? typu.id
   tmp.test = test ?? typu.notNone
   tmp.callback = callback ?? typu.as
   return tmp
}

export interface PatternFactory {
   <PickType, ResultType>(
      pick?: UF<any, PickType>, test?: UF<PickType, boolean>, callback?: UF<PickType, ResultType>
   ): Pattern<PickType, ResultType>

   from(): Pattern

   isPattern(maybe: any): boolean
   defaultPick<T>(value: any): T
   defaultTest(value: any): boolean
   defaultCallback<T>(value: any): T
}

pattern.isPattern = (maybe: any): boolean => Reflect.has(maybe, FUNIO_PATTERN)
pattern.defaultPick = typu.id
pattern.defaultTest = typu.notNone
pattern.defaultCallback = typu.as
pattern.from = () => {

}

const parseSimple = (p: Simple) => {
   return {
      pick: typu.as,
      test(value: any) {
         return typu.same(p, value)
      }
   }
}

const parseFunction = (p: UF) => {
   return {
      pick: p,
      test: typu.notNone
   }
}

const parseIterable = <T extends PatternDestructSugar>(p: Iterable<T>) => {
   const tmp: any[] = []
   let index = 0
   for (const v of p) {
      tmp[index] = pattern(v)
   }
   return {

   }
}

const parseRecord = () => {
   return {

   }
}

export type Pattern<PickType = any, ResultType = any> = {
   pick: UF<any, PickType>,
   test: UF<PickType, boolean>,
   callback: UF<PickType, ResultType>,
   usePick: UF<UF<any, PickType>, Pattern<PickType, ResultType>>,
   useTest: UF<UF<PickType, boolean>, Pattern<PickType, ResultType>>,
   useCallback: UF<UF<PickType, ResultType>, Pattern<PickType, ResultType>>,
   p: UF<UF<any, PickType>, Pattern<PickType, ResultType>>,
   t: UF<UF<PickType, boolean>, Pattern<PickType, ResultType>>,
   c: UF<UF<PickType, ResultType>, Pattern<PickType, ResultType>>,
}

const FUNIO_PATTERN = Symbol('funio pattern')
const patternProto: Record<PropKey, any> = {
   [Symbol.toStringTag]: 'FunioPattern',
   [FUNIO_PATTERN]: FUNIO_PATTERN,
   pick: typu.id,
   test: typu.notNone,
   callback: typu.as,
   usePick(this: Pattern, pick: UF) { this.pick = pick; return this },
   p(this: Pattern, pick: UF) { this.pick = pick; return this },
   useTest(this: Pattern, test: UF) { this.test = test; return this },
   t(this: Pattern, test: UF) { this.test = test; return this },
   useCallback(this: Pattern, callback: UF) { this.callback = callback; return this },
   c(this: Pattern, callback: UF) { this.callback = callback; return this },
}

export type PatternSugar<PickType = any, ResultType = any> =
   [pick: PatternDestructSugar<any>, callback: UF<PickType, ResultType>] |
   [pick: PatternDestructSugar<any>, test: PatternDestructSugar<any>, callback: UF<PickType, ResultType>]

export type PatternDestructSugar<T = any> =
   Simple |
   UF<any, T> |
   Iterable<PatternDestructSugar<T>> |
   RecordPattern<T>

export interface RecordPattern<T> {
   [key: PropKey]: PatternDestructSugar<T>;
}