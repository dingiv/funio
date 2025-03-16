
export interface Collector<T> {
   value: any
   add(value: T): void
   end(value: T): void
}

class CollectorImpl<T> {

}

export const collector = () => {
   const tmp = new CollectorImpl()

   return tmp
}

collector.asArray = () => { }
collector.asSet = () => { }
collector.asMap = () => { }