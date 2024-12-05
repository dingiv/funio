import { NF } from "./types"

export interface Pipe {
   type: boolean  // true 代表针对正常状态，false 代表针对错误状态
   func: NF<[any, PipelineContext], any>
   args?: PipelineContext
}

export type PipeFunc = (data: any, args: Object, ctx: PipelineContext) => any

export interface Status {
   type: StatusType  // true 代表 func 执行正常状态，false 代表错误状态
   data: any
}

export const StatusType = {
   LEFT: false,
   RIGHT: true
}
export type StatusType = boolean

export interface PipelineContext {
   [s: string]: any
}

export const execPipeline = (pipeline: Pipe[], data: any, awaitPoint: number = Number.MAX_SAFE_INTEGER) => {
   const mid = Math.min(pipeline.length, awaitPoint)
   let type = StatusType.RIGHT
   // 执行同步管道
   for (let i = 0; i < mid; ++i) {
      try {
         const pipe = pipeline[i]
         if (type === pipe.type) {
            data = pipe.func(data, pipe.args ?? {})
            if (data instanceof Promise) {
               data.catch((err) => {
                  console.error('an uncaught rejected promise is passed in sync pipeline')
                  return err
               })
            }
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

   if (mid === pipeline.length) return { data, type }

   // 执行异步管道
   data = execAsyncPipeline(pipeline, { type, data }, mid)
   return { data, type: false }
}

const execAsyncPipeline = async (pipeline: Pipe[], status: Status, start: number) => {
   let { data, type } = status
   for (let i = start; i < pipeline.length; ++i) {
      try {
         const pipe = pipeline[i]
         if (type === pipe.type) {
            if (data instanceof Promise) {
               data = await data
            }
            data = pipe.func(data, pipe.args ?? {})
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

export const Left = (func: any): Pipe => ({ type: StatusType.LEFT, func })
export const Right = (func: any): Pipe => ({ type: StatusType.RIGHT, func })

