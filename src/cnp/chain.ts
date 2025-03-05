export type * from './types'
import { UF, Primitive } from "@/types"
import { PipeConfig, executePipeline, Pipeline } from './pipe'
import { createMatchPipe } from './match'
import { filterFunc, mapFunc, morphFunc } from './array'
// import { useDebounce, useThrottle } from './hooks'
import { divide } from './utils'

const VALUE = Symbol('value')
const PIPELINE = Symbol('pipeline')
const FUNC = Symbol('func')

const createPipe = (initialValue: any, pipeline: any[] = []) => {
   const fpipe: FPipe = (function () { }) as any
   fpipe[VALUE] = initialValue
   fpipe[PIPELINE] = pipeline
   return new Proxy(fpipe, proxyHandler)
}

const proxyHandler: ProxyHandler<FPipe> = {
   get(target: FPipe, key: string | symbol) {
      return Reflect.get(methods, key)
         ?? Reflect.get(props, key)?.call(target)
         ?? Reflect.get(target, key)
   },
   apply(target: FPipe, thisArg, args) {
      let func = target[FUNC]
      if (!func) {
         target[FUNC] = func = (arg: any, thisArg: any) => {
            const data = arg ?? target[VALUE];
            const status = executePipeline(target[PIPELINE], data, thisArg)
            return status.data
         }
      }
      return func(args[0], thisArg ?? {})
   }
}

