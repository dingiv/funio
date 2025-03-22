import { Simple, PropKey, UF } from "@/types"
import { typu } from "./type";

/**
 * @module match
 * 模式匹配三要素：
 * 1. 待匹配的值 data
 * 2. 匹配模式 pattern
 * 3. 回调函数 callback
 * 
 * arm = pattern + callback
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
export const match: MatchFactory = (patterns: PatternLike[]) => {
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

   return <DataType>(data: DataType) => doMatch(data, patternList)
}

export interface MatchFactory {
   <PickType = any, ResultType = any>
      (arms: PatternLike<PickType, ResultType>[]): UF<any, ResultType | undefined>
   exec<PickType = any, ResultType = any>
      (data: any, arms: Pattern<PickType, ResultType>[]): ResultType | undefined;
}

export const pattern: PatternFactory = <PickType>(...params: any[]): Pattern<PickType> => {
   const {
      0: a = pattern.defa, 1: b, 2: c
   } = params
   if (typu.isNone(params)) {
      return pattern.default
   }

   switch (typeof params) {
      case 'function':
         return parseFunction(params)
      case 'object':
         return typu.isIterable(params) ?
            parseIterable(params as any) :
            parseIterable(params as any)
      default:
         return parseSimple(params)
   }
}

export interface PatternFactory {
   <PickType, ResultType>(param: PatternParam<PickType, ResultType>):
      [pick: UF<any, PickType>, test: UF<PickType, ResultType>]
   <PickType, ResultType>(
      param: PatternParam<PickType, ResultType>,
      callback: UF<PickType, ResultType>
   ): Pattern<PickType, ResultType>
   <PickType, ResultType>(
      pick: PatternParam<PickType, ResultType>,
      test: PatternParam<PickType, ResultType>,
      callback: UF<PickType, ResultType>
   ): Pattern<PickType, ResultType>
   <PickType, ResultType>(...args: any[]): Pattern<PickType, ResultType>
   map<PickType, ResultType>(params: PatternLike<PickType, ResultType>[]): Pattern<PickType, ResultType>[]
   isPattern(maybe: any): boolean;
   defaultPick<T>(value: any): T;
   defaultTest(value: any): boolean;
   defaultCallback<T>(value: any): T;
   default: Pattern
}

pattern.of = (params: PatternLike[]) => {
   const tmp: Pattern[] = []

   return tmp
}

pattern.isPattern = (maybe: any): boolean => {


   return true
}

pattern.defaultPick = typu.as
pattern.defaultTest = typu.notNone
pattern.defaultCallback = typu.as
pattern.default = [typu.as, typu.notNone, typu.as]

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

const parseIterable = <T extends PatternParam>(p: Iterable<T>) => {
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

export type Pattern<PickType = any, ResultType = any> = [
   pick: (data: any) => PickType,
   test: (picked: PickType) => boolean,
   callback: (pick: PickType) => ResultType
]

export type PatternParam<DataType = any, T = any> =
   Simple |
   UF<DataType, T> |
   Iterable<PatternParam<DataType, T>> |
   Iterator<PatternParam<DataType, T>> |
   RecordPattern<DataType, T>

export interface RecordPattern<DataType, T> {
   [key: PropKey]: PatternParam<DataType, T>; // Record 的等效形式
}

export type PatternLike<PickType = any, ResultType = any> =
   [param: PatternParam<any>, callback: UF<PickType, ResultType | undefined>] |
   Pattern<PickType, ResultType>

const doMatch = <PickType = any, ResultType = any>(
   data: any, patterns: Pattern<PickType, ResultType>[]
) => {
   for (let index = 0; index < patterns.length; ++index) {
      try {
         const p = patterns[index]
         const pick = p[0](data)
         if (p[1](pick)) {
            return p[2](pick)
         }
      } catch {
         continue
      }
   }
}

match.exec = doMatch

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
