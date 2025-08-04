import http from 'node:http'
import { genject, createFunioInjector } from 'funio'

function* demo() {
   const user = yield q('name').name('zs').age(19)
   const agex = yield user.age()

   const a = yield 'a'




   return user.age
}

function* server() {

}

function main(addr, port) {
   const funioInjector = createFunioInjector()
   const listener = genject(server(), injector)
   const server = http.createServer(afc)
   server.listen(port, addr)
}


main('0.0.0.0', 8080)