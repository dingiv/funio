import { VALUE } from './types'
import { pipeline } from './comp'

const DEFERED = Symbol('deferred_value')

/**
 * 实现Functor函子
 */
const functorProto = {
   get value() { return this[VALUE] },
   map(f) {
      return createFunctor(f(this[VALUE]))
   }
}

const functorDProto = {
   get value() {
      return pipeline(...this[PIPELINE])
   },
   map(f) {
      const functor = createFunctor()
      functor[PIPELINE] = [...this[PIPELINE], f]
      return functor
   }
}

const createFunctor = (data) => {
   let functor
   if (data !== undefined) {
      functor = Object.create(functorProto)
      functor[VALUE] = data
   } else {
      functor = Object.create(functorDProto)
      functor[VALUE] = DEFERED
      functor[PIPELINE] = []
   }
   return functor
}

export const Functor = (data) => {
   return createFunctor(data)
}

/*
  实现Range函子
*/
const rangeProto = {
   get value() { return [...this[VALUE]] },
   map(f) {
      return $R(...f([...this[VALUE]]))
   }
}

Reflect.defineProperty(rangeProto, Symbol.iterator, {
   value: function* () {
      let [left, right] = this[VALUE]
      while (left < right) {
         yield left++
      }
   }
})

export const createRange = (init) => {
   const range = Object.create(rangeProto)
   let [left, right] = init
   if (typeof left !== 'number') left = 0
   if (typeof right !== 'number') right = 0

   range[VALUE] = [left, right]
   return range
}

export const $R = (...init) => {
   return createRange(init)
}

/**
 * Maybe函子
 */
const maybeProto = {
   get value() { return this[VALUE] },
   map(f) {
      const value = this[VALUE]
      if (value === undefined || value === null)
         return this
      return Maybe(f(value))
   },
   unwrap(data) {
      const value = this[VALUE]
      if (value === undefined || value === null)
         return data
      return this[VALUE]
   }
}


const UNWRAP = Symbol("maybe_unwrap")
const maybeDProto = {
   ...maybeProto,
   get value() {
      const pipes = this[PIPELINE].map(f => {
         return (x) => {
            if (x === undefined || x === null)
               return void 0
            else return f(x)
         }
      })
      if (this[UNWRAP] !== undefined) {
         pipes.push((x) => {
            if (x === undefined || x === null)
               return this[UNWRAP]
            else return x
         })
      }
      return pipeline(...pipes)
   },
   map(f) {
      const maybe = Maybe()
      maybe[PIPELINE] = [...this[PIPELINE], f]
      return maybe
   },
   unwrap(data) {
      const maybe = Maybe()
      maybe[PIPELINE] = this[PIPELINE]
      maybe[UNWRAP] = data
      return maybe
   }
}

export const createMaybe = (data, defered) => {
   let maybe
   if (defered) {
      maybe = Object.create(maybeDProto)
      maybe[VALUE] = DEFERED
      maybe[PIPELINE] = []
   } else {
      maybe = Object.create(maybeProto)
      maybe[VALUE] = data
   }
   return maybe
}

export const Maybe = (...data) => {
   return createMaybe(data[0], data.length === 0)
}

/**
 * Either函子实现
 */
const rightProto = {
   get value() { return this[VALUE] },
   map(f) {
      try {
         return Either(f(this[VALUE]))
      } catch (error) {
         return Either(error, leftProto)
      }
   },
   catch(f) {
      return this
   }
}

const leftProto = {
   get value() { return this[VALUE] },
   map(f) {
      return this
   },
   catch(f) {
      try {
         return Either(f(this[VALUE]))
      } catch (error) {
         return Either(error, leftProto)
      }
   }
}

export const Either = (data, proto = rightProto) => {
   const either = Object.create(proto)
   either[VALUE] = data
   return either
}


/*
  实现Monad函子
*/
const monadProto = {
   get value() { return this[VALUE] },
   map(f) {
      return Monad(f(this[VALUE]))
   },
   flatMap(f) {
      return f(this[VALUE])
   }
}

export const Monad = (data) => {
   const monad = Object.create(monadProto)

   monad[VALUE] = data

   return monad
}


/*
  实现Apply函子
*/
const applyProto = {
   get value() { return this[VALUE] },
   map(f) {
      return Apply(f(this[VALUE]))
   },
   apply(data) {
      return this[VALUE](data)
   }
}

export const Apply = (f) => {
   const monad = Object.create(applyProto)

   monad[VALUE] = typeof f === 'function' ? f : x => x

   return monad
}

/*
  实现Apply函子
*/
const PIPELINE = Symbol('unary_pipeline')
const unaryProto = {
   get value() {
      return pipeline(...this[PIPELINE])
   },
   map(f) {
      return Apply(f(this[VALUE]))
   },
   apply(data) {
      return this[VALUE](data)
   },
   pipe(f) {
      return createUnary([...this[PIPELINE], f], f)
   },
   comp(f) {
      return createUnary([f, ...this[PIPELINE]], f)
   },
   chain(unary) {
      return createUnary([...this[PIPELINE], unary[VALUE]], unary[VALUE])
   }
}

const createUnary = (pipeline, f) => {
   const monad = Object.create(unaryProto)

   pipeline = pipeline.filter(x => typeof x === 'function')
   monad[PIPELINE] = pipeline
   monad[VALUE] = f

   return monad
}

export const Unary = (f) => {
   if (typeof f !== 'function') throw Error("Unary only accepts functions.")
   return createUnary([f], f)
}


/**
 * Task
 * 副作用任务对象
 */
export const Task = () => {

}

// Functor ->  State
// Unary -> Task


// 封装几个，增加容器
// Functor
// Apply
// List
// Task$ 处理异步逻辑
// Effect$
// State$
// 都默认延迟执行