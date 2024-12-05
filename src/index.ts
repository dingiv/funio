export type * from './types'
import { UF, Primitive } from "@/types"
import { Left, Pipe, PipelineContext, Right, execPipeline } from './pipe'
import { createMatchPipe } from './match'

const VALUE = Symbol('value')
const PIPE = Symbol('pipeline')
const FUNC = Symbol('func')
const AWAIT_POINT = Symbol('await point')

export const createFpipe = (initialValue: any, pipeline: any[] = [], awaitPoint: number = Number.POSITIVE_INFINITY) => {
   const fpipe: Fpipe = (function () { }) as any
   fpipe[VALUE] = initialValue
   fpipe[PIPE] = pipeline
   fpipe[AWAIT_POINT] = awaitPoint
   return new Proxy(fpipe, proxyHandler)
}

const proxyHandler: ProxyHandler<Fpipe> = {
   get(target: Fpipe, key: string | symbol) {
      return Reflect.get(methods, key)
         ?? Reflect.get(props, key)?.call(target)
         ?? Reflect.get(target, key)
   },
   apply(target: Fpipe, thisArg, args) {
      let func = target[FUNC]
      if (!func) {
         target[FUNC] = func = (arg?: any, ctx?: PipelineContext) => {
            const data = arg ?? target[VALUE];
            const status = execPipeline(
               target[PIPE],
               data,
               target[AWAIT_POINT]
            )
            return status.data
         }
      }
      return func(args[0], thisArg ?? {})
   }
}

export interface Fpipe extends Function {
   (): any
   /**
    * get a new fpipe with the given init pipeline arg
    */
   (arg: any): Fpipe
   /**
    * get a new fpipe with the current pipeline appended with the given func
    */
   pipe(func: UF): Fpipe
   /**
    * get a new fpipe with the current pipeline composed with the given func 
    */
   compose(func: UF): Fpipe
   /**
    * get a new fpipe with the current pipeline, and the given func will be executed if the current pipeline returns undefined or null
    */
   maybe(arg: any): Fpipe
   [s: string | symbol]: any
}


interface FpipeGenerator {
   (this: Fpipe, ...args: any): Fpipe
}

const methods: Record<string, FpipeGenerator> = {
   init(arg: any) {
      return createFpipe(arg, this[PIPE], this[AWAIT_POINT])
   },
   pipe(fn) {
      let p: Pipe[]
      if (fn[PIPE]) {
         p = [...this[PIPE], ...fn[PIPE]]
      } else {
         p = [...this[PIPE], Right(fn)]
      }
      return createFpipe(this[VALUE], p, this[AWAIT_POINT])
   },
   compose(fn) {
      let p: Pipe[], awaitPoint = this[AWAIT_POINT]
      if (fn[PIPE]) {
         p = [...fn[PIPE], ...this[PIPE]]
         awaitPoint = Math.min(awaitPoint + fn[VALUE].length, fn[AWAIT_POINT])
      } else {
         p = [Right(fn), ...this[PIPE]]
         awaitPoint = Math.min(awaitPoint + 1, this[AWAIT_POINT])
      }
      return createFpipe(undefined, p, awaitPoint)
   },
   maybe(val) {
      const func = (data: any) => data ?? val
      const p = [...this[PIPE], Right(func)]
      return createFpipe(this[VALUE], p, this[AWAIT_POINT])
   },
   catch(fn) {
      fn = typeof fn === 'function' ? fn : () => fn
      const p = [...this[PIPE], Left(fn)]
      return createFpipe(this[VALUE], p, this[AWAIT_POINT])
   },
   assert(fn) {
      const predicate = typeof fn === 'function' ? fn : (data: any) => fn === data
      const func = (data: any, ctx: PipelineContext) => {
         const result = predicate(data)
         if (result instanceof Promise) {
            return result.then((result) => {
               if (!result) {
                  throw new Error('assertion failed')
               }
               return data
            })
         } else {
            if (!result) {
               throw new Error('assertion failed')
            }
            return data
         }
      }
      const np = [...this[PIPE], Right(func)]
      return createFpipe(this[VALUE], np, this[AWAIT_POINT])
   },
   then(fn) {
      let p: Pipe[]
      if (fn[PIPE]) {
         p = [...this[PIPE], ...fn[PIPE]]
      } else {
         p = [...this[PIPE], Right(fn)]
      }
      const awaitPoint = Math.min(this[AWAIT_POINT], this[PIPE].length)
      return createFpipe(this[VALUE], p, awaitPoint)
   },
   fore(ms: number) {
      return this
   },
   match(pattern: Primitive | Object, fn: UF) {
      const pipeline = this[PIPE].slice()
      const prev = pipeline.pop()
      const matches = prev?.args?.matches || []
      pipeline.push(createMatchPipe(pattern, fn, matches))
      return createFpipe(this[VALUE], pipeline, this[AWAIT_POINT])
   },
   matches(pattern: Primitive[] | Object[], fn: UF) {
      const p = [...this[PIPE], Right(fn)]
      return createFpipe(this[VALUE], p, this[AWAIT_POINT])
   },
   iterate(fn: any, ctx: any) {
      return this
   },
   map(fn: any) {
      const pipe = Right(mapFunc)
      pipe.args!.map = fn
      const p = [...this[PIPE], pipe]
      return createFpipe(this[VALUE], p, this[AWAIT_POINT])
   },
   reduce(fn: any, initial: any = {}) {
      const p = [...this[PIPE], Right(fn), Right(initial)]
      return createFpipe(this[VALUE], p, this[AWAIT_POINT])
   },
   morph(fn: any, ctx: any) {
      return this
   },
   filter() {
      return this
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
      return this
   },
   interval(ms, repeat: number = 0) {
      return this
   },
   throttle() {
      return this
   },
   debounce() {
      return this
   },
   lock() {
      // 一个异步任务，在执行过程中，不允许这个函数再次执行
      return this
   },
   cache(a: number | number[] | Function) {
      // 
      return this
   },
   depend(fn: any) {
      return this
   },
   singleton() {
      return this
   },
   clean() {
      return this
   },
   wrap() {
      // 返回的值使用 Fpipe 包裹
      return this
   }
}

const props: Record<string, FpipeGenerator> = {
   await() {
      return createFpipe(this[VALUE], this[PIPE], this[PIPE].length)
   },
   arg() {
      return this[VALUE]
   }
}

export const Fpipe = (x: any) => createFpipe(x)
export const $f = (x: any) => createFpipe(x)