const methods: Record<string, FPipeBuilder> = {
   init(arg: any) {
      return createPipe(arg, this[PIPELINE])
   },
   then(fn) {
      let p: PipeConfig[]
      if (fn[PIPELINE]) {
         p = [...this[PIPELINE], Pipe.passThrough(true), ...fn[PIPELINE]]
      } else {
         p = [...this[PIPELINE], Pipe(fn, false, true)]
      }
      const pipe = Pipe.right(p)

      return createPipe(Pipeline.append(this[PIPELINE], pipe))
   },
   fore(fn) {
      let p: PipeConfig[]
      if (fn[PIPELINE]) {
         p = [...fn[PIPELINE], Pipe.passThrough(false), ...this[PIPELINE]]
      } else {
         p = [Pipe(fn, true), ...this[PIPELINE]]
      }
      return createPipe(this[VALUE], p)
   },
   // pipe(fn) {
   //    let p: PipeConfig[]
   //    if (fn[PIPE]) {
   //       p = [...this[PIPE], ...fn[PIPE]]
   //    } else {
   //       p = [...this[PIPE], Pipe(fn)]
   //    }
   //    return createNormalPipe(this[VALUE], p)
   // },
   // compose(fn) {
   //    let p: PipeConfig[]
   //    if (fn[PIPE]) {
   //       p = [...fn[PIPE], ...this[PIPE]]
   //    } else {
   //       p = [Pipe(fn), ...this[PIPE]]
   //    }
   //    return createNormalPipe(undefined, p)
   // },
   maybe(val) {
      const func = (data: any) => data ?? val
      const p = [...this[PIPELINE], Pipe(func)]
      return createPipe(this[VALUE], p)
   },
   catch(fn) {
      fn = typeof fn === 'function' ? fn : () => fn
      const p = [...this[PIPELINE], Pipe(fn, true)]
      return createPipe(this[VALUE], p)
   },
   assert(fn) {
      const predicate = typeof fn === 'function' ? fn : (data: any) => fn === data
      const func = divide(function* (data: any, ctx: object) {
         const result = yield predicate(data)
         if (!result) {
            throw new Error('assertion failed')
         }
         return data
      })

      const np = [...this[PIPELINE], Pipe(func)]
      return createPipe(this[VALUE], np)
   },
   match(pattern: Primitive | Object, fn: UF) {  // 改成 builder 模式
      const pipeline = this[PIPELINE].slice()
      const prev = pipeline.pop()
      const matches = prev?.args?.matches || []
      pipeline.push(createMatchPipe(pattern, fn, matches))
      return createPipe(this[VALUE], pipeline)
   },
   matches(pattern: Primitive[] | Object[], fn: UF) {
      const p = [...this[PIPELINE], Pipe(fn)]
      return createPipe(this[VALUE], p)
   },
   // 添加 immer 支持，使用可变的修改语法生成新的对象
   produce() {
      return this
   },
   // 添加类似 solidjs store API 的支持
   path() {
      return this
   },
   map(fn: any) {
      const pipe = Pipe(mapFunc)
      pipe.args = { map: fn, initial: {} }
      const p = [...this[PIPELINE], pipe]
      return createPipe(this[VALUE], p)
   },
   iterate(fn: any, ctx: any) {
      return this
   },
   reduce(fn: any, initial: any = {}) {
      const pipe = Pipe(mapFunc)
      pipe.args = { map: fn, initial }
      const p = [...this[PIPELINE], pipe]
      return createPipe(this[VALUE], p)
   },
   morph(fn: any, ctx: any) {
      const pipe = Pipe(morphFunc)
      pipe.args = { map: fn, initial: ctx.initial }
      const p = [...this[PIPELINE], pipe]
      return createPipe(this[VALUE], p)
   },
   collect() {
      return this
   },
   collects() {
      return this
   },
   filter(fn) {
      const pipe = Pipe(filterFunc)
      pipe.args = { filter: fn, initial: {} }
      const p = [...this[PIPELINE], pipe]
      return createPipe(this[VALUE], p)
   },
   every() {
      return this
   },
   some() {
      return this
   },
   sort() {
      return this
   },
   timeout(ms: number) {
      const timeoutFunc = (data: any, thisArg: object) => {
         const { promise, resolve } = Promise.withResolvers()
         setTimeout(resolve, ms, data)
         return promise
      }
      const p = [...this[PIPELINE], Pipe(timeoutFunc, true)]
      return createPipe(this[VALUE], p)
   },
   /**
    * TODO:
    */
   throttle(fn) {
      return createPipe(this[VALUE], [...this[PIPELINE], Pipe(useThrottle(fn), true)])
   },
   /**
    * TODO:
    */
   debounce() {
      return createPipe(this[VALUE], [useDebounce(this)])
   },
   /**
    * TODO:
    */
   lock() {
      // 一个异步任务，在执行过程中，不允许这个函数再次执行
      return this
   },
   /**
    * TODO:
    */
   cache(a: number | number[] | Function) {
      // 
      return this
   },
   /**
    * TODO:
    */
   depend(fn: any) {
      return this
   },
   /**
    * TODO:
    */
   singleton() {
      return this
   },
   clean() {
      return this
   },
   wrap() {
      // 返回的值使用 Fpipe 包裹
      const fn = (x: any) => createPipe(x, [])
      return createPipe(this[VALUE], [...this[PIPELINE], Pipe(fn)])
   },
   copy() {
      return this
   },
   trunk() {
      return this
   },
   shift() {
      return this
   },
   line() {
      return this
   }
}

const props: Record<string, FPipeBuilder> = {
   await() {
      return createPipe(this[VALUE], this[PIPELINE])
   },
   arg() {
      return this[VALUE]
   },
   // 开启一个 draft session，在这个 session 中，可以修改对象，但是不会触发重新计算
   draft() {
      return this
   },
}

export interface FPipe extends Function, Pipeline {
   (): any
   /**
    * get a new fpipe with the given init pipeline arg
    */
   (arg: any): FPipe
   /**
    * get a new fpipe with the current pipeline appended with the given func
    */
   pipe(func: UF): FPipe
   /**
    * get a new fpipe with the current pipeline composed with the given func 
    */
   compose(func: UF): FPipe
   /**
    * get a new fpipe with the current pipeline, and the given func will be executed if the current pipeline returns undefined or null
    */
   maybe(arg: any): FPipe
   [s: string | symbol]: any
}

export interface FPipeBuilder {
   (this: FPipe, ...args: any): FPipe
}

export const FPipe = (x: any) => createPipe(x)