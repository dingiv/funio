import { Option } from "@/shared"
import { Pattern } from "./pattern"

export const Match: MatchFactory

export interface MatchFactory {
   // <PickType = any, ResultType = any, T extends any[] = any[]>(...args: PairList<T>): ResultType | undefined
}

export interface Match {
   exec<T>(data: T): any
}

export const match: MatchExecutor

export interface MatchExecutor {
   <T, R>(pattern: Pattern<T, R>, value: T): Option<R>
}