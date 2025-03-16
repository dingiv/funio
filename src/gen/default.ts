import { Injector } from "./core"


export interface Logger {
   debug(data: any[]): void
   info(data: any[]): void
   warn(data: any[]): void
   error(data: any[]): void
}

export interface FunioInjector extends Injector {
   priority: number
   primitiveInjector: Injector,
   noneInjector: Injector,
   objectInjector: Injector,
   functionInjector: Injector
}

export interface FunioInjectorConfig {
   logger: Logger
   queue: FunioInjector[]
}

export const createFunioInjector = (config: Partial<FunioInjectorConfig>) => {
   config = { ...config }
   function doInject() {
      
   }
   return async (diqo: any) => {
      diqo = await diqo
      switch (typeof diqo) {
         case 'object':
         case 'undefined':
         case 'function':
      }
   }
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

