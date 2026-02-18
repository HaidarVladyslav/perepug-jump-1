import { Container, Graphics, Sprite, Texture, TextureSource } from 'pixi.js';

type CurrentSpriteDirection = 'left' | 'right';

export class Character {
  public container: Container;
  private rightSprite: Sprite;
  private leftSprite: Sprite;
  private currentSpriteDirection: CurrentSpriteDirection = 'left';

  constructor(x: number, y: number, leftSource: TextureSource, rightSource: TextureSource) {
    this.container = new Container();
    const rect = new Graphics().rect(0, 0, 40, 60).fill({ color: 'yellow' });

    this.rightSprite = new Sprite({
      texture: new Texture({
        source: rightSource,
      }),
    });
    this.leftSprite = new Sprite({
      texture: new Texture({
        source: leftSource,
      }),
    });

    this.container.x = x;
    this.container.y = y;
    this.container.addChild(this.leftSprite);
  }

  public setContainerX(value: number): void {
    this.container.x = value;
  }

  public setContainerY(value: number): void {
    this.container.y = value;
  }

  public setSpriteDirection(value: CurrentSpriteDirection): void {
    if (value === this.currentSpriteDirection) {
      return;
    }
    this.currentSpriteDirection = value;
    this.container.replaceChild(
      value === 'right' ? this.leftSprite : this.rightSprite,
      value === 'left' ? this.leftSprite : this.rightSprite,
    );
  }
}
