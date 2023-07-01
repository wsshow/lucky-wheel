import * as PIXI from "pixi.js";

export class Wheel {
  private stage_wheel: PIXI.Container<PIXI.DisplayObject>;
  constructor(app: PIXI.Application<PIXI.ICanvas>, radius: number) {
    const stage_wheel = new PIXI.Container();

    stage_wheel.x = app.screen.width / 2;
    stage_wheel.y = app.screen.height / 2;

    stage_wheel.pivot.x = stage_wheel.x;
    stage_wheel.pivot.y = stage_wheel.y;

    const grap_ring = new PIXI.Graphics();
    grap_ring.beginFill(0x1099bb, 0.8);
    grap_ring.drawCircle(0, 0, radius + 15);
    grap_ring.endFill();
    grap_ring.position.set(stage_wheel.x, stage_wheel.y);

    const grap_wheel = new PIXI.Graphics();
    grap_wheel.beginFill(0x39ad8c, 1);
    grap_wheel.drawCircle(0, 0, radius);
    grap_wheel.endFill();
    grap_wheel.position.set(stage_wheel.x, stage_wheel.y);
    grap_wheel.eventMode = "static";
    grap_wheel.cursor = "pointer";
    grap_wheel.onclick = () => {
      console.log(stage_wheel.rotation);
    };
    
    this.stage_wheel = stage_wheel;
    stage_wheel.addChild(grap_wheel);
    app.stage.addChild(grap_ring, stage_wheel);
  }

  get() {
    return this.stage_wheel;
  }
}
