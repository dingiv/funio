import { NF } from "@/types"



export interface UnaryClosure<Arg, Ret, State extends Record<string, any>> {
   (arg: Arg): Ret
   state: State,
   provide<T extends Record<string, any>>(state: T): UnaryClosure<Arg, Ret, State & T>
}

export type ClosureInner = (...args: any[]) => any

export const Closure: ClosureFactory = function (f, state) {
   const s: Record<string, any> = state ?? {}
   const clos = (data: any) => {
      return f(data, s as any)
   }

   clos.state = s
   clos.provide = (newState: any) => {
      Object.assign(s, newState)
   }

   return clos as any
}

export interface ClosureFactory {
   <Arg, Ret, State extends Record<string, any>>(func: NF<[Arg, State], Ret>, state?: State): UnaryClosure<Arg, Ret, State>
}