import * as PIXI from 'pixi.js'
import { NewText } from '../text'
import { CandidateController, ICandidate } from './candidate'
import { hitTestRectangle } from '../utils'
import { FancyButton } from '@pixi/ui'
import { DisplayController } from './display'

export const game = (app: PIXI.Application<PIXI.ICanvas>) => {
  const textProgress = NewText('lucky wheel')
  app.stage.addChild(textProgress)

  const stage_wheel = new PIXI.Container()

  stage_wheel.x = app.screen.width / 2
  stage_wheel.y = app.screen.height / 2

  stage_wheel.pivot.x = stage_wheel.x
  stage_wheel.pivot.y = stage_wheel.y

  let radius = 300

  const display = new DisplayController({
    x: stage_wheel.x - radius / 2,
    y: 60,
  })
  const stage_display = display.get()

  const sprite_pointer = PIXI.Sprite.from('img/pointer.svg')
  sprite_pointer.x = stage_wheel.x - radius + 50
  sprite_pointer.y = stage_wheel.y - radius + 50

  const grap_ring = new PIXI.Graphics()
  grap_ring.beginFill(0xf3f4f7, 1)
  grap_ring.drawCircle(0, 0, radius + 10)
  grap_ring.endFill()
  grap_ring.position.set(stage_wheel.x, stage_wheel.y)

  const grap_wheel = new PIXI.Graphics()
  grap_wheel.beginFill(0x39ad8c, 1)
  grap_wheel.drawCircle(0, 0, radius)
  grap_wheel.endFill()
  grap_wheel.position.set(stage_wheel.x, stage_wheel.y)
  grap_wheel.eventMode = 'static'
  grap_wheel.cursor = 'pointer'
  grap_wheel.onclick = () => {
    console.log(stage_wheel.rotation)
  }

  stage_wheel.addChild(grap_wheel)

  const candidate = new CandidateController(radius, stage_wheel.position)
  const candidates: ICandidate[] = []
  for (let index = 0; index < 12; index++) {
    let s = candidate.get(30, index.toString())
    stage_wheel.addChild(s.container)
    candidates.push(s)
  }

  app.stage.addChild(grap_ring, stage_wheel, stage_display, sprite_pointer)

  app.ticker.add((delta) => {
    if (stage_wheel.rotation > 3) {
      return
    }
    candidates.forEach((el) => {
      if (
        hitTestRectangle(el.container.getBounds(), sprite_pointer.getBounds())
      ) {
        display.setName(el.name)
        display.setColor(el.color)
      }
    })
    stage_wheel.rotation += 0.01 * delta
  })
}
