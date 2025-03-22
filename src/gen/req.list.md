# 需求列表

+ 函数局部依赖 ctx
```js

function* inner() {
   const b = yield ctx('local-key')
   b // 12
}

function* middle() {
   yield ctx('local-key').provide(12)
   const a = yield inner()
} 

function* outer() {
   const a = yield middle()

   const b = yield ctx('local-key')
   b // Error: local-key

}

```

+ web worker injector 


+ type validate logic