const {
   Component,
   Inject,
   Main
} = createIoc()

function log(target, ctx) {

   return {}
}

@Component('human')
class Human {
   name = 'human'
   age = 18
}

@Component('father')
class User {
   @Inject('human') son

   getName() {
      return this.son.name
   }
}

@Main('main')
class App {
   main() {

   }
}

@log 
class Demo {

}