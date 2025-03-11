# dependency injection query object
We use a simple protocol to inject an any type value by using the `yield` keyword as follow.
```js
function* injectable(v1, v2) {
   const injectedVal1 = yield v1 + 1
   const injectedVal2 = yield v2 + 1
   return 3
}

function* injectable(v1, v2) {
   const injectedVal1 = yield di.readfile.name("demo.txt")
   const injectedVal2 = yield Pack.new()
   return 3
}
```