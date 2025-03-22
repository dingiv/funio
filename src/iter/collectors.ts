
export interface Collector<T> {
   value: any
   add(value: T): void
   end(value: T): void
}

class CollectorImpl<T> implements Collector<T> {
   value: any
   add(value: T): void {
      throw new Error("Method not implemented.")
   }
   end(value: T): void {
      throw new Error("Method not implemented.")
   }
   
}

export const collector = () => {
   const tmp = new CollectorImpl()

   return tmp
}

collector.asArray = () => { }
collector.asSet = () => { }
collector.asMap = () => { }