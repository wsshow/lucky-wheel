import { useEffect, useState } from 'react'
import './index.css'
import service from '../../utils/req'
import { message } from 'antd'
import CryptoJS from 'crypto-js'

const moveNext = (to: number) => {
  document.getElementById(`otp-input${to}`)?.focus()
}

const reqCheckAuthCode = (authcode: string) => {
  return service.post('/auth/check', { authcode: authcode })
}

const AuthCheck: React.FC<{ callbackFn: () => void }> = (props) => {
  const [v1, setV1] = useState('')
  const [v2, setV2] = useState('')
  const [v3, setV3] = useState('')
  const [v4, setV4] = useState('')
  const [messageApi, contextHolder] = message.useMessage()

  const clearAll = () => {
    setV1('')
    setV2('')
    setV3('')
    setV4('')
    moveNext(1)
  }

  useEffect(() => {
    clearAll()
  }, [])

  return (
    <div className="otp-Form">
      {contextHolder}
      <span className="mainHeading">口令</span>
      <p className="otpSubheading">少侠留步，请对暗号</p>
      <div className="inputContainer">
        <input
          required={true}
          maxLength={1}
          type="text"
          className="otp-input"
          id="otp-input1"
          value={v1}
          onInput={(v) => {
            setV1(v.currentTarget.value)
            moveNext(2)
          }}
        />
        <input
          required={true}
          maxLength={1}
          type="text"
          className="otp-input"
          id="otp-input2"
          value={v2}
          onInput={(v) => {
            setV2(v.currentTarget.value)
            moveNext(3)
          }}
        />
        <input
          required={true}
          maxLength={1}
          type="text"
          className="otp-input"
          id="otp-input3"
          value={v3}
          onInput={(v) => {
            setV3(v.currentTarget.value)
            moveNext(4)
          }}
        />
        <input
          required={true}
          maxLength={1}
          type="text"
          className="otp-input"
          id="otp-input4"
          value={v4}
          onInput={(v) => {
            setV4(v.currentTarget.value)
          }}
        />
      </div>
      <button
        className="verifyButton"
        id="btn"
        onClick={() => {
          let authcode = v1 + v2 + v3 + v4
          authcode = CryptoJS.MD5(authcode).toString()
          reqCheckAuthCode(authcode)
            .then((res) => {
              if (res.data.code === 0) {
                localStorage.setItem('lw_authcode', authcode)
                messageApi.success(res.data.data)
                props.callbackFn()
              } else {
                clearAll()
                messageApi.error(res.data.desc)
              }
            })
            .catch((e) => console.log(e))
        }}
      >
        验证
      </button>
    </div>
  )
}

export default AuthCheck
