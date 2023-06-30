import * as PIXI from 'pixi.js'
import './App.css'
import { useEffect } from 'react'
import { game } from './game'

function App() {
  useEffect(() => {
    let app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x1099bb,
      antialias: true,
      forceCanvas: false,
      resizeTo: window,
      autoDensity: true,
    })
    const pixiCanvas = document.querySelector('#pixiCanvas')
    pixiCanvas?.appendChild(app.view as unknown as Node)

    game(app)

    return () => {
      pixiCanvas?.removeChild(app.view as unknown as Node)
      app.destroy()
    }
  }, [])
  return <div className="App" id="pixiCanvas"></div>
}

export default App
