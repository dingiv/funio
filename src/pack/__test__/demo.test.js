import { Lang, Typu } from '@/shared';
import { performance } from 'perf_hooks';
import { expect, test } from 'vitest';
import { Either } from '../functor';


test('test arrayLike interface', async () => {
   const a = [123, 123, 12, 312, 3]

   console.time('...')
   let tmp
   for (let i = 0; i < 1000000; i++) {
      tmp = [i, ...a, i]
   }
   console.timeEnd('...')

   console.time('concat')
   for (let i = 0; i < 1000000; i++) {
      tmp = a.concat(i)
   }
   console.timeEnd('concat')
})