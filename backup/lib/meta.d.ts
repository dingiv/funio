
/**
 * 根据条件C的值返回响应的结果
 */
type If<C extends boolean, T, F> = C extends true ? T : F

/**
 * 判读A是否继承于B
 * 这要分成联合和对象来看
 * 对于联合，A包含于B中，A是B的一个子集
 * 对于对象来说，B的属性更少，A的属性更多，A更加具体，因此A的范围窄，B的范围宽
 * 
 * 范畴小的的值可以被赋值给另外一个范畴更大的变量，
 * 子类可以赋值给父类
 */
type Ex<A, B> = A extends B ? true : false

/**
 * extends 的简写
 */
type E<A, B, C = never, D = never> = A extends B ? C : D

/**
 * 获取类组中的第一个类型
 */
export type First<T extends any[]> = T extends [infer F, ...infer R] ? F : never

/**
 * 获取元组中的最后一个类型
 */
export type Last<T extends any[]> = T extends [...any[], infer Latest] ? Latest : never

/**
 * 检测never类型，并提供边界
 */
export type CatchNever<T, R> = [T] extends [never] ? R : T

/**
 * 获取一个元组的长度
 */
export type Length<T extends readonly any[]> = T['length']

/**
 * 从联合Union中排除某个类型T，Ｔ也可以是联合，从联合Union中排除T与Union的交集
 */
export type ExcludeFromUnion<T, Union> = Union extends T ? never : Union

/**
 * 判断U是否在元组T中
 */
type Includes<Tuple extends any[], U> = {
   [K in Tuple[number]]: true
}[U] extends true
   ? true
   : false


/**
 * 将元组中的类型提取出来，变成一个联合
 */
type TupleToUnion<T extends any[]> = T[number]

/**
 * 将一个联合类型转化为一个元组
 */
export type UnionToTuple<T> = UnionToTupleRecursively<T> extends infer O ? { [K in keyof O]: O[K] } : never;

type LastOf<T> = UnionToIntersection<
   T extends any ? (x: T) => void : never
> extends (x: infer R) => void ? R : never;
type Prepend<E, T extends any[]> =
   ((head: E, ...tail: T) => void) extends ((...args: infer U) => void) ? U : T;
type UnionToTupleRecursively<T, L = LastOf<T>> =
   [T] extends [never] ? [] : Prepend<L, UnionToTupleRecursively<Exclude<T, L>>>;


/**
 * 判读一个类型是否是联合类型
 */
type IsUnion<T> = (T extends any ? (arg: T) => void : never) extends (
   arg: infer U
) => void
   ? [T] extends [U]
   ? false
   : true
   : never

/**
 * 将一个联合类型转化为一个交叉类型
 * 注意：交叉类型适用于对象与对象，对象和基本类型，基本类型之间交叉将会返回never
 */
type UnionToIntersection<U> =
   (U extends any ? (x: U) => void : never) extends (x: infer R) => void ? R : never;

/**
 * unknown 和 any 
 * any可以进行任意操作，编译器完全放弃检查
 * 而unknown保持检查，对unknown的任何操作将会得到警告，强迫我们在使用unknown之前对其类型进行检查或者断言
 */


/**
 * 使用 keyof 操作符可以获取一个对象类型的所有 key 或 数字字面量组合的联合类型
 */
export type KeyOf<O> = keyof O

/*
下标操作符
type Person = {
  name: string;
  age: number;
  isMan: boolean;
}
type Name = Person['name'] // string

type NameAndAge = Person['name' | 'age'] // string | number

*/

/**
 * 比较两个数字字面量的大小，“大于”，不包含
 */
export type Gt<A extends number, B extends number> =
   BuildTuple<A> extends [...BuildTuple<B>, ...infer _Rest] ? true : false;
type BuildTuple<L extends number, T extends any[] = []> =
   T['length'] extends L ? T : BuildTuple<L, [...T, any]>;

/**
 * 比较两个数字字面量的大小，“小于”，不包含
 */
type Lt<A extends number, B extends number> =
   BuildTuple<B> extends [...BuildTuple<A>, ...infer _Rest] ? true : false;
