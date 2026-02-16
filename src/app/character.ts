import { Container, Graphics } from 'pixi.js';

export class Character {
  public container: Container;

  constructor(x: number, y: number) {
    this.container = new Container();
    const rect = new Graphics().rect(0, 0, 40, 60).fill({ color: 'yellow' });
    this.container.x = x;
    this.container.y = y;
    this.container.addChild(rect);
  }

  public setContainerX(value: number): void {
    this.container.x = value;
  }

  public setContainerY(value: number): void {
    this.container.y = value;
  }
}
