type KeyCode = 'right' | 'left' | 'up' | 'down';

const KEY_MAP: { [key: string]: KeyCode } = {
  ArrowRight: 'right',
  ArrowLeft: 'left',
  ArrowUp: 'up',
  ArrowDown: 'down',
};

export class Controller {
  public keys: { [key in KeyCode]: { pressed: boolean } };

  constructor() {
    this.keys = {
      up: { pressed: false },
      down: { pressed: false },
      left: { pressed: false },
      right: { pressed: false },
    };

    window.addEventListener('keydown', (e) => this.keydown(e));
    window.addEventListener('keyup', (e) => this.keyup(e));
  }

  private keydown(event: KeyboardEvent): void {
    const key = event.key;
    const code = KEY_MAP[key];
    if (!code) {
      return;
    }

    if (!this.keys[code]) {
      return;
    }

    this.keys[code].pressed = true;
  }

  private keyup(event: KeyboardEvent): void {
    const key = event.key;
    const code = KEY_MAP[key];
    if (!code) {
      return;
    }

    if (!this.keys[code]) {
      return;
    }

    this.keys[code].pressed = false;
  }
}
