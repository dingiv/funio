import { UF } from "@/types";

/**
 * @module match
 * @description 断言
 */
export const assurt: AssertUtils = <A, B>(predicate: UF<A, B>, msg?: string): UF<A, B> => {
   return (data: A) => {
      const ret = predicate(data)
      if (ret) return ret
      throw Error('')
   }
}

export interface AssertUtils {
   <A, B>(predicate: UF<A, B>): UF<A, B>
}

interface NumberAssert {
   eq(): any;
   ne(): any;
   gt(): any;
   lt(): any;
   ge(): any;
   le(): any;
}

interface RangeAssert {

}