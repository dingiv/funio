
export type KeyType = string | symbol | number
export const GolbalModule = Symbol.for('global_module')
export interface Diqo {
   /**
    * 用于定位一个资源，是资源标识符，不保证唯一性
    */
   id: string | symbol | number
   /**
    * 用于决策在遇到多个相同的 id 匹配同个查询的时候，使用最新的匹配相进行匹配
    */
   version?: string // TODO: 添加更多语义
   /**
    * 用于将资源进行分组隔离，需要保证唯一性，默认为 <global_module>
    */
   module?: string | symbol | number
}

export const di = (value: any) => {

}
