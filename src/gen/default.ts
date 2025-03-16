import { KeyType } from "@/types"
import { dynamicBuilder } from "@/utils"

export interface Logger {
   debug(data: any[]): void
   info(data: any[]): void
   warn(data: any[]): void
   error(data: any[]): void
}

export interface FunioGenInjectorConfig {
   logger: Logger
}

export const FunioGenInjector = (config: Partial<FunioGenInjectorConfig>) => {

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


export interface InjectionQueryObject extends ReturnType<typeof InjectionQueryObject> { }
export const InjectionQueryObject = (key: KeyType) => {
   const ie = new InjectionQueryObjectClass(key)

   return ie
}

class InjectionQueryObjectClass {
   [s: KeyType]: any
   constructor(key: KeyType) {
      this.name = key
   }
}
export const ieb = dynamicBuilder(InjectionQueryObjectClass)