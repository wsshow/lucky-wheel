import * as PIXI from "pixi.js";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import { Game } from "./game";
import { Button, Drawer, Space, message } from "antd";
import { NewText } from "./text";
import ParamsTable from "./components/table";
import { IData, storeData } from "./game/store";

function App() {
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const gameRef = useRef<Game>();

  useEffect(() => {
    let app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xffffff,
      antialias: true,
      forceCanvas: false,
      resizeTo: window,
      autoDensity: true,
    });
    const pixiCanvas = document.querySelector("#pixiCanvas");
    pixiCanvas?.appendChild(app.view as unknown as Node);

    gameRef.current = new Game(app);

    const logo = NewText("lucky wheel");
    logo.cursor = "pointer";
    logo.on("pointerdown", () => {
      setOpen(true);
    });
    app.stage.addChild(logo);

    return () => {
      pixiCanvas?.removeChild(app.view as unknown as Node);
      app.destroy();
    };
  }, []);

  const onClose = () => {
    setOpen(false);
  };

  const onSave = () => {
    storeData
      .getItem<IData[]>("LUCKY_WHEEL")
      .then((el) => {
        el && gameRef.current?.update(el);
      })
      .catch(() => {
        messageApi.error("数据加载失败");
      });
  };

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
              保存
            </Button>
            <Button danger onClick={onClose}>
              取消
            </Button>
          </Space>
        }
      >
        <ParamsTable />
      </Drawer>
    </>
  );
}

export default App;
