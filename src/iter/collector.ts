
export interface Collector<T, R> {
   collect(value: T): R /* Container */
}

const CollectorImpl = class CollectorImpl<T, R extends any[]> implements Collector<T, R> {
   result: any[] = []

   collect(value: T) {
      this.result.push(value)
      return this.result as R
   }
}

export const Collector = function () {
   const Collector = () => new CollectorImpl
   Collector.asArray = () => { }
   Collector.asSet = () => { }
   Collector.asMap = () => { }
   Collector.asRecord = () => { }
   Collector.new = () => new CollectorImpl
   Collector.create = () => new CollectorImpl
   return Collector
}()
