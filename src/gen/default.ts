import { Injector } from "./core"
import { Diqo } from "./diqo"


export interface Logger {
   debug(data: any[]): void
   info(data: any[]): void
   warn(data: any[]): void
   error(data: any[]): void
}

export interface FunioSubInjector extends Injector {
   priority: number
   primitiveInjector: Injector,
   objectInjector: Injector,
   functionInjector: Injector
}

export interface FunioInjectorConfig {
   logger: Logger
   injectors: FunioSubInjector[]
   prefetch: Diqo[]
   
}

const doInject = (config: FunioInjectorConfig, diqo: any) => {

   for (let i = 0; i < config.injectors.length; i++) {

   }

}

export const validateConfig = (config: Partial<FunioInjectorConfig>) => {

   return {

   } as FunioInjectorConfig
}

export const createFunioInjector = (config: Partial<FunioInjectorConfig>) => {
   const cfg = validateConfig(config)
   const ij = async (diqo: any) => {
      diqo = await diqo
      if (diqo == null) {
         throw Error('cannot inject value for diqo: null or undefined')
      }
      switch (typeof diqo) {
         case 'object':
         case 'function':
      }

      return 0
   }

   ij.priority = 0

   return ij
}

export const WebInjector = () => {
   const injector = () => {

   }
   injector.http = () => { }
   injector.file = () => { }
   injector.log = () => { }

   return injector
}

export const NodejsInjector = () => {

}

export const CtxInjector = () => {

}

export const WorkerInjector = () => {

}