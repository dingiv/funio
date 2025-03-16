import { FPipe } from './fpipe'
import { FPack } from './fpack'

export { FPipe } from './fpipe'
export const $f = FPipe
export { FPack } from './fpack'
export const $k = FPack



// 允许用户添加额外的 pipe api
export const createFPipeGroup = (pipe: any) => {
   const customPipe = {
      ...pipe,
      transform: (value: any, ...args: any[]) => {
         // console.log('customPipe.transform', value, args);
         return pipe.transform(value, ...args);
      },
   };
   return customPipe;
}
