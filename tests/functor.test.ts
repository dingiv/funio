import { test } from 'vitest'
import { $f } from '@/index'


test('test State', () => {
   const task = $f(0).pipe((n: any) => {
      console.log('ni', n)
      return n + 1
   }).pipe((n: any) => {
      console.log('ni2', n)
      const a = undefined as any
      a.name
      return n * 2
   }).compose((n: any) => {
      console.log('comp')
      return n / 3
   }).maybe(12).catch(43).assert((data: any) => {
      return typeof data === 'string'
   })

   const ret = task.func(2)
   
   
   console.log(task.value)
})
