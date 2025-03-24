const obj = {
   age: 3,
   get a() {
      return this.age
   }
}

const b2 = Object.create(obj)
b2.name = 'xd'

for (const key in b2) {
   console.log(key)
}