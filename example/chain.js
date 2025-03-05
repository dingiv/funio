import { Chain as $c } from 'pipe'


const f = $c(0).then((val) => {
   console.log(val)
   return val + 1
}).then(function* (val) {
   const a = yield 'a'


}).sleep(200).then((val) => {
   
})
