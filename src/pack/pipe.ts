import { RRecord, PropKey } from "@/types"
import { factory } from "@/utils"

/**
 * 管道处理函数
 * @param {any} prevReturn 上一次管道的返回值
 */
export type PipeProcessor<A = any, B = any> = (prevReturn: A, ctx?: PipeContext) => B

const StatusType = { OK: false, ER: true } as const

export interface PipeConfig extends ReturnType<typeof PipeConfig> { [key: string]: any }
export const PipeConfig = factory(class PipeConfig {
   key: symbol
   statusType: boolean
   processor: PipeProcessor
   useCtx?: boolean
   stateConstructor?: Function
   constructor(func: PipeProcessor, status?: boolean) {
      this.key = Symbol()
      this.processor = func
      this.statusType = Boolean(status)
   }
})

export type Pipeline = ReturnType<typeof Pipeline>
export const Pipeline = factory(class Pipeline {
   lineMap: Record<PropKey, PipeConfig[]>
   state: Record<PropKey, Record<PropKey, any>>
   main: PropKey
   env: Record<string, any>
   shiftMap?: ShiftMap
   constructor(configMap: Record<PropKey, PipeConfig[]>, main: PropKey, env: Record<string, any>) {
      this.lineMap = configMap
      this.main = main
      this.state = {}
      this.env = env
   }

   initShiftMap() {
      this.shiftMap = ShiftMap(this)
   }

   pushPipe(line: PropKey, config: PipeConfig) {
      if (!this.lineMap[line]) {
         this.lineMap[line] = []
      }
      this.lineMap[line].push(config)
   }

   insertPipe(line: PropKey, config: PipeConfig) {
      if (!this.lineMap[line]) {
         this.lineMap[line] = []
      }
      this.lineMap[line].unshift(config)
   }
})

const IntoMap = factory(class IntoMap {

})

const CTX_PIPELINE = Symbol('pipe_ctx_pipeline')
const CTX_TEMP = Symbol('pipe_ctx_temp')
const CTX_THIS = Symbol('pipe_ctx_this_arg')
const CTX_STATE = Symbol('pipe_ctx_state')
const CTX_CONFIG = Symbol('pipe_ctx_config')

export interface PipeContext extends ReturnType<typeof PipeContext> { }
export const PipeContext = factory(class PipeContext {
   [key: PropKey]: any
   declare [CTX_PIPELINE]: Pipeline
   declare [CTX_TEMP]: RRecord<any>
   declare [CTX_THIS]: object

   /**
    * 当次调用的传递上下文
    */
   get temp(): RRecord<any> { return this[CTX_TEMP] }
   /**
    * 当次调用的 this，默认为 undefined
    */
   get thisArg(): object { return this[CTX_THIS] }
   /**
    * 当前管道的状态，对于 pipieline 实例而言，不同 pipieline 实例的 pipeState 是独立的
    */
   get state(): Record<string, any> { return this[CTX_STATE] }
   declare [CTX_STATE]: Record<string, any>
   /**
    * 当前管道的配置参数，immutable
    */
   get config(): PipeConfig { return this[CTX_CONFIG] }
   declare [CTX_CONFIG]: PipeConfig
   /**
    * 当前管道的跳跃调动函数，immutable
    */
   get into() {
      // TODO: 添加 shift 函数的支持
      return this[CTX_PIPELINE].shiftMap!
   }
   /**
    * 当前全局的环境变量，immutable
    */
   get env(): Record<string, any> { return this[CTX_PIPELINE].env }

   constructor(
      config: PipeConfig,
      state: RRecord<RRecord<any>>,
      thisArg: object,
      pipeline: Pipeline
   ) {
      this[CTX_PIPELINE] = pipeline
      this[CTX_TEMP] = {}
      this[CTX_THIS] = thisArg
      this[CTX_STATE] = state
      this[CTX_CONFIG] = config
   }
})

interface ShiftMap { }
const ShiftMap = function () {
   const CONFIG = Symbol('pipe_shift_config')
   const PIPEPINE = Symbol('pipe_shift_pipeline')
   function dummy() { }

   const proxyHandler = {
      get(target: any, key: PropKey) {
         if (!(key in target[CONFIG])) return dummy
         let tmp = target[key]
         if (!tmp) {
            target[key] = tmp = function (this: any, arg0: any) {
               executeSubPipeline(this[PIPEPINE], key, arg0)
            }
         }
         return tmp
      }
   }

   return (pipeline: Pipeline) => {
      return new Proxy({
         [PIPEPINE]: pipeline,
         [CONFIG]: pipeline.lineMap
      }, proxyHandler)
   }
}()

/**
 * This function runs a Pipeline instance.
 * @param pipeline 
 * @param data the initial data to be processed
 * @param thisArg thisArg differs among the each of calls, so it is passed every times.
 * @param env 
 */
export const executePipeline = (pipeline: Pipeline, data: any, thisArg: any) => {



   return executeLine(pipeline, pipeline.main, data, thisArg)
}

const executeLine = (pipeline: Pipeline, line: PropKey, data: any, thisArg: any) => {
   let type: boolean = StatusType.OK, index = 0, isAsync = false
   const trunkConfig = pipeline.lineMap[line], states = pipeline.state

   while (index < trunkConfig.length) {
      const config = trunkConfig[index], state = states[config.key]
      try {
         // A pipe processor should run when its type equals to the statusType
         if (type === config.statusType) {
            const ctx = config.useCtx ?
               PipeContext(config, state, thisArg, pipeline) : undefined
            data = config.processor.call(undefined, data, ctx)
            type = StatusType.OK
            if (data instanceof Promise) {
               isAsync = true
               break
            }
         }
      } catch (error) {
         if (!(error instanceof Error)) {
            error = Error(String(error))
         }
         type = StatusType.ER
         data = error
      }
      index++
   }

   if (isAsync) {
      // 执行异步管道
      data = execAsyncLine(pipeline, data, type, index, thisArg)
      return { data, isSuccess: false, isAsync: true }
   } else {
      return { data: data.value, isSuccess: type, isAsync: false }
   }
}

const execAsyncLine = async (pipeline: any, data: any, type: boolean, start: number, thisArg: object) => {
   for (let i = start; i < pipeline.length; ++i) {
      try {
         const pipe = pipeline[i]
         if (type === pipe.statusType) {
            if (data instanceof Promise) {
               data = await data
            }
            data = pipe.func(data, thisArg, pipe.args ?? {}, {})
            type = StatusType.OK
         }
      } catch (error) {
         if (!(error instanceof Error)) {
            error = new Error(String(error))
         }
         type = StatusType.ER
         data = error
      }
   }
   if (data instanceof Promise) {
      return data.catch((err) => err)
   }
   return data
}

const executeSubPipeline = (pipe: Pipeline, data: any, thisArg: object) => {

}
