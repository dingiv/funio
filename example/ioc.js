const {
   Component,
   Inject,
} = createIoc()

@Component('human')
class Human {
   name = 'human'
   age = 18
}

@Component('son')
class User {
   @Inject('human') son

   getName() {
      return this.son.name
   }
}
