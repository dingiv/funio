
/**
 * @module utils
 * 
 */
export const lang = {
   const(obj: object) {
      Object.freeze(obj)
   },
   definePrototype() {
      console.log('34')
   }
} as const

export const a = function a() {
   console.log('sf')
}

export function b(params: any) {

}