
// 允许用户添加额外的 pipe api
export const withCustomPipe = (pipe: any) => {
   const customPipe = {
      ...pipe,
      transform: (value: any, ...args: any[]) => {
         // console.log('customPipe.transform', value, args);
         return pipe.transform(value, ...args);
      },
   };
   return customPipe;
}