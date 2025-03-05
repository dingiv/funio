import { RecordKey } from "./types"

export interface PipeConfig {
   key: symbol
   statusType: StatusType  // true 代表针对正常状态，false 代表针对错误状态
   // async?: boolean   // 不再使用，默认判断函数返回值是否为 Promise
   processor: PipeProcessor
   stateConstructor: () => any
   // isJumper?: boolean  // 是否短路，默认为false当检测到shortcut时，是否短路
   // 更多参数
   [key: string]: any
}

export type PipeContext = {
   [key: string]: any
   thisArg: object,  // 当前管道的 this，默认为 {}
   state: Record<string, any>,  // 当前管道的状态，对于一个 pipieline，不同 pipieline 的 pipeState 是独立的
   config: PipeConfig,  // 当前管道的配置，immutable
   env: Record<string, any>  // 环境变量，immutable
   call: Record<string, (statusType: StatusType, ...args: any[]) => any>
}

export type PipeProcessor<A = any, B = any> = (
   prevReturn: A,  // 前一个管道的返回值
   ctx: PipeContext
) => B

export const StatusType = {
   LEFT: false,
   RIGHT: true
}
export type StatusType = boolean

interface PipeConstructor {
   (pipeline: PipeConfig[], thisArg: object): Pipe
   right(func: any, async?: boolean): PipeConfig
   left(func: any, async?: boolean): PipeConfig
   passThrough(async?: boolean): PipeConfig
}

export const Pipe: PipeConstructor = (pipeline: PipeConfig[], thisArg: object) => {
   return {
      config: pipeline[0],
      state: pipeline[0].stateConstructor(),
      next: pipeline.slice(1).map((config) => ({
         config,
         state: config.stateConstructor(),
         next: []
      }))
   }
}

export interface Pipeline {
   configMap: Record<RecordKey, PipeConfig[]>
   state: Record<symbol, Record<string, any>>
   main: RecordKey
}

interface PipelineConstructor {
   (head: Pipe, tail: Pipe): Pipeline
   clone(pipeline: Pipeline): Pipeline
   append(pipeline: Pipeline, pipe: Pipe): Pipeline
   insert(pipeline: Pipeline, pipe: Pipe): Pipeline
   around(pipeline: Pipeline, pipe: Pipe): Pipeline
}

export const Pipeline: PipelineConstructor = (head: Pipe, tail: Pipe) => {
   return {
      head,
      tail
   }
}

Pipeline.append = (pipeline: Pipeline, pipe: Pipe) => {
   const { head, tail } = pipeline

   let cursor = head
   const newHead = pipe

   while (cursor?.next?.length) {

      cursor = cursor.next[0]
   }

   return {
      head,
      tail: Pipe()
   }
}

Pipeline.insert = (pipeline: Pipeline, pipe: Pipe) => {
   const { head } = pipeline
   pipeline.head.next.unshift(pipe)
   pipeline.head = pipe
   return pipeline
}

Pipeline.around = (pipeline: Pipeline, pipe: Pipe) => {
   const { head, tail } = pipeline
   pipeline.head.next.unshift(pipe)
   pipeline.tail.next.push(pipe)
   return pipeline
}

/**
 * This function runs a Pipeline instance.
 * @param pipeline 
 * @param data the initial data to be processed
 * @param thisArg thisArg differs among the each of calls, so it is passed every times.
 * @param env 
 */
export const executePipeline = (pipeline: Pipeline, data: any, thisArg: any, env: Record<string, any>) => {

   const trunk = pipeline.configMap[pipeline.main]

   // 执行同步管道
   const configs = pipeline.config, states = pipeline.state
   let type = StatusType.RIGHT, index = 0, isAsync = false
   let config = configs[index], state = states[config.key]
   while (index < configs.length) {
      try {
         // A pipe processor should run when its type equals to the statusType
         if (type === config.statusType) {
            data = config.processor(data, thisArg, state, config, {})
            type = StatusType.RIGHT
            // a special property config.isJumper and state.jump, if they are both true, then the pipeline will jump to the next pipe with the same key
            if (config.isJumper && state.jump) {
               const jumper = config
               let next = index + 1
               do {
                  config = configs[next++]
               } while (jumper.key !== config.key)
               index = next - 1
            }
            if (data instanceof Promise) {
               isAsync = true
               break
            }
         }
      } catch (error) {
         if (!(error instanceof Error)) {
            error = new Error(String(error))
         }
         type = StatusType.LEFT
         data = error
      }
      index++
      config = configs[index], state = states[config.key]
   }

   if (isAsync) {
      // 执行异步管道
      data = execAsyncPipeline(pipeline, data, type, index, thisArg)
      return { data, type: false }
   } else {
      return { value: data.value, type }
   }
}

const execAsyncPipeline = async (pipeline: Pipeline, data: any, type: StatusType, start: number, thisArg: object) => {
   for (let i = start; i < pipeline.length; ++i) {
      try {
         const pipe = pipeline[i]
         if (type === pipe.statusType) {
            if (data instanceof Promise) {
               data = await data
            }
            data = pipe.func(data, thisArg, pipe.args ?? {}, {})
            type = StatusType.RIGHT
         }
      } catch (error) {
         if (!(error instanceof Error)) {
            error = new Error(String(error))
         }
         type = StatusType.LEFT
         data = error
      }
   }
   if (data instanceof Promise) {
      return data.catch((err) => err)
   }
   return data
}
