import { SwapRightOutlined } from '@ant-design/icons'
import { Form, InputNumber, Select, SelectProps, Space, message } from 'antd'
import { useEffect, useState } from 'react'
import { storeData } from '../../game/store'

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
  'circ.out',
  'expo',
  'sine',
]
const vType = ['in', 'out', 'inOut']
vFuncs.forEach((el) => {
  if (el === 'none') {
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

const ParamsList: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [rangeMin, setRangeMin] = useState(0)
  const [rangeMax, setRangeMax] = useState(0)
  const [vFunc, setVFunc] = useState('circ.out')
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
              defaultValue={10}
              onBlur={(v) => durationMin(parseInt(v.target.value))}
            />
            <SwapRightOutlined />
            <InputNumber
              style={{ width: 100 }}
              min={0}
              max={100}
              defaultValue={20}
              onBlur={(v) => durationMax(parseInt(v.target.value))}
            />
          </Space>
        </Form.Item>
        <Form.Item label="速度曲线" name="vFunction">
          <Space>
            <Select
              defaultValue={vFunc}
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
    </>
  )
}

export default ParamsList
