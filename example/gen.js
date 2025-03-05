

function* demo() {
   const user = yield q('name').name('zs').age(19)
   const agex = yield user.age()

   const a = yield 'a'

   


   return user.age
}