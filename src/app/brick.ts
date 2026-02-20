import { Container, TextureSource } from 'pixi.js';
import { generatePlatformItemsSprites } from './platform-items';

export class Brick {
  public container: Container;
  public newY: number;

  constructor(x: number, y: number, source: TextureSource) {
    this.container = new Container();
    const sprites = generatePlatformItemsSprites(source);
    const sprite = sprites[Math.floor(Math.random() * sprites.length)];
    this.container.x = x;
    this.container.y = y;
    this.newY = y;
    this.container.addChild(sprite);
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
