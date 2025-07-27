
const STATE = Symbol('state')

const QP = class QuietPromise<T> extends Promise<T> {
   static PENDING = 'pending';
   static FULFILLED = 'fulfilled';
   static REJECTED = 'rejected';

   [STATE]: string = QuietPromise.PENDING;
   constructor(executor: any) {
      super(executor);
   }

   get state(): string {
      return this[STATE]
   }
}

const QuietPromise = <T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) => {
   const p = new QP(executor)
   p[STATE] = QP.PENDING
   return p.then(
      (value) => {
         p[STATE] = QP.FULFILLED;
         return value;
      },
      (reason) => {
         p[STATE] = QP.REJECTED;
         throw reason;
      }
   )
}