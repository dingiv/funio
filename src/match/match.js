import { Pattern } from "./pattern"

export const match = (data) => {
   return (...pairs) => {
      for (let i = 0; i < pairs.length; i += 2) {
         let pattern = pairs[i]
         const callback = pairs[i + 1]
         if (Pattern.isPattern(pattern)) {
            const result = pattern.match(data)
            if (result.isSome) {
               return callback(result.value)
            }
         } else {
            pattern = createAnyInfo(pattern)
            const result = matchAny(data, pattern)
            if (result !== FAIL) {
               return callback(result)
            }
         }
      }
      return undefined
   }
}

const execMatch = (data, patterns, callbacks) => {
   for (let index = 0; index < patterns.length; ++index) {
      const result = patterns[index].match(data)
      if (result.isSome) {
         return callbacks[index](result.value)
      }
   }
   return undefined
}

const MatchImpl = class Match {
   data
   patterns = []
   callbacks = []

   static of(data, ...pairs) {
      const m = new Match
      m.data = data
      for (let i = 0; i < pairs.length; i += 2) {
         m.patterns.push(pairs[i])
         m.callbacks.push(pairs[i + 1])
      }
      return m
   }

   when(pattern, callback) {
      if (Pattern.isPattern(pattern)) {
         this.patterns.push(pattern)
      } else {
         this.patterns.push(createAnyInfo(pattern))
      }
      this.callbacks.push(callback)
      return this
   }

   get value() {
      return execMatch(this.data, this.patterns, this.callbacks)
   }

   get func() {
      const patterns = this.patterns
      const callbacks = this.callbacks
      return (data) => execMatch(data, patterns, callbacks)
   }

   typeof() { }
   instanceof() { }
   in() { }
   own() { }
   is() { }
   equals() { }
   like() { }
   same() { }
}

export const Match = (data, ...pairs) => MatchImpl.of(data, ...pairs)
