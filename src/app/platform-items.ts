import { Rectangle, Sprite, Texture, TextureSource } from 'pixi.js';

export type PlatformItem_Name = 'fridge' | 'microwave' | 'toaster' | 'pan' | 'butter' | 'ice';
export const PLATFORM_ITEMS_RECTANGLE_PARAMS: {
  [key in PlatformItem_Name]: [number, number, number, number];
} = {
  fridge: [0, 0, 160, 200],
  microwave: [166, 0, 204, 200],
  toaster: [362, 0, 200, 200],
  pan: [856, 20, 196, 200],
  butter: [1066, 20, 200, 200],
  ice: [1268, 60, 250, 200],
};

export function generatePlatformItemsSprites(source: TextureSource): Sprite[] {
  return Object.entries(PLATFORM_ITEMS_RECTANGLE_PARAMS).map(([key, rectangleValues]) => {
    return new Sprite({
      texture: new Texture({
        source,
        frame: new Rectangle(...rectangleValues),
      }),
    });
  });
}
