import * as PIXI from 'pixi.js'

export interface IResult {
  container: PIXI.Container<PIXI.DisplayObject>
}

export class ResultController {
  private texts: PIXI.Text[] = []
  private container: PIXI.Container<PIXI.DisplayObject>

  constructor() {
    this.container = new PIXI.Container()
  }

  private newText(s: string): PIXI.Text {
    const style = new PIXI.TextStyle({
      breakWords: true,
      dropShadowAlpha: 0.8,
      dropShadowBlur: 4,
      dropShadowColor: '#2a56bb',
      fill: '#fffafa',
      fontFamily: 'Times New Roman',
      fontSize: 20,
      leading: 1,
      lineJoin: 'round',
      stroke: '#654497',
      strokeThickness: 20,
      whiteSpace: 'normal',
      wordWrap: true,
      wordWrapWidth: 1,
    })
    const poemText = new PIXI.Text(s, style)
    const offset = 100 * this.texts.length
    poemText.x = window.innerWidth - 100 - offset
    poemText.y += offset
    return poemText
  }

  get() {
    return this.container
  }

  text(ss: string[]) {
    ss.forEach((s, i) => {
      if (i < this.texts.length) {
        const t = this.texts[i]
        t.text = s
        t.visible = true
        return
      }
      const nText = this.newText(s)
      this.texts.push(nText)
      this.container.addChild(nText)
    })
  }

  hide() {
    this.texts.forEach((el) => (el.visible = false))
  }
}
