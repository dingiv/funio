


function* gen(): Generator {
   console.log(123)
   const a = yield 123
   console.log(a)

   return 1
}

const v = gen()
const a = v.next(213)
console.log("a", a)

export {}