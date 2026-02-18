import { Container, Graphics } from 'pixi.js';

export class Brick {
  public container: Container;
  public newY: number;

  constructor(x: number, y: number) {
    this.container = new Container();
    const brick = new Graphics()
      .roundRect(0, 0, 200, 40, 40)
      .fill({ color: '#c2b280' })
      .stroke({ width: 2, color: 0x00ff00 });
    this.container.x = x;
    this.container.y = y;
    this.newY = y;
    this.container.addChild(brick);
  }

  public setContainerX(value: number): void {
    this.container.x = value;
  }

  public setContainerY(value: number): void {
    this.container.y = value;
    this.newY = value;
  }

  public setNewY(value: number): void {
    if (this.newY !== this.container.y) {
      return;
    }
    this.newY = value;
  }
}
