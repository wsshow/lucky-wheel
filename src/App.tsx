import * as PIXI from 'pixi.js'
import './App.css'
import { useEffect, useRef, useState } from 'react'
import { Game } from './game'
import { Button, Drawer, Space, message } from 'antd'
import { NewText } from './text'
import ParamsTable from './components/table'
import { IData, IParam, storeData } from './store'
import ParamsList from './components/list'

function App() {
  const [open, setOpen] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const gameRef = useRef<Game>()

  useEffect(() => {
    let app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xffffff,
      antialias: true,
      forceCanvas: false,
      resizeTo: window,
      autoDensity: true,
    })
    const pixiCanvas = document.querySelector('#pixiCanvas')
    pixiCanvas?.appendChild(app.view as unknown as Node)

    gameRef.current = new Game(app)

    const logo = NewText('lucky wheel')
    logo.cursor = 'pointer'
    logo.on('pointerdown', () => {
      setOpen(true)
    })
    app.stage.addChild(logo)

    return () => {
      pixiCanvas?.removeChild(app.view as unknown as Node)
      app.destroy()
    }
  }, [])

  const onClose = () => {
    setOpen(false)
  }

  const onSave = () => {
    storeData
      .getItem<IData[]>('LUCKY_WHEEL')
      .then((data) => {
        storeData.getItem<IParam>('LUCKY_PARAM').then((param) => {
          data && param && gameRef.current?.update(data, param)
        })
      })
      .catch(() => {
        messageApi.error('数据加载失败')
      })
  }

  const onSync = () => {
    messageApi.warning('同步配置到服务器功能尚未启用')
  }

  return (
    <>
      {contextHolder}
      <div id="pixiCanvas"></div>
      <Drawer
        title="设置"
        width={600}
        placement="right"
        onClose={onClose}
        open={open}
        closable={false}
        footer={
          <Space wrap>
            <Button type="primary" onClick={onSave}>
              更新轮盘
            </Button>
            <Button
              style={{ backgroundColor: '#16a383', color: '#fff' }}
              onClick={onSync}
            >
              同步配置
            </Button>
          </Space>
        }
      >
        <ParamsTable />
        <ParamsList />
      </Drawer>
    </>
  )
}

export default App
