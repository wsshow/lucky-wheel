import * as PIXI from 'pixi.js'
import './App.css'
import { useEffect, useRef, useState } from 'react'
import { Game } from './game'
import {
  Avatar,
  Button,
  Drawer,
  Input,
  List,
  Modal,
  Space,
  Tag,
  message,
} from 'antd'
import { NewText } from './text'
import ParamsTable from './components/table'
import { IData, IParam, ITrans, storeData } from './store'
import ParamsList from './components/list'
import classes from './App.module.css'
import service from './utils/req'
import CryptoJS from 'crypto-js'

interface IProfile {
  name: string
  time: string
  count: number
}

const reqGetProfiles = () => {
  return service.post('/auth/profiles')
}

const reqSyncProfiles = (name: string) => {
  return service.post('/auth/syncProfile', { name: name })
}

const reqAddProfile = (transData: ITrans) => {
  return service.post('/auth/addProfile', transData)
}

const reqUpdateProfile = (transData: ITrans) => {
  return service.post('/auth/updateProfile', transData)
}

function App() {
  const [open, setOpen] = useState(false)
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [isAddProfile, setIsAddProfile] = useState(false)
  const [isRefresh, setIsRefresh] = useState(false)
  const [profileName, setProfileName] = useState('')
  const [transData, setTransData] = useState<ITrans>()
  const [messageApi, contextHolder] = message.useMessage()
  const [profileData, setProfileData] = useState<IProfile[]>([])
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
    storeData
      .getItem<IData[]>('LUCKY_WHEEL')
      .then((data) => {
        storeData.getItem<IParam>('LUCKY_PARAM').then((param) => {
          reqGetProfiles()
            .then((successResponse) => {
              if (successResponse.data.code === 0) {
                if (!successResponse.data.data) {
                  return
                }
                setProfileData(successResponse.data.data)
                setTimeout(() => {
                  const elList = document.getElementById('list')!
                  elList.scrollTop = elList.scrollHeight
                }, 10)
              } else {
                messageApi.error(successResponse.data.desc)
              }
            })
            .catch((failResponse) => {
              messageApi.error(failResponse)
            })

          if (data && param && data.length > 0) {
            setIsAddProfile(true)
            setIsModelOpen(!isModelOpen)
            const _transData: ITrans = {
              data: data,
              param: {
                duration: param.duration,
                vFunc: param.vFunc,
              },
            }
            setTransData(_transData)
            return
          }
          setTransData(undefined)
          setIsAddProfile(false)
          setIsModelOpen(!isModelOpen)
        })
      })
      .catch(() => messageApi.error('数据同步失败'))
  }

  const addProfile = (
    <Space>
      <Input
        placeholder="请输入配置名称"
        style={{ width: 360 }}
        onBlur={(v) => {
          setProfileName(v.target.value)
        }}
      />
      <Button
        type="primary"
        style={{ width: 100 }}
        onClick={() => {
          if (transData) {
            const trans: ITrans = {
              data: transData.data,
              param: transData.param,
              name: profileName,
            }
            reqAddProfile(trans)
              .then((successResponse) => {
                if (successResponse.data.code === 0) {
                  setProfileData([
                    ...profileData,
                    {
                      name: profileName,
                      count: 1,
                      time: new Date().toLocaleString(),
                    },
                  ])
                  setTimeout(() => {
                    const elList = document.getElementById('list')!
                    elList.scrollTop = elList.scrollHeight
                  }, 10)
                  messageApi.success('配置添加成功')
                } else {
                  messageApi.error(successResponse.data.desc)
                }
              })
              .catch((failResponse) => {
                messageApi.error(failResponse)
              })
          } else {
            messageApi.error('无法添加空的配置信息')
          }
        }}
      >
        添加配置
      </Button>
    </Space>
  )

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
        <ParamsTable isReFresh={isRefresh} />
        <ParamsList />
        <Modal
          title="选择配置"
          open={isModelOpen}
          footer={isAddProfile ? addProfile : null}
          onCancel={() => setIsModelOpen(false)}
        >
          <List
            id="list"
            className={classes.List}
            itemLayout="horizontal"
            dataSource={profileData}
            renderItem={(item, index) => (
              <List.Item
                className={classes.ListItem}
                extra={
                  <div>
                    <Tag color="geekblue">同步次数: {item.count}</Tag>
                    <Tag color="cyan">同步时间: {item.time}</Tag>
                  </div>
                }
                onClick={() => {
                  if (transData) {
                    const trans = { data: transData.data, name: item.name }
                    reqUpdateProfile(trans)
                      .then((successResponse) => {
                        if (successResponse.data.code === 0) {
                          messageApi.success('数据更新成功')
                          setIsModelOpen(false)
                        } else {
                          messageApi.error(successResponse.data.desc)
                        }
                      })
                      .catch((failResponse) => {
                        messageApi.error(failResponse)
                      })
                  } else {
                    reqSyncProfiles(item.name)
                      .then((successResponse) => {
                        if (successResponse.data.code === 0) {
                          const d = successResponse.data.data
                          storeData
                            .setItem('LUCKY_WHEEL', d.data)
                            .catch((e) => {
                              console.log(e)
                            })
                          storeData
                            .setItem('LUCKY_PARAM', {
                              duration: d.duration,
                              vFunc: d.vFunc,
                            })
                            .catch((e) => {
                              console.log(e)
                            })
                          messageApi.success('数据同步成功')
                          setTimeout(() => {
                            setIsRefresh(!isRefresh)
                          }, 10)
                          setIsModelOpen(false)
                        } else {
                          messageApi.error(successResponse.data.desc)
                        }
                      })
                      .catch((failResponse) => {
                        messageApi.error(failResponse)
                      })
                  }
                }}
              >
                <Space style={{ marginLeft: '12px' }}>
                  <Avatar
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#ff8200',
                      verticalAlign: 'middle',
                    }}
                    size="small"
                  >
                    {index + 1}
                  </Avatar>
                  <Button
                    type="link"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#0078b6',
                    }}
                  >
                    {item.name!.length > 22
                      ? item.name!.substring(0, 22) + '...'
                      : item.name}
                  </Button>
                </Space>
              </List.Item>
            )}
          />
        </Modal>
      </Drawer>
    </>
  )
}

export default App
