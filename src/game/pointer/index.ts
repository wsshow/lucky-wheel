import * as PIXI from "pixi.js";

export class Pointer {
  private sprite_pointer: PIXI.Sprite;
  constructor(x: number, y: number, source: string) {
    this.sprite_pointer = PIXI.Sprite.from(source);
    this.sprite_pointer.position.set(x, y);
    this.sprite_pointer.scale.set(0.5);
  }

  get() {
    return this.sprite_pointer;
  }
}
