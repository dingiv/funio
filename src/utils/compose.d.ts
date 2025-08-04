import { NF, UF } from "@/types";


/**
 * 柯里化
 * 接受一个任意参数数量的函数，返回柯里化的函数
 * @warning rest参数不计算在参数数量内
 * @example   
 * function func(a, ...other) {
 *    // ...     
 * }  
 * // 该函数值计算为一个参数 
 */
export const curry: CurryFactory

interface CurryFactory {
   <R>(f: () => R): () => R;
   <A, B>(f: (a: A) => B): CurryFunction1<A, B>;
   <A, B, C>(f: (a: A, b: B) => C): CurryFunction2<A, B, C>;
   <A, B, C, D>(f: (a: A, b: B, c: C) => D): CurryFunction3<A, B, C, D>;
   <A, B, C, D, E>(f: (a: A, b: B, c: C, d: D) => E): CurryFunction4<A, B, C, D, E>;
   <A, B, C, D, E, F>(f: (a: A, b: B, c: C, d: D, e: E) => F): CurryFunction5<A, B, C, D, E, F>;
   <A, B, C, D, E, F, G>(
      f: (a: A, b: B, c: C, d: D, e: E, f: F) => G
   ): CurryFunction6<A, B, C, D, E, F, G>;
   <A, B, C, D, E, F, G, H>(
      f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => H
   ): CurryFunction7<A, B, C, D, E, F, G, H>;
   <A, B, C, D, E, F, G, H, I>(
      f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => I
   ): CurryFunction8<A, B, C, D, E, F, G, H, I>;
   <A extends any[], B>(f: NF<A, B>): NF<A, any>;

   <A extends any[], R>(f: NF<A, R>, n: 0): () => R;
   <A extends any[], R>(f: NF<A, R>, n: 1): CurryFromArray<FirstNArgs<A, 1>, R>;
   <A extends any[], R>(f: NF<A, R>, n: 2): CurryFromArray<FirstNArgs<A, 2>, R>;
   <A extends any[], R>(f: NF<A, R>, n: 3): CurryFromArray<FirstNArgs<A, 3>, R>;
   <A extends any[], R>(f: NF<A, R>, n: 4): CurryFromArray<FirstNArgs<A, 4>, R>;
   <A extends any[], R>(f: NF<A, R>, n: 5): CurryFromArray<FirstNArgs<A, 5>, R>;
   <A extends any[], R>(f: NF<A, R>, n: 6): CurryFromArray<FirstNArgs<A, 6>, R>;
   <A extends any[], R>(f: NF<A, R>, n: 7): CurryFromArray<FirstNArgs<A, 7>, R>;
   <A extends any[], R>(f: NF<A, R>, n: 8): CurryFromArray<FirstNArgs<A, 8>, R>;
   <A extends any[], R>(f: NF<A, R>, n: number): NF<A, any>
}

export interface CurryFunction1<A, B> {
   (a: A): B;
}

export interface CurryFunction2<A, B, C> {
   (a: A): CurryFunction1<B, C>;
   (a: A, b: B): C;
}

export interface CurryFunction3<A, B, C, D> {
   (a: A): CurryFunction2<B, C, D>;
   (a: A, b: B): CurryFunction1<C, D>;
   (a: A, b: B, c: C): D;
}

export interface CurryFunction4<A, B, C, D, E> {
   (a: A): CurryFunction3<B, C, D, E>;
   (a: A, b: B): CurryFunction2<C, D, E>;
   (a: A, b: B, c: C): CurryFunction1<D, E>;
   (a: A, b: B, c: C, d: D): E;
}

export interface CurryFunction5<A, B, C, D, E, F> {
   (a: A): CurryFunction4<B, C, D, E, F>;
   (a: A, b: B): CurryFunction3<C, D, E, F>;
   (a: A, b: B, c: C): CurryFunction2<D, E, F>;
   (a: A, b: B, c: C, d: D): CurryFunction1<E, F>;
   (a: A, b: B, c: C, d: D, e: E): F;
}

export interface CurryFunction6<A, B, C, D, E, F, G> {
   (a: A): CurryFunction5<B, C, D, E, F, G>;
   (a: A, b: B): CurryFunction4<C, D, E, F, G>;
   (a: A, b: B, c: C): CurryFunction3<D, E, F, G>;
   (a: A, b: B, c: C, d: D): CurryFunction2<E, F, G>;
   (a: A, b: B, c: C, d: D, e: E): CurryFunction1<F, G>;
   (a: A, b: B, c: C, d: D, e: E, f: F): G;
}

export interface CurryFunction7<A, B, C, D, E, F, G, H> {
   (a: A): CurryFunction6<B, C, D, E, F, G, H>;
   (a: A, b: B): CurryFunction5<C, D, E, F, G, H>;
   (a: A, b: B, c: C): CurryFunction4<D, E, F, G, H>;
   (a: A, b: B, c: C, d: D): CurryFunction3<E, F, G, H>;
   (a: A, b: B, c: C, d: D, e: E): CurryFunction2<F, G, H>;
   (a: A, b: B, c: C, d: D, e: E, f: F): CurryFunction1<G, H>;
   (a: A, b: B, c: C, d: D, e: E, f: F, g: G): H;
}

