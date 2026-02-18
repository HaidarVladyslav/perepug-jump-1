import { Container, Sprite, Texture, TextureSource } from 'pixi.js';

type CurrentSpriteDirection = 'left' | 'right';

export class Character {
  public container: Container;
  private rightSprite: Sprite;
  private leftSprite: Sprite;
  private gameFinishedSprites: Sprite[];
  private gameFinishedSpriteIndex: number = 0;
  private currentSpriteDirection: CurrentSpriteDirection = 'left';

  constructor(
    x: number,
    y: number,
    leftSource: TextureSource,
    rightSource: TextureSource,
    gameFinishedSprite: TextureSource[],
  ) {
    this.container = new Container();

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
    this.gameFinishedSprites = gameFinishedSprite.map(
      (source) =>
        new Sprite({
          texture: new Texture({
            source,
          }),
        }),
    );

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

  public setGameFinishedSprite(): void {
    this.container.removeChildren();
    const index = this.gameFinishedSpriteIndex;

    if (index >= this.gameFinishedSprites.length - 1) {
      this.gameFinishedSpriteIndex = 0;
    } else {
      this.gameFinishedSpriteIndex++;
    }
    this.container.addChild(this.gameFinishedSprites[this.gameFinishedSpriteIndex]);
  }
}
