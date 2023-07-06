import { SwapRightOutlined } from '@ant-design/icons'
import { Form, InputNumber, Select, SelectProps, Space, message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { IParam, storeData } from '../../store'
import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { Timer } from '../../utils/timer'
import { IPoint, getDistance } from '../../utils'

const options: SelectProps['options'] = []
const vFuncs = [
  'none',
  'power1',
  'power2',
  'power3',
  'power4',
  'back',
  'elastic',
  'bounce',
  'rough',
  'slow',
  'steps',
  'circ',
  'expo',
  'sine',
]
const vType = ['in', 'out', 'inOut']
vFuncs.forEach((el) => {
  if (el === 'steps') {
    const step = el + '(12)'
    options.push({
      value: step,
      label: step,
    })
    return
  }
  if (el === 'none' || el === 'rough' || el === 'slow') {
    options.push({
      value: el,
      label: el,
    })
    return
  }
  vType.forEach((elT) => {
    const s = `${el}.${elT}`
    options.push({
      value: s,
      label: s,
    })
  })
})

const ParamsList: React.FC<{ isReFresh: boolean }> = (props) => {
  const [messageApi, contextHolder] = message.useMessage()
  const [rangeMin, setRangeMin] = useState(10)
  const [rangeMax, setRangeMax] = useState(20)
  const [vFunc, setVFunc] = useState('circ.out')
  const grapObjRef = useRef<PIXI.Graphics>()
  const grapLineRef = useRef<PIXI.Graphics>()
  const appRef = useRef<PIXI.Application<PIXI.ICanvas>>()

  const durationMin = (min: number) => {
    if (rangeMax > 0 && min > rangeMax) {
      messageApi.error('随机时间的区间下限不能高于区间上限')
      return
    }
    setRangeMin(min)
  }

  const durationMax = (max: number) => {
    if (max < rangeMin) {
      messageApi.error('随机时间的区间下限不能高于区间上限')
      return
    }
    setRangeMax(max)
  }

  useEffect(() => {
    storeData
      .getItem<IParam>('LUCKY_PARAM')
      .then((el) => {
        if (el) {
          setRangeMin(el.duration.min)
          setRangeMax(el.duration.max)
          setVFunc(el.vFunc)
        } else {
          storeData.setItem<IParam>('LUCKY_PARAM', {
            duration: {
              min: 10,
              max: 20,
            },
            vFunc: 'circ.out',
          })
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }, [props.isReFresh])

  useEffect(() => {
    const vFuncCanvas = document.querySelector('#vFuncCanvas')
    const w = vFuncCanvas!.clientWidth
    const h = vFuncCanvas!.clientHeight

    let app = new PIXI.Application({
      width: w,
      height: h,
      backgroundColor: '#ffffff',
      antialias: true,
      forceCanvas: false,
      autoDensity: true,
    })
    vFuncCanvas?.appendChild(app.view as unknown as Node)

    const grap_axis = new PIXI.Graphics()
    grap_axis.lineStyle(2, '#000000', 1)
    grap_axis.moveTo(0, 300).lineTo(500, 300)
    grap_axis.moveTo(490, 297).lineTo(500, 300)
    grap_axis.moveTo(490, 303).lineTo(500, 300)
    grap_axis.moveTo(0, 300).lineTo(0, 0)
    grap_axis.moveTo(-3, 10).lineTo(0, 0)
    grap_axis.moveTo(3, 10).lineTo(0, 0)
    grap_axis.position.set(10, 20)

    const grap_obj = new PIXI.Graphics()
    grapObjRef.current = grap_obj
    grap_obj.beginFill('#1677ff', 1)
    grap_obj.drawCircle(0, 0, 10)
    grap_obj.endFill()

    const tText = new PIXI.Text('时间')
    tText.style.fontSize = 12
    tText.position.set(500, 300)

    const vText = new PIXI.Text('速度')
    vText.style.fontSize = 12
    vText.position.set(16, 20)

    app.stage.addChild(grap_axis, grap_obj, tText, vText)

    appRef.current = app

    return () => {
      vFuncCanvas?.removeChild(app.view as unknown as Node)
      app.destroy()
    }
  }, [])

  useEffect(() => {
    const grap_obj = grapObjRef.current!
    if (grapLineRef.current) {
      appRef.current?.stage.removeChild(grapLineRef.current)
    }
    const grap_line = new PIXI.Graphics()
    grapLineRef.current = grap_line
    grap_line.lineStyle(3, '#108ee9', 1)
    grap_line.position.set(30, 0)
    appRef.current?.stage.addChild(grap_line)

    let prevPos: IPoint = { x: 20, y: 310 }
    let calcCount = 1
    let prevVTPos: IPoint = { x: 0, y: 0 }
    const timer = new Timer(() => {
      const curPos = { x: grap_obj.position.x, y: grap_obj.position.y }
      const dis = getDistance(prevPos, curPos)
      const posY = 300 - dis
      if (calcCount > 1) {
        grap_line.moveTo(prevVTPos.x, prevVTPos.y).lineTo(calcCount * 10, posY)
      }
      prevPos = curPos
      prevVTPos = { x: calcCount * 10, y: posY }
      calcCount++
    }, 100)

    gsap.fromTo(
      grap_obj,
      { x: 20, y: 310 },
      {
        x: 500,
        y: 50,
        duration: 3,
        ease: vFunc,
        onStart: () => {
          timer.Start()
        },
        onComplete: () => {
          timer.Stop()
        },
      }
    )
  }, [vFunc])

  useEffect(() => {
    storeData.setItem('LUCKY_PARAM', {
      duration: { min: rangeMin, max: rangeMax },
      vFunc: vFunc,
    })
  }, [rangeMin, rangeMax, vFunc])

  return (
    <>
      {contextHolder}
      <Form
        name="basic"
        style={{ maxWidth: 600 }}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item label="随机时间范围 (秒)" name="duration">
          <Space>
            <InputNumber
              style={{ width: 100 }}
              min={0}
              max={100}
              value={rangeMin}
              onBlur={(v) => durationMin(parseInt(v.target.value))}
            />
            <SwapRightOutlined />
            <InputNumber
              style={{ width: 100 }}
              min={0}
              max={100}
              value={rangeMax}
              onBlur={(v) => durationMax(parseInt(v.target.value))}
            />
          </Space>
        </Form.Item>
        <Form.Item label="速度曲线" name="vFunction">
          <Space>
            <Select
              value={vFunc}
              style={{ width: 230 }}
              options={options}
              onChange={(v) => {
                setVFunc(v)
              }}
            />
            <a
              href="https://greensock.com/docs/v3/Eases"
              target="_Blank"
              rel="noreferrer"
            >
              速度函数详情
            </a>
          </Space>
        </Form.Item>
      </Form>
      <div id="vFuncCanvas" style={{ height: 330 }}></div>
    </>
  )
}

export default ParamsList
