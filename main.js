class WelcomeScene extends Phaser.Scene {
  constructor() {
    super('WelcomeScene');
  }

  preload() {
    this.load.image('welcome-bg', 'assets/welcome-bg.png');
    this.load.image('logo', 'assets/logo.png');
    this.load.audio('bg-music', 'assets/bg-music.mp3');
  }

  create() {
    // Add background
    this.add.image(400, 300, 'welcome-bg').setDisplaySize(800, 600);

    // Add logo
    this.logo = this.add.image(400, 200, 'logo');
    this.logo.setScale(0.5);

    // Add welcome text
    this.add.text(400, 350, 'Welcome to the Game', {
      font: '32px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 400, 'Loading...', {
      font: '24px Arial',
      fill: '#cccccc'
    }).setOrigin(0.5);

    // Play background music
    this.bgMusic = this.sound.add('bg-music', { loop: true, volume: 0.5 });
    this.bgMusic.play();

    // Automatically go to GameScene after 5 seconds
    this.time.delayedCall(5000, () => {
      this.bgMusic.stop();
      this.scene.start('GameScene');
    });

    // Optional: Click to skip
    this.input.once('pointerdown', () => {
      this.bgMusic.stop();
      this.scene.start('GameScene');
    });
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.add.text(400, 300, 'Game Started!', {
      font: '32px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [WelcomeScene, GameScene],
  audio: {
    disableWebAudio: false
  }
};

new Phaser.Game(config);
