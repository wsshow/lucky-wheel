import * as PIXI from "pixi.js";
import { CandidateController, ICandidate } from "./candidate";
import { getRandom } from "../utils";
import { DisplayController } from "./display";
import { Pointer } from "./pointer";
import { Wheel } from "./wheel";
import { gsap } from "gsap";

export class Game {
  private candidates: ICandidate[] = [];
  private stage_wheel: PIXI.Container<PIXI.DisplayObject>;
  constructor(app: PIXI.Application<PIXI.ICanvas>) {
    this.stage_wheel = this.game(app);
  }
  private game = (app: PIXI.Application<PIXI.ICanvas>) => {
    let radius = 300;
    const wheel = new Wheel(app, radius);
    const stage_wheel = wheel.get();

    const displayController = new DisplayController(
      {
        x: stage_wheel.x - radius / 2,
        y: 60,
      },
      "点击此处开始"
    );
    const display = displayController.get();

    const pointer = new Pointer(
      stage_wheel.x - radius + 50,
      stage_wheel.y - radius + 50,
      "img/pointer.svg"
    ).get();

    const candidate = new CandidateController(radius, stage_wheel.position);

    for (let index = 0; index < 30; index++) {
      let s = candidate.get(12, index.toString());
      stage_wheel.addChild(s.container);
      this.candidates.push(s);
    }

    app.stage.addChild(display, pointer);

    displayController.onPress(() => {
      gsap.to(stage_wheel, {
        rotation: "+=360",
        duration: getRandom(1, 2), //getRandom(10,20),
        repeat: 0,
        ease: "circ.out",
        onUpdate: () => {
          this.candidates.forEach((el) => {
            if (el.container.getBounds().intersects(pointer.getBounds())) {
              displayController.setName(el.name);
              displayController.setColor(el.color);
            }
          });
        },
        onComplete: () => {
          display.text = `恭喜: ${display.text} 🎉🎉🎉`;
        },
      });
    });

    return stage_wheel;
  };

  update(candidates: ICandidate[]) {
    this.candidates.forEach((el) => {
      this.stage_wheel.removeChild(el.container);
    });
    candidates.forEach((el) => {
      this.stage_wheel.addChild(el.container);
    });
  }
}
