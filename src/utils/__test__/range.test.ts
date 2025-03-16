import { range } from '@/utils/range'
import { test } from 'vitest'

test('test range', () => {
   for (const i of range(1, 33, 3)) {
      console.log(i)
   }

   console.log("")

   for (const i of range(6)) {
      console.log(i)
   }
}) 