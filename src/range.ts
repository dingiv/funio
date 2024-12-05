
const START = Symbol("start")
const END = Symbol("end")
const STEP = Symbol("step")

class R {
   constructor(public start: number, public end: number, public step: number = 1) { }
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
            return { done: true }
         }
      }
   }

}

export const Range = (start: number, end?: number, step: number = 1) => {
   if (end === undefined) {
      end = start
      start = 0
   }
   const range = {
      [START]: start,
      [END]: end,
      [STEP]: step,
      [Symbol.iterator]() {
         let current = this[START]
         const end = this[END]

         return {
            next() {
               if (current <= end) {
                  const value = current
                  current += step
                  return { value, done: false }
               }
               return { done: true }
            }
         }
      }
   }

   return range;
}