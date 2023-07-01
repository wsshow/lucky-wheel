import * as PIXI from 'pixi.js'
import { IPoint, degreesToRads } from '../../utils'
import { getRandomColor } from '../../colors'

export interface ICandidate {
  name: string
  color: PIXI.ColorSource
  avatar?: PIXI.Sprite
  container: PIXI.Container<PIXI.DisplayObject>
}

export class CandidateController {
  private firstAgnle = 0
  private totalAngle = 0
  private radius = 0
  private center: IPoint = { x: 0, y: 0 }

  constructor(radius: number, center: IPoint) {
    this.radius = radius
    this.center = center
  }

  private get_rotation_radian = (angle: number) => {
    this.totalAngle += angle
    if (this.firstAgnle === 0) {
      this.firstAgnle = angle
      return 0
    }
    let deg = 0
    let diffAngle = this.firstAgnle - angle
    deg =
      diffAngle > 0
        ? diffAngle / 2 + this.totalAngle - this.firstAgnle
        : -diffAngle / 2 + this.totalAngle - angle

    return degreesToRads(deg)
  }

  public get = (
    angle: number,
    name: string,
    color?: PIXI.ColorSource
  ): ICandidate => {
    const startAngle = degreesToRads(-angle / 2)
    const endAngle = degreesToRads(angle / 2)
    const x1 = Math.cos(startAngle) * this.radius
    const y1 = Math.sin(endAngle) * this.radius

    if (!color) {
      const colorObj = getRandomColor()
      name = colorObj.name
      color = colorObj.hex
    }

    const textStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 22,
      fill: '#ffffff',
    })
    const text = new PIXI.Text(name, textStyle)
    text.x = this.center.x + x1 - this.radius / 3
    text.y = this.center.y + y1 - this.radius / 3
    text.rotation = startAngle + endAngle

    const grap_sector = new PIXI.Graphics()
    grap_sector.lineStyle(5, 0xffffff)
    grap_sector.beginFill(color, 0.9)
    grap_sector.moveTo(0, 0)
    grap_sector.arc(0, 0, this.radius, startAngle, endAngle)
    grap_sector.moveTo(0, 0).lineTo(x1, y1)
    grap_sector.x = this.center.x
    grap_sector.y = this.center.y
    grap_sector.endFill()
    grap_sector.eventMode = 'static'
    grap_sector.cursor = 'pointer'

    const stage_sector = new PIXI.Container()
    stage_sector.addChild(grap_sector, text)
    stage_sector.position.set(this.center.x, this.center.y)
    stage_sector.pivot.set(this.center.x, this.center.y)
    stage_sector.rotation = this.get_rotation_radian(angle)

    const candidate = { name: name, color: color, container: stage_sector }

    // grap_sector.on('pointerover', () => {
    //   grap_sector.scale.set(1.2)
    // })
    // grap_sector.on('pointerleave', () => {
    //   grap_sector.scale.set(1)
    // })
    // grap_sector.on('pointerdown', () => {
    //   console.log(candidate)
    // })

    return candidate
  }
}
