
export const curry = (func, argc = 0) => {
   argc = Number(argc) || Number(func.length)
   if (argc <= 1) return func
   const curried = (...args) => {
      if (args.length >= argc) {
         return func(...args)
      } else {
         return (...args2) => curried(...args, ...args2)
      }
   }
   return curried
}

export const compose = (...functions) => {
   return (data) => {
      for (let i = functions.length - 1; i >= 0; --i) {
         data = functions[i](data)
      }
      return data
   }
}

export const pipeline = (...functions) => {
   return (data) => {
      for (let i = 0, len = functions.length; i < len; ++i) {
         data = functions[i](data)
      }
      return data
   }
}
