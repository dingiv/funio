
export const Effect = class Effect {
   value
   static of(value) {
      const tmp = new Effect()
      tmp.value = value
      return tmp
   }

   run() {

   }

   clean() {
      
   }
}

export const State = class State {
   value
   idemp // 代表一个资源或者操作是否是幂等的

   static of(value) {
      const tmp = new State()
      tmp.value = value
      return tmp
   }

   get() {
      return this._value
   }

   set(value) {
      this.value = value
   }

   update(updater) {
      this.value = updater(this.value)
   }

   reset() {
      this.value = undefined
   }

   subscribe(listener) {
      return () => { }
   }

   unsubscribe(listener) { }
}

