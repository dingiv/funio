import { factory } from "./utils"

const START = Symbol("start")
const END = Symbol("end")
const STEP = Symbol("step")

export interface Range extends ReturnType<typeof Range> {
   [START]: number
   [END]: number
   [STEP]: number
}
export const Range = factory(class Range {
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
})