export interface CurryFunction8<A, B, C, D, E, F, G, H, I> {
   (a: A): CurryFunction7<B, C, D, E, F, G, H, I>;
   (a: A, b: B): CurryFunction6<C, D, E, F, G, H, I>;
   (a: A, b: B, c: C): CurryFunction5<D, E, F, G, H, I>;
   (a: A, b: B, c: C, d: D): CurryFunction4<E, F, G, H, I>;
   (a: A, b: B, c: C, d: D, e: E): CurryFunction3<F, G, H, I>;
   (a: A, b: B, c: C, d: D, e: E, f: F): CurryFunction2<G, H, I>;
   (a: A, b: B, c: C, d: D, e: E, f: F, g: G): CurryFunction1<H, I>;
   (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H): I;
}

type FirstNArgs<Args extends any[], N extends number, R extends any[] = []> =
   R['length'] extends N ? R :
   Args extends [infer First, ...infer Rest] ?
   FirstNArgs<Rest, N, [...R, First]> :
   FirstNArgs<[], N, [...R, any]>;

type CurryFromArray<A extends any[], T> =
   A extends []
   ? () => T
   : A extends [infer P1]
   ? CurryFunction1<P1, T>
   : A extends [infer P1, infer P2]
   ? CurryFunction2<P1, P2, T>
   : A extends [infer P1, infer P2, infer P3]
   ? CurryFunction3<P1, P2, P3, T>
   : A extends [infer P1, infer P2, infer P3, infer P4]
   ? CurryFunction4<P1, P2, P3, P4, T>
   : A extends [infer P1, infer P2, infer P3, infer P4, infer P5]
   ? CurryFunction5<P1, P2, P3, P4, P5, T>
   : A extends [infer P1, infer P2, infer P3, infer P4, infer P5, infer P6]
   ? CurryFunction6<P1, P2, P3, P4, P5, P6, T>
   : A extends [infer P1, infer P2, infer P3, infer P4, infer P5, infer P6, infer P7]
   ? CurryFunction7<P1, P2, P3, P4, P5, P6, P7, T>
   : NF<any[], T>;


/**
 * 组合函数
 * 将多个一元函数组合成一个一元函数，数据流流向为从右向左
 */
export const compose: ComposeFactory

interface ComposeFactory {
   <A, B>(f1: UF<A, B>): UF<A, B>;
   <A, B, C>(f2: UF<B, C>, f1: UF<A, B>): UF<A, C>;
   <A, B, C, D>(f3: UF<C, D>, f2: UF<B, C>, f1: UF<A, B>): UF<A, D>;
   <A, B, C, D, E>(f4: UF<D, E>, f3: UF<C, D>, f2: UF<B, C>, f1: UF<A, B>): UF<A, E>;
   <A, B, C, D, E, F>(
      f5: UF<E, F>,
      f4: UF<D, E>,
      f3: UF<C, D>,
      f2: UF<B, C>,
      f1: UF<A, B>
   ): UF<A, F>;
   <A, B, C, D, E, F, G>(
      f6: UF<F, G>,
      f5: UF<E, F>,
      f4: UF<D, E>,
      f3: UF<C, D>,
      f2: UF<B, C>,
      f1: UF<A, B>
   ): UF<A, G>;
   <A, B, C, D, E, F, G, H>(
      f7: UF<G, H>,
      f6: UF<F, G>,
      f5: UF<E, F>,
      f4: UF<D, E>,
      f3: UF<C, D>,
      f2: UF<B, C>,
      f1: UF<A, B>
   ): UF<A, H>;
   <A, B, C, D, E, F, G, H, I>(
      f8: UF<H, I>,
      f7: UF<G, H>,
      f6: UF<F, G>,
      f5: UF<E, F>,
      f4: UF<D, E>,
      f3: UF<C, D>,
      f2: UF<B, C>,
      f1: UF<A, B>
   ): UF<A, I>;
}


/**
 * 管道化函数
 * 将多个一元函数组合成一个一元函数，数据流流向为从左向右
 */
export const pipeline: PipelineFactory

interface PipelineFactory {
   <A, B>(f1: UF<A, B>): UF<A, B>;
   <A, B, C>(f1: UF<A, B>, f2: UF<B, C>): UF<A, C>;
   <A, B, C, D>(f1: UF<A, B>, f2: UF<B, C>, f3: UF<C, D>): UF<A, D>;
   <A, B, C, D, E>(f1: UF<A, B>, f2: UF<B, C>, f3: UF<C, D>, f4: UF<D, E>): UF<A, E>;
   <A, B, C, D, E, F>(
      f1: UF<A, B>,
      f2: UF<B, C>,
      f3: UF<C, D>,
      f4: UF<D, E>,
      f5: UF<E, F>
   ): UF<A, F>;
   <A, B, C, D, E, F, G>(
      f1: UF<A, B>,
      f2: UF<B, C>,
      f3: UF<C, D>,
      f4: UF<D, E>,
      f5: UF<E, F>,
      f6: UF<F, G>
   ): UF<A, G>;
   <A, B, C, D, E, F, G, H>(
      f1: UF<A, B>,
      f2: UF<B, C>,
      f3: UF<C, D>,
      f4: UF<D, E>,
      f5: UF<E, F>,
      f6: UF<F, G>,
      f7: UF<G, H>
   ): UF<A, H>;
   <A, B, C, D, E, F, G, H, I>(
      f1: UF<A, B>,
      f2: UF<B, C>,
      f3: UF<C, D>,
      f4: UF<D, E>,
      f5: UF<E, F>,
      f6: UF<F, G>,
      f7: UF<G, H>,
      f8: UF<H, I>
   ): UF<A, I>;
}