# dependency injection query object
We use a simple protocol to inject an any type value by using the `yield` keyword as follow.
```js
function* injectable(v1, v2) {
   // use 'yield' to call injector and injected value will be brought back by 'yield',
   // the brought value will NOT be 'Promise'
   const injectedVal1 :number = /* never */ yield v1 + 1
   
   const injectedVal2 = yield v2 + 1
   return 3
}

function* injectable(v1, v2) {
   const injectedVal1 = yield di.readfile.name("demo.txt")
   const injectedVal2 = yield Pack.new()
   return 3
}
```