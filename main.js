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
    const { width, height } = this.scale;

    // Play background music
    this.bgMusic = this.sound.add('bg-music', { loop: true, volume: 0.5 });
    this.bgMusic.play();

    // Add background scaled to fill screen
    this.add.image(width / 2, height / 2, 'welcome-bg')
      .setDisplaySize(width, height);

    // Add logo centered horizontally, higher vertically
    /*this.logo = this.add.image(width / 2, height * 0.3, 'logo')
      .setScale(0.5);
      */

    // Add welcome text
    /*this.add.text(width / 2, height * 0.5, 'Welcome to the Game', {
      font: '48px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);
    */

    /*this.add.text(width / 2, height * 0.58, 'Loading...', {
      font: '32px Arial',
      fill: '#cccccc'
    }).setOrigin(0.5);
    */

    // Play background music
    this.bgMusic = this.sound.add('bg-music', { loop: true, volume: 0.5 });
    this.bgMusic.play();

    // Automatically go to GameScene after 5 seconds
    this.time.delayedCall(55000, () => {
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
    const { width, height } = this.scale;

    this.add.text(width / 2, height / 2, 'Game is starting..', {
      font: '48px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);
  }
}


const config = {
  type: Phaser.AUTO,
  width: '100%',
  height: '100%',
  parent: 'game-container', // match your HTML
  scale: {
    mode: Phaser.Scale.FIT,     // or RESIZE
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [WelcomeScene, GameScene],
  audio: {
    disableWebAudio: false
  }
};


new Phaser.Game(config);
