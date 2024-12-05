
interface Task<T> extends Promise<T> {
   resolve(value: any): void
   reject(reason?: any): void
}

export const Task = <T>(): Task<T> => {
   const { promise, resolve, reject } = Promise.withResolvers()
   const p = promise as Task<T>
   p.resolve = resolve
   p.reject = reject
   return p
}

const ae = Task<number>()