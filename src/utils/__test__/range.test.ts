import { Range } from '@/range'
import { test } from 'vitest'

test('test range', () => {
   for (const i of Range(1, 33, 3)) {
      console.log(i)
   }
})