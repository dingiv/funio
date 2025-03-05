import { test } from 'vitest'
import { builder, factory } from '@/utils'

test('test timeout', async () => {
   class Human {
      static gender = 'human'
   }

   console.time('test')
   for (let i = 0; i < 1_000_000; i++) {
      const User = factory(Human)
      User.gender = 'male'
   }
   console.timeEnd('test')

})

