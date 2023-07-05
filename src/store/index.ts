import localforage from 'localforage'

export interface IParam {
  duration: {
    min: number
    max: number
  }
  vFunc: string
}

export interface IData {
  name: string
  percent: number
}

export interface ITrans {
  name?: string
  count?: number
  time?: string
  data: IData[]
  param?: IParam
}

export const storeData = localforage.createInstance({
  name: 'LUCKYWHEEL_DATA',
  storeName: 'LUCKYWHEEL_BASE',
  description: 'LUCKYWHEEL',
})
