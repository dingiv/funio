
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

export const partial = (f, ...args) => {
   if (!Array.isArray(args)) return (...a) => f(args, ...a)
   const len = Math.max(Number(f.length) || 0, Number(args.length) || 0)
   let remaining = len
   const tmp = new Array(len)
   if (args.length < f.length) {
      for (let i = args.length; i < f.length; ++i) args[i] = partial
   }
   for (let i = 0; i < len; ++i) {
      if (args[i] !== partial) --remaining
      tmp[i] = args[i]
   }
   const curried = (...args) => {
      if (args.length >= remaining) {
         const newArgs = [...tmp]
         for (let i = 0, j = 0, nl = args.length; i < nl && j < len; j++) {
            if (newArgs[j] !== partial) continue
            newArgs[j] = args[i++]
         }
         return f(...newArgs)
      } else {
         return (...args2) => curried(...args, ...args2)
      }
   }
   return curried
}
