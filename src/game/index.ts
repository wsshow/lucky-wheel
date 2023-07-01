import * as PIXI from "pixi.js";
import { NewText } from "../text";
import { CandidateController, ICandidate } from "./candidate";
import { getRandom, hitTestRectangle } from "../utils";
import { DisplayController } from "./display";
import { Pointer } from "./pointer";
import { Wheel } from "./wheel";
import { gsap } from "gsap";

export const game = (app: PIXI.Application<PIXI.ICanvas>) => {
  const textProgress = NewText("lucky wheel");
  app.stage.addChild(textProgress);

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
  const candidates: ICandidate[] = [];
  for (let index = 0; index < 30; index++) {
    let s = candidate.get(12, index.toString());
    stage_wheel.addChild(s.container);
    candidates.push(s);
  }

  app.stage.addChild(display, pointer);

  displayController.onPress(() => {
    gsap.to(stage_wheel, {
      rotation: "+=360",
      duration: getRandom(20, 30),
      repeat: 0,
      ease: "circ.out",
      onUpdate:()=>{
        candidates.forEach((el) => {
          if (hitTestRectangle(el.container.getBounds(), pointer.getBounds())) {
            displayController.setName(el.name);
            displayController.setColor(el.color);
          }
        });
      }
    });
  });
};
