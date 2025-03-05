# funio
My functional programming library.



## 操作符替换
1. 算术操作符 
2. 赋值操作符
3. 比较操作符 -> **使用 Equal 模块代替**
4. 逻辑操作符
5. 位运算操作符
6. 其他操作符，不处理
   + 三元操作符
   + 逗号操作符
   + 括号操作符
   + 可选链操作符
   + in 操作符
   + await 操作符
   + yield 操作符
   + void 操作符 -> 使用 TS，让编译器自动将 undefined 转换为 void 0
   + delete 操作符 -> 不处理，或使用 Reflect.delete 代替
7. 其他运算符，处理
   + new 操作符 -> **使用 Util/factory/builder 函数代替**
   + typeof 操作符 -> **使用 Type 模块代替**
   + instanceof 操作符 ->  **使用 Type 模块代替**

## 流程控制
+ 声明，
  + var、let、const
  + function
  + class -> **使用 factory/builder 函数，包裹构造函数进行定义**
+ 分支，对标 Match 模块
  + if...else if...else
  + switch...case -> **Match 模块代替、Assert 模块**
+ 循环，对标 Range 模块、Loop 模块、Matrix 模块
  + while
  + do...while -> **Loop 模块代替**
  + for
  + for...in -> **Loop 模块代替，包含对各种属性的迭代能力**
  + for...of
+ 异常处理，使用 Pipe、Pack、Assert 模块
  + try...catch...finally，使用 Pipe 模块代替
  + throw
+ 异步和 Promise，使用 Pack、Memo 模块处理
  + async...await
  + Promise -> **Pack 模块代替**
  + function*...yield ->
  + async function*...yield
+ 其他，不处理
  + return
  + break
  + continue
  + debugger
+ 内置模块
  + Math、Date、RegExp、JSON、Reflect、Proxy
  + Boolean、Number、Bigint、String、Symbol、Object、Function
  + Array、Set、Map、WeakSet、WeakMap
  + Error、EvalError、RangeError、ReferenceError、SyntaxError、TypeError、URIError
  + ArrayBuffer、DataView、Uint8Array、Uint16Array、Uint32Array、Float32Array、Float64Array


## Promise 
使用 Pack.try() 包裹所有可能抛出异常的同步函数、可能执行失败的异步函数、返回可能被拒绝的 Promise 的函数，得到其静默版本

或者 使用 Pack() 包裹所有返回 Promise 对象的函数调用，包括异步函数和返回 Promise 对象的普通函数

使用 Pack() 创建一个异步任务，而不是 new Promise(()=> {})

## class 
妥协和并存，对于非泛型类，使用 factory/builder 函数，立即执行函数包裹类定义代替；对于泛型类，要自行搞定 constructor 和 instance 的类型声明。



```js
interface User extends ReturnType<typeof User> {}
const User = factory(class User {
   name: string
   hi() {
      return `hi, ${this.name}`
   }
   constructor(name: string) {
      this.name = name
   }
})

// 如果遇到泛型，那么没有办法，智能将 class 定义提出来
class UserClass<T> {
   hook: T
   constructor(hook: T) {
      this.hook = hook
   }
}
interface User<T> extends UserClass<T> {}
interface UserConstructor { <T>(hook: T): User<T>, staticProp: any }
const User = factory(UserClass) as UserConstructor

```

## 函数
+ 普通函数 function
+ 箭头函数 () => {}
+ 构造函数 class
+ 异步函数 async function
+ 生成器函数 function*...yield


```js
const f = $f(0).then((data, ctx) => {

}).then((data, ctx) => { 

}).catch((err, ctx) => {
   
})



```