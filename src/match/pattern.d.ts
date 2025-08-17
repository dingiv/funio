import { Option } from "@/shared";
import { Primitive, Simple, ToPrimitive, UF } from "@/types";

export interface Matchable<T = unknown, R = unknown> {
   match(value: T): Option<R>
}

export interface Pattern<T = unknown, R = unknown> extends Matchable<T, R> {
   typeof(): Pattern
   instanceof(): Pattern
   is(): Pattern
   equals(): Pattern
   like(): Pattern
   same(): Pattern
   regex(): Pattern
   range(): Pattern

   guard(pred: UF<T, boolean>): Pattern
   option(other: Pattern): Pattern
}

export type PatternSugar = Simple | UF<any, boolean> | PatternStructed

export interface PatternStructed {
   [key: PropertyKey]: PatternSugar
}

export const Pattern: PatternFactory

export interface PatternFactory {
   <T extends Simple>(simple: T): Pattern<ToPrimitive<T>, ToPrimitive<T>>
   <R, T extends UF<R, boolean>>(pred: T): Pattern<R, R>
   (sugar: PatternSugar): Pattern
   enum(...args: Primitive[]): Pattern
   struct(obj: object): Pattern
   tuple<R, T extends any[]>(iter: T): Pattern
   tuple<R, T extends Iterable<R>>(iter: T): Pattern

   repeat<R, T extends UF<R, boolean>>(pred: T): Symbol
   rest<R, T extends UF<R, boolean>>(pred: T): Symbol
   for<R, T extends UF<R, boolean>>(pred: T): Symbol
}

