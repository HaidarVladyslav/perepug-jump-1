import { Component, signal } from '@angular/core';
import { Application } from 'pixi.js';
import { Scene } from './scene';
import { Brick } from './brick';
import { Character } from './character';
import { Controller } from './controller';
import {
  G_FORCE,
  A_FORCE,
  X_FORCE,
  FORCE_SPEED_CHANGE,
  BRICK_SPEED_Y_MOVE,
  BRICKS_AMOUNT,
  COUNT_FOR_UPDATE_FORCE_SPEED,
  BRICK_RANDOM_Y_GAP,
  BRICK_Y_BETWEEN_SPACE,
} from './game-params';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('doodle-jump-1');

  constructor() {
    (async () => {
      const app = new Application();

      (window as any).__PIXI_APP__ = app;

      await app.init({ background: '#1099bb', resizeTo: window });

      document.body.appendChild(app.canvas);

      const width = app.screen.width;
      const height = app.screen.height;
      const sceneWidth = Math.max(width / 2, 400);

      const controller = new Controller();
      const scene = new Scene(width / 2, 0, sceneWidth, height, 'green');
      const bricks: Brick[] = [];

      const bricksAmount = BRICKS_AMOUNT;
      const VERTICAL_POINT_TO_MOVE_BRICKS_DOWN = scene.container.height / 2;

      app.stage.addChild(scene.container);

      for (let i = 0; i < bricksAmount; i++) {
        const brick = new Brick(0, height - BRICK_RANDOM_Y_GAP - i * BRICK_Y_BETWEEN_SPACE);
        brick.setContainerX(
          Math.min(
            scene.container.x + Math.floor(Math.random() * scene.container.width),
            scene.container.x + scene.container.width - brick.container.width,
          ),
        );
        bricks.push(brick);
        app.stage.addChild(brick.container);
      }

      const character = new Character(0, height - 900);
      character.setContainerX(
        Math.min(
          scene.container.x + Math.floor(Math.random() * scene.container.width),
          scene.container.x + scene.container.width - character.container.width,
        ),
      );
      app.stage.addChild(character.container);

      let gForce = G_FORCE;
      let aForce = A_FORCE;

      let count = 0;

      app.ticker.add((ticker) => {
        character.setContainerY(character.container.y - (aForce - gForce) * 1);

        if (controller.keys.left.pressed) {
          if (character.container.x < scene.container.x) {
            character.setContainerX(
              scene.container.x + scene.container.width - character.container.width,
            );
          } else {
            character.setContainerX(character.container.x - X_FORCE);
          }
        } else if (controller.keys.right.pressed) {
          if (
            character.container.x + character.container.width >
            scene.container.x + scene.container.width
          ) {
            character.setContainerX(scene.container.x + character.container.width);
          } else {
            character.setContainerX(character.container.x + X_FORCE);
          }
        }

        if (++count >= COUNT_FOR_UPDATE_FORCE_SPEED) {
          count = 0;
          aForce -= FORCE_SPEED_CHANGE;
        }

        const collidedBrick = bricks.find((brick) => {
          const brickXFrom = brick.container.x;
          const brickXTo = brick.container.x + brick.container.width;
          const brickYFrom = brick.container.y;
          const brickYTo = brick.container.y + brick.container.height;
          return (
            character.container.x + character.container.width >= brickXFrom &&
            character.container.x <= brickXTo &&
            brickYFrom < character.container.y + character.container.height &&
            brickYTo >= character.container.y + character.container.height
          );
        });

        if (collidedBrick) {
          if (aForce < gForce) {
            aForce = A_FORCE;
          }
        }

        bricks.forEach((brick, index) => {
          if (character.container.y < VERTICAL_POINT_TO_MOVE_BRICKS_DOWN) {
            brick.setNewY(
              brick.container.y + (VERTICAL_POINT_TO_MOVE_BRICKS_DOWN - character.container.y),
            );
          }

          if (brick.container.y > brick.newY) {
            brick.container.y = brick.newY;
          }

          if (brick.container.y !== brick.newY) {
            brick.container.y += BRICK_SPEED_Y_MOVE;
          }

          if (brick.container.y > scene.container.y + scene.container.height) {
            const lastBrick = bricks.at(-1);
            if (lastBrick) {
              brick.setContainerY(lastBrick.container.y - BRICK_Y_BETWEEN_SPACE);
            }
            bricks.splice(index, 1);
            bricks.push(brick);
          }
        });
      });
    })();
  }
}
