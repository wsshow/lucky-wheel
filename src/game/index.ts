import * as PIXI from 'pixi.js'
import { CandidateController, ICandidate } from './candidate'
import { getRandom } from '../utils'
import { DisplayController } from './display'
import { Pointer } from './pointer'
import { Wheel } from './wheel'
import { gsap } from 'gsap'
import { IData, IParam, storeData } from '../store'
import { ResultController } from './result'
import { getRandomPoetry } from '../poetry'

export class Game {
  private radius = 300
  private duration = getRandom(10, 20)
  private vFunc = 'circ.out'
  private candidates: ICandidate[] = []
  private stage_wheel: PIXI.Container<PIXI.DisplayObject>
  constructor(app: PIXI.Application<PIXI.ICanvas>) {
    this.stage_wheel = this.game(app)
  }
  private game = (app: PIXI.Application<PIXI.ICanvas>) => {
    let radius = this.radius
    const wheel = new Wheel(app, radius)
    const stage_wheel = wheel.get()

    const displayController = new DisplayController(
      {
        x: stage_wheel.x - radius / 2,
        y: 60,
      },
      '点击此处开始'
    )
    const display = displayController.get()

    const pointer = new Pointer(
      stage_wheel.x - radius + 50,
      stage_wheel.y - radius + 50,
      'img/pointer.svg'
    ).get()

    storeData
      .getItem<IData[]>('LUCKY_WHEEL')
      .then((data) => {
        storeData.getItem<IParam>('LUCKY_PARAM').then((param) => {
          if (data && data.length > 0 && param) {
            this.update(data, param)
          } else {
            const candidate = new CandidateController(
              radius,
              stage_wheel.position
            )
            for (let index = 0; index < 30; index++) {
              let s = candidate.get(12)
              stage_wheel.addChild(s.container)
              this.candidates.push(s)
            }
          }
        })
      })
      .catch(() => {
        console.error('LUCKY_WHEEL 数据加载失败')
      })

    const resultController = new ResultController()
    const result = resultController.get()

    app.stage.addChild(display, pointer, result)

    displayController.onPress(() => {
      gsap.to(stage_wheel, {
        rotation: `+=${getRandom(360, 720)}`,
        duration: this.duration,
        repeat: 0,
        ease: this.vFunc,
        onStart: () => {
          resultController.hide()
        },
        onUpdate: () => {
          this.candidates.forEach((el) => {
            if (el.container.getBounds().intersects(pointer.getBounds())) {
              displayController.setName(el.name)
              displayController.setColor(el.color)
            }
          })
        },
        onComplete: () => {
          if (display.text?.includes('再转一次')) {
            return
          }
          resultController.text(getRandomPoetry())
          display.text = `恭喜: ${display.text} 🎉🎉🎉`
        },
      })
    })

    return stage_wheel
  }

  update(datas: IData[], param: IParam) {
    this.candidates.forEach((el) => {
      this.stage_wheel.removeChild(el.container)
    })
    const candidate = new CandidateController(
      this.radius,
      this.stage_wheel.position
    )
    this.candidates.length = 0
    let userPercent = 0
    datas.forEach((el) => {
      let percent = 0
      if (typeof el.percent === 'string') {
        percent = parseInt(el.percent)
      } else {
        percent = el.percent
      }
      const s = candidate.get(percent * 3.6, el.name)
      this.stage_wheel.addChild(s.container)
      this.candidates.push(s)
      userPercent += percent
    })
    if (userPercent < 100) {
      const s = candidate.get((100 - userPercent) * 3.6, '再转一次')
      this.stage_wheel.addChild(s.container)
      this.candidates.push(s)
    }
    this.duration = getRandom(param.duration.min, param.duration.max)
    this.vFunc = param.vFunc
  }
}
