import { Gt } from './meta'



type AppendFromOther<A extends any[], B extends any[]> =
   Gt<A['length'], B['length']> extends true ? A :
   B[A['length']] extends infer T ? AppendFromOther<[...A, T], B> : [...A, any];

// 测试示例
type Test1 = AppendFromOther<[string, number], [boolean, boolean, boolean]>; // [string, number, boolean]
type Test2 = AppendFromOther<[string], [number, boolean, boolean]>; // [string, boolean, boolean]
type Test3 = AppendFromOther<[number, string, boolean], [number]>; // [number, string, boolean]
type Test4 = AppendFromOther<[number, string], [boolean, boolean]>; // [number, string]
type Test5 = AppendFromOther<[], [number, string]>; // [number, string]
type Test6 = AppendFromOther<[number], [boolean, string, boolean]>; // [number, string, boolean]
type Test7 = AppendFromOther<[bigint, string, true, string], [number, string, string]>; // [bigint, string, true, string]

