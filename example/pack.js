import { Chain as $c } from 'pipe'


const pack = $c(0).pipe((val) => {
   console.log(val)
   return val + 1
}).pipe(function* (val) {
   const a = yield 'a'


}).sleep(200).pipe((val) => {

})

const func = pack.f

const value = pack.v