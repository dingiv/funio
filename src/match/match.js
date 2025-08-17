

export const execMatch = function () {
   function caller(data) {
      if (data != null) {
         caller[CALL_RES] = caller.f.call(undefined, data)
      }
   }
   const CALL_RES = Symbol('match_call_result')
   const CALL_FLAG = Symbol('match_call_flag')
   return (data, patterns, callbacks) => {
      for (let index = 0; index < patterns.length; ++index) {
         try {
            const p = patterns[index]
            caller[CALL_RES] = CALL_FLAG
            caller.f = callbacks[index]
            p.match(data, caller)
            switch (caller[CALL_RES]) {
               case true:

                  break;
               case false:
               case null:
               case undefined:

                  break;
               default:
                  break;
            }
            if (caller[CALL_RES] !== CALL_FLAG) {

               return caller[CALL_RES]
            }
         } catch {
            continue
         }
      }
   }
}()

const MatchImpl = class Match {
   data
   patterns = []
   callbacks = []

   static of(data) {
      const m = new Match
      m.data = data
      return m
   }

   case(cond, callback) {
      this.patterns.push(function (data, cb) {
         if (cond === data) {
            cb(data)
         }
      })
      this.callbacks.push(callback)
      return this
   }

   test(tester, callback) {
      this.patterns.push((data, cb) => {
         if (tester(data)) {
            cb(data)
         }
      })
      this.callbacks.push(callback)
      return this
   }

   when(pattern, callback) {
      this.patterns.push(pattern)
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

export const Match = (data, arms) => {
   return MatchImpl.of(data)
}

