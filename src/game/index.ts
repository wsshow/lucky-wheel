import * as PIXI from 'pixi.js'
import { NewText } from '../text'

export const game = (app: PIXI.Application<PIXI.ICanvas>) => {
  const textProgress = NewText('lucky wheel')
  app.stage.addChild(textProgress)
}
