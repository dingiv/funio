
/**
 * range，添加 range 支持
 */
export const range: RangeConstructor = (...args: number[]) => {
   let start = 0, end = 0, step = 1
   if (args.length === 1) {
      start = 0
      end = args[0]
   } else if (args.length === 2) {
      start = args[0]
      end = args[1]
   } else if (args.length === 3) {
      start = args[0]
      end = args[1]
      step = args[2]
   }
   return new RangeImpl(start, end, step)
}

export interface RangeConstructor {
   (end: number): Range
   (start: number, end: number): Range
   (start: number, end: number, step: number): Range
}

export interface Range {
   [Symbol.iterator](): Iterator<number>
}

class RangeImpl implements Range {
   constructor(private start: number, private end: number, private step: number = 1) { }
   [Symbol.iterator]() {
      let current = this.start
      const end = this.end

      return {
         step: this.step,
         next() {
            if (current <= end) {
               const value = current
               current += this.step
               return { value, done: false }
            }
            return { value: NaN, done: true }
         }
      }
   }
}