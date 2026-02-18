import { Graphics } from 'pixi.js';

export function buildGrid(graphics: Graphics, width: number, height: number) {
  const cellSize = 40;
  const cellsXAmount = Math.floor(width / cellSize);
  const cellsYAmount = Math.floor(height / cellSize);
  for (let i = 1; i <= cellsXAmount; i++) {
    graphics.moveTo(i * cellSize, 0).lineTo(i * cellSize, height);
  }
  for (let i = 1; i <= cellsYAmount; i++) {
    graphics.moveTo(0, i * cellSize).lineTo(width, i * cellSize);
  }

  return graphics;
}
