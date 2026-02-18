import { Container, Graphics } from 'pixi.js';
import { buildGrid } from './helpers/build-grid';

export class Scene {
  private width: number;
  private height: number;
  private x: number;
  private y: number;
  public container: Container;

  constructor(x: number, y: number, width: number, height: number, color: string) {
    this.width = width;
    this.height = height;
    this.x = x - this.width / 2;
    this.y = y;

    this.container = new Container();
    const rect = new Graphics().rect(0, 0, width, height).fill({ color });
    this.container.x = this.x;
    this.container.y = this.y;

    const gridPixel = buildGrid(new Graphics(), width, height).stroke({
      color: 0xff0000,
      pixelLine: true,
      width: 1,
    });

    this.container.addChild(rect, gridPixel);
  }

  public updateY(): void {
    this.container.y -= 30;
  }
}
