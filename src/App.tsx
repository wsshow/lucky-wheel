import * as PIXI from "pixi.js";
import "./App.css";
import { useEffect, useState } from "react";
import { Game } from "./game";
import { Button, Drawer, Space } from "antd";
import { NewText } from "./text";
import ParamsTable from "./components/table";

function App() {
  const [open, setOpen] = useState(false);

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

    const game = new Game(app);

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
  return (
    <>
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
            <Button type="primary">保存</Button>
            <Button danger >取消</Button>
          </Space>
        }
      >
        <ParamsTable />
      </Drawer>
    </>
  );
}

export default App;
