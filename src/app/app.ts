import { Component, signal } from '@angular/core';
import { Application, Assets, Text } from 'pixi.js';
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
  COUNT_GAME_FINISHED_CHANING,
  BRICK_SPEED_Y_MOVE_ACCELERATED,
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

      const textureRight = await Assets.load('right-perepug-2.png');
      const textureLeft = await Assets.load('left-perepug-2.png');
      const gameFinishedSprite = await Assets.load('dead-perepug-2.png');
      const gameFinishedSprite2 = await Assets.load('dead-2-perepug-2.png');
      const gameFinishedSprite3 = await Assets.load('dead-3-perepug-2.png');
      Assets.addBundle('fonts', [
        {
          alias: 'ChaChicle',
          src: 'https://pixijs.com/assets/webfont-loader/ChaChicle.ttf',
        },
        {
          alias: 'Lineal',
          src: 'https://pixijs.com/assets/webfont-loader/Lineal.otf',
        },
        {
          alias: 'Dotrice Regular',
          src: 'https://pixijs.com/assets/webfont-loader/Dotrice-Regular.woff',
        },
        {
          alias: 'Crosterian',
          src: 'https://pixijs.com/assets/webfont-loader/Crosterian.woff2',
        },
      ]);

      await Assets.loadBundle('fonts');

      const scoreText = new Text({
        text: '0',
        style: {
          fontFamily: 'Dotrice Regular',
          fontSize: 76,
          fill: 'red',
          stroke: { color: 'black', width: 3 },
        },
      });
      scoreText.y = 100;
      scoreText.x = 50;
      app.stage.addChild(scoreText);

      let score = 0;

      document.body.appendChild(app.canvas);

      const width = app.screen.width;
      const height = app.screen.height;
      const sceneWidth = Math.max(width / 2, 400);

      const controller = new Controller();
      const scene = new Scene(width / 2, 0, sceneWidth, height, 'black');
      const bricks: Brick[] = [];

      const bricksAmount = BRICKS_AMOUNT;
      const VERTICAL_POINT_TO_MOVE_BRICKS_DOWN = (scene.container.height * 2) / 5;

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

      const character = new Character(0, height - 900, textureLeft, textureRight, [
        gameFinishedSprite,
        gameFinishedSprite2,
        gameFinishedSprite3,
      ]);
      character.setContainerX(
        Math.min(
          scene.container.x + Math.floor(Math.random() * scene.container.width),
          scene.container.x + scene.container.width - character.container.width,
        ),
      );
      app.stage.addChild(character.container);

      let gForce = G_FORCE;
      let aForce = A_FORCE / 2;

      let count = 0;

      let countGameFinishedChanging = 0;

      let bricksForce = 0;

      let isEnd = false;
      let isReachedAfterEndCenterPosition = false;

      let brickYMoveSpeed = BRICK_SPEED_Y_MOVE;

      function updateScoreText() {
        const currentScore = scoreText.text;
        if (+currentScore === score) {
          return;
        }
        scoreText.text = +score;
      }

      app.ticker.add((ticker) => {
        if ((!isEnd && character.container.y > scene.container.height) || isEnd) {
          isEnd = true;

          brickYMoveSpeed = BRICK_SPEED_Y_MOVE_ACCELERATED;

          if (!isReachedAfterEndCenterPosition) {
            character.setContainerY(character.container.y - 50);
            const centerX = width / 2;
            if (centerX > character.container.x) {
              character.setContainerX(character.container.x + 50);
            }
            if (centerX < character.container.x) {
              character.setContainerX(character.container.x - 50);
            }
          }

          if (character.container.y <= height / 2) {
            isReachedAfterEndCenterPosition = true;

            if (++countGameFinishedChanging > COUNT_GAME_FINISHED_CHANING) {
              countGameFinishedChanging = 0;
              character.setGameFinishedSprite();

              bricks.forEach((brick, index) => {
                const value = brick.container.y + 500;

                brick.setNewY(value);
              });
            }
          }
        } else {
          if (!isEnd) {
            character.setContainerY(
              character.container.y - (aForce - gForce - bricksForce),
              // *(character.container.y <= 0 ? 1 / FORCE_WHEN_CHARACTER_OUT_OF_Y_SCREEN : 1),
            );
          }
        }

        if (controller.keys.left.pressed) {
          character.setSpriteDirection('left');

          if (character.container.x < scene.container.x) {
            character.setContainerX(
              scene.container.x + scene.container.width - character.container.width,
            );
          } else {
            character.setContainerX(character.container.x - X_FORCE);
          }
        } else if (controller.keys.right.pressed) {
          character.setSpriteDirection('right');
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

        const hasSomeBricksMovingBottom =
          character.container.y < VERTICAL_POINT_TO_MOVE_BRICKS_DOWN;

        bricksForce = hasSomeBricksMovingBottom ? brickYMoveSpeed : 0;

        if (hasSomeBricksMovingBottom) {
          score++;
          updateScoreText();
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
            brickYTo + FORCE_SPEED_CHANGE >= character.container.y + character.container.height
          );
        });

        if (collidedBrick) {
          if (aForce < gForce) {
            aForce = A_FORCE;
          }
        }

        bricks.forEach((brick, index) => {
          if (character.container.y < VERTICAL_POINT_TO_MOVE_BRICKS_DOWN) {
            const value =
              brick.container.y + (VERTICAL_POINT_TO_MOVE_BRICKS_DOWN - character.container.y);

            brick.setNewY(value);
          }

          if (brick.container.y > brick.newY) {
            brick.container.y = brick.newY;
          }

          if (brick.container.y !== brick.newY) {
            brick.container.y += brickYMoveSpeed;
            // * (character.container.y < 0 ? FORCE_WHEN_CHARACTER_OUT_OF_Y_SCREEN : 1);
          }

          if (!isEnd) {
            if (brick.container.y > scene.container.y + scene.container.height) {
              const lastBrick = bricks.at(-1);
              if (lastBrick) {
                brick.setContainerY(lastBrick.container.y - BRICK_Y_BETWEEN_SPACE);
              }
              bricks.splice(index, 1);
              bricks.push(brick);
            }
          }
        });
      });
    })();
  }
}
