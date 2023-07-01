import * as PIXI from 'pixi.js'
import { NewText } from '../text'
import { CandidateController, ICandidate } from './candidate'
import { getRandom, hitTestRectangle } from '../utils'
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
  grap_ring.beginFill(0x1099bb, 0.8)
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

    const grap_rect = new PIXI.Graphics()
    let rect = candidates[0].container.getBounds()
    console.log(candidates[0].name);

    grap_rect.beginFill(0x000000, 0.6)
    grap_rect.drawRect(rect.x, rect.y, rect.width, rect.height)
    stage_wheel.addChild(grap_rect)

    const grap_rect1 = new PIXI.Graphics()
    let rect1 = candidates[1].container.getBounds()
    console.log(candidates[1].name);
    
    grap_rect1.beginFill(0x0000ff, 0.6)
    grap_rect1.drawRect(rect1.x, rect1.y, rect1.width, rect1.height)
    stage_wheel.addChild(grap_rect1)

    const grap_rect2 = new PIXI.Graphics()
    let rect2 = candidates[2].container.getBounds()
    console.log(candidates[2].name);

    grap_rect2.beginFill(0x00ffff, 0.6)
    grap_rect2.drawRect(rect2.x, rect2.y, rect2.width, rect2.height)
    stage_wheel.addChild(grap_rect2)

    const grap_rect3 = new PIXI.Graphics()
    let rect3 = candidates[3].container.getBounds()
    console.log(candidates[3].name);

    grap_rect3.beginFill(0xff00ff, 0.6)
    grap_rect3.drawRect(rect3.x, rect3.y, rect3.width, rect3.height)
    stage_wheel.addChild(grap_rect3)

    const grap_rect_p = new PIXI.Graphics()
    let rect_p = sprite_pointer.getBounds()
    grap_rect_p.beginFill(0xff0000, 0.8)
    grap_rect_p.drawRect(rect_p.x, rect_p.y, rect_p.width, rect_p.height)
    
    app.stage.addChild(grap_ring, stage_wheel, stage_display, sprite_pointer)
    app.stage.addChild(grap_rect_p)

  let max = getRandom(6)

  display.onPress(() => {
    max <<= 1
  })

  app.ticker.add((delta) => {
    if (stage_wheel.rotation > max) {
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
