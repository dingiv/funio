import { UF, NF, RealPrimitive } from "@/types"

interface Pipe {
   type: PipeType
   callback: NF<[any, Pipe], any>
   [s: string]: any
}

enum PipeType {
   none,
   maybe,
   catch,
   assert,
   match,
}

interface Status {
   type: StatusType
   data: any
   [s: string]: any
}

enum StatusType {
   normal,
   nullptr,
   error,
   async
}

type Transfer = (status: Status, pipe: Pipe) => Status

const defaultTransfer: Transfer = (status: Status, pipe: Pipe) => {
   return {
      type: StatusType.normal,
      data: pipe.callback(status.data, pipe)
   }
}

const dummyTransfer: Transfer = (status: Status, _: Pipe) => {
   return status
}

const assertTransfer: Transfer = (status: Status, pipe: Pipe) => {
   const assert = pipe.callback(status.data, pipe)
   if (!assert) {
      return {
         type: StatusType.error,
         data: new Error('assertion failed')
      }
   }
   return status
}

const TRANSFER_MATRIX: Transfer[][] = [
   // normal : none,       maybe,         catch,         assert,           match
   [defaultTransfer, dummyTransfer, dummyTransfer, assertTransfer, defaultTransfer],
   // nullptr
   [dummyTransfer, defaultTransfer, dummyTransfer, dummyTransfer, dummyTransfer],
   // error
   [dummyTransfer, dummyTransfer, defaultTransfer, dummyTransfer, dummyTransfer],
]

const execPipeline = (pipeline: Pipe[], status: Status) => {
   const length = pipeline.length
   status = { ...status }
   for (let i = 0; i < length; i++) {
      try {
         if (status.data === undefined || status.data === null) {
            status.type = StatusType.nullptr
         }
         const pipe = pipeline[i]
         if (pipe.type === PipeType.await) break
         const transfer = TRANSFER_MATRIX[status.type][pipe.type]
         status = transfer(status, pipe)
      } catch (error) {
         status.type = StatusType.error
         if (!(error instanceof Error)) {
            error = new Error(String(error))
         }
         status.data = error
      }
   }



   return status
}

const VALUE = Symbol('value')
const PIPE = Symbol('pipeline')
const FUNC = Symbol('func')
const AWAIT_POINT = Symbol('await point')

export class Funio {
   [VALUE]: any;
   [PIPE]: Pipe[] = [];
   [FUNC]: any;
   [AWAIT_POINT]: number = Number.MAX_SAFE_INTEGER;

   protected constructor(initialValue: any, pipeline: any[] = []) {
      this[VALUE] = initialValue
      this[PIPE] = pipeline
   }

   static of(initialValue: any, pipeline: any[] = []) {
      return new Funio(initialValue, pipeline)
   }

   arg(arg: any) {
      return Funio.of(arg, this[PIPE].slice())
   }

   pipe(fn: UF) {
      const np: Pipe[] = [...this[PIPE], {
         type: PipeType.none,
         callback: fn
      }]
      return Funio.of(this[VALUE], np)
   }

   compose(fn: UF) {
      const np: Pipe[] = [{
         type: PipeType.none,
         callback: fn
      }, ...this[PIPE]]
      return Funio.of(this[VALUE], np)
   }

   maybe(fn: any) {
      const callback = typeof fn === 'function' ? fn : () => fn
      const np = [...this[PIPE], {
         type: PipeType.maybe,
         callback
      }]
      return Funio.of(this[VALUE], np)
   }

   catch(fn: any) {
      const callback = typeof fn === 'function' ? fn : () => fn
      const np = [...this[PIPE], {
         type: PipeType.catch,
         callback
      }]
      return Funio.of(this[VALUE], np)
   }

   assert(fn: Function) {
      const callback = typeof fn === 'function' ? fn : (data: any) => fn === data
      const np = [...this[PIPE], {
         type: PipeType.assert,
         callback
      }]
      return Funio.of(this[VALUE], np)
   }

   /**
    * 模式匹配
    * 1. 基本模式匹配
    *    一个普通的值，如果能够使用 === 判断等于，则返回该值
    * 2. 对象模式匹配
    *    如果传入的对象和当前值具有相同的属性，则返回该值
    * 3. 数组模式匹配
    *    如果传入的数组长度和当前值相同，则返回该值
    * 4. 函数模式匹配
    *    *    如果传入的函数能够返回 true，则返回该值
    * 
    */
   match(pattern: RealPrimitive | Object, fn: UF) {
      if (typeof pattern !== 'function') {
         if (pattern) {

         }
      }
      const np = [...this[PIPE], {
         type: PipeType.match,
         callback: fn,
         pattern
      }]
      return Funio.of(this[VALUE], np)
   }

   matches(pattern: RealPrimitive[] | Object[], fn: UF) {
      const np = [...this[PIPE], {
         type: PipeType.match,
         callback: () => true,
         pattern
      }]
      return Funio.of(this[VALUE], np)
   }

   map(fn: any) { }
   forEach(fn: any, ctx: any) { }
   reduce(fn: any, initial: any) { }


   get func() {
      if (!this[FUNC]) {
         this[FUNC] = (arg?: any) => {
            const pipeline = this[PIPE]
            let data = arg ?? this[VALUE];
            const status = execPipeline(pipeline, { type: StatusType.normal, data })
            return status.data
         }
      }
      return this[FUNC] as UF
   }


   get initValue() {
      [].

      return this[VALUE]
   }

   get value() {
      return this.func(this[VALUE])
   }

   get await() {
      return 23
   }

   sleep(ms: number) {
      return
   }

   get throttle() {
      return
   }

   get debounce() {
      return
   }

   get cache() {
      return
   }

   cacheBy(fn: any) {
      return this
   }

   depend(fn: any) {

   }

   get singleton() {
      return this
   }

   clean() {

   }
}

interface MatchPattern {
   and(): any;
   or(): any;
   not(): any;
   xor(): any;
   like(): any;
   is(): any;
   class(): any;
   type(): any;
}

interface IntergerMatchPattern extends MatchPattern {
   eq(): any;
   ne(): any;
   gt(): any;
   lt(): any;
   ge(): any;
   le(): any;
}

interface StringMatchPattern extends MatchPattern {
   eq(): any;
   ne(): any;
   gt(): any;
   lt(): any;
   ge(): any;
   le(): any;
}

interface ObjectMatchPattern extends MatchPattern {

}

const mp = {
   and() {

   },
   or() {

   },
   xor() {

   },
   like() {

   },
   is() {

   }
}

export const F = Funio.of
export const $f = Funio.of
export const createFunio = Funio.of