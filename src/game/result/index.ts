import * as PIXI from "pixi.js";
import { IPoetry } from "../../poetry";

export interface IResult {
  container: PIXI.Container<PIXI.DisplayObject>;
}

export class ResultController {
  private texts: PIXI.Text[] = [];
  private container: PIXI.Container<PIXI.DisplayObject>;

  constructor() {
    this.container = new PIXI.Container();
  }

  private newText(
    s: string,
    style?: PIXI.TextStyle,
    bTitle: boolean = false
  ): PIXI.Text {
    const poemText = new PIXI.Text(s, style);
    const offset = 100 * this.texts.length;
    poemText.x = window.innerWidth - 100 - offset;
    poemText.y += offset;
    if (bTitle) {
      poemText.y += offset;
    }
    return poemText;
  }

  get() {
    return this.container;
  }

  text(poe: IPoetry) {
    const style = new PIXI.TextStyle({
      align: "center",
      breakWords: true,
      dropShadowAlpha: 0.8,
      dropShadowBlur: 4,
      dropShadowColor: "#2a56bb",
      fill: "#fffafa",
      fontFamily: "Times New Roman",
      fontSize: 20,
      leading: 1,
      lineJoin: "round",
      stroke: "#654497",
      strokeThickness: 20,
      whiteSpace: "normal",
      wordWrap: true,
      wordWrapWidth: 1,
    });
    poe.content.forEach((s, i) => {
      if (i < this.texts.length) {
        const t = this.texts[i];
        t.text = s;
        t.visible = true;
        return;
      }
      const nText = this.newText(s, style);
      this.texts.push(nText);
      this.container.addChild(nText);
    });
    if (2 < this.texts.length) {
      const t = this.texts[2];
      t.text = `${poe.type}৹${poe.author}`;
      t.visible = true;
      return;
    }
    const nText = this.newText(`${poe.type}•${poe.author}`, style, true);
    this.texts.push(nText);
    this.container.addChild(nText);
  }

  hide() {
    this.texts.forEach((el) => (el.visible = false));
  }
}
