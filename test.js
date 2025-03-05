

class User {

   constructor(name, age) {
      this.name = name;
      this.age = age;
   }
}

console.time('user')
for (let i = 0; i < 1000000; i++) {
   let user = new User('John', 30);
   user.name = 's'
}
console.timeEnd('user')

console.time('user2')
const User2 = function () {
   const proto = {
      sayHi() {
         console.log('hi')
      }
   }

   const tmp = () => {
      return Object.create(proto)
   }
   tmp.si = 'as'

   return tmp
}()
for (let i = 0; i < 1000000; i++) {
   let user = User2();
   user.name = 's'
}
console.timeEnd('user2')