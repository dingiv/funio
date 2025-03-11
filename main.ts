
console.time('b')

let b = 0
const f2 = () => {
   for (let i = 0; i < 1_000_000; i++) {
      b++
   }
}
f2()

console.timeEnd('b')



const f1 = new Proxy(() => { }, {
   apply(target, thisArg, argArray) {
      for (let i = 0; i < 1_000_000; i++) {
         a++
      }
   },
})
console.time('a')

let a = 0
f1()

console.timeEnd('a')



