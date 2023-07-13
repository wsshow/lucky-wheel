import * as PIXI from 'pixi.js'
export function NewText(s: string): PIXI.Text {
  const skewStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    dropShadow: true,
    dropShadowAlpha: 0.8,
    dropShadowAngle: 2.1,
    dropShadowBlur: 4,
    dropShadowColor: '0x111111',
    dropShadowDistance: 10,
    fill: ['#ffffff'],
    stroke: '#004620',
    fontSize: 30,
    fontWeight: 'lighter',
    lineJoin: 'round',
    strokeThickness: 12,
  })
  const skewText = new PIXI.Text(s, skewStyle)
  skewText.skew.set(0.2, -0.2)
  skewText.x = 3
  skewText.y = 36
  skewText.eventMode = 'static'
  return skewText
}
