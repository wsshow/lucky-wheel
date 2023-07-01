import * as PIXI from 'pixi.js'
import { IPoint } from '../../utils'
import { FancyButton } from '@pixi/ui'

export class DisplayController {
  private defaultView = new PIXI.Graphics()
    .beginFill(0x16a383, 0.8)
    .drawRoundedRect(0, 0, 300, 50, 15)
    .endFill()
  private fancyButton = new FancyButton({
    defaultView: this.defaultView,
    text: new PIXI.Text(
      '0',
      new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 22,
        fill: '#ffffff',
        align: 'center',
      })
    ),
  })

  constructor(pos: IPoint, defaultText?:string) {
    this.fancyButton.position.set(pos.x, pos.y)
    defaultText && this.setName(defaultText)
  }

  get() {
    return this.fancyButton
  }

  setName(name: string) {
    this.fancyButton.text = name
  }

  setColor(color: PIXI.ColorSource) {
    this.defaultView
      .beginFill(color)
      .drawRoundedRect(0, 0, 300, 50, 15)
      .endFill()
  }

  onPress(callbackFn:()=>void){
    this.fancyButton.onPress.connect(callbackFn)
  }
}
