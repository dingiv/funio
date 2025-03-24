# 

```js
const fora = iter.map(array, afc)

```

```js
Array
String
Map
Set
TypedArray
arguments
Generator

FileList

```

## 顺序结构
1. 优先使用**可迭代协议**对对象进行迭代；
```js
// map
if (Symbol.iterator in obj) {
   for (let item of obj) {
      //
   }
}

```

1. 其次尝试**ArrayLike**迭代方式；
```js
// map
if (obj.length > 0 && obj[0] !== undefined) {
   for (let )
}

```

## 分支结构
1. 使用 for...in 遍历一个对象上的所有可迭代的 string key，包括原型链上的值。
mapIn

2. 使用 Reflect.ownKeys/ Own Properties 迭代一个对象的自身拥有属性，包括 string key 和 symbol key
mapOwn