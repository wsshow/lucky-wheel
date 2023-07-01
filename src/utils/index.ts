export interface IRectangle {
  x: number
  y: number
  width: number
  height: number
}

export interface IPoint {
  x: number
  y: number
}

export const getAngleBetweenPoints = (pt1: IPoint, pt2: IPoint) =>
  Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x)

export const degreesToRads = (deg: number) => (deg * Math.PI) / 180.0

export const getPoints = (r: number, center: IPoint, count: number) => {
  let points: IPoint[] = []
  let radians = degreesToRads(Math.round(360 / count))
  for (let i = 0; i < count; i++) {
    var x = center.x + r * Math.sin(radians * i),
      y = center.y + r * Math.cos(radians * i)
    points.push({ x: x, y: y })
  }
  return points
}

export const getRandom = (max:number)=>{
  return Math.floor(Math.random() * max)
}

export const hitTestRectangle = (r1: IRectangle, r2: IRectangle) => {
  let combinedHalfWidths, combinedHalfHeights, vx, vy

  let r1_centerX = r1.x + r1.width / 2
  let r1_centerY = r1.y + r1.height / 2
  let r2_centerX = r2.x + r2.width / 2
  let r2_centerY = r2.y + r2.height / 2

  let r1_halfWidth = r1.width / 2
  let r1_halfHeight = r1.height / 2
  let r2_halfWidth = r2.width / 2
  let r2_halfHeight = r2.height / 2

  vx = r1_centerX - r2_centerX
  vy = r1_centerY - r2_centerY

  combinedHalfWidths = r1_halfWidth + r2_halfWidth
  combinedHalfHeights = r1_halfHeight + r2_halfHeight

  if (Math.abs(vx) < combinedHalfWidths) {
    return Math.abs(vy) < combinedHalfHeights
  }

  return false
}
