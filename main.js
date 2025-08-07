class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.image('welcome-bg', 'assets/welcome-bg.png');
    this.load.image('logo', 'assets/logo.png');
    this.load.audio('bg-music', 'assets/bg-music.mp3');
  }

  create() {
    const { width, height } = this.scale;

    // Show simple start screen
    //this.add.image(width / 2, height / 2, 'welcome-bg').setDisplaySize(width, height);

    this.add.text(width / 2, height * 0.5, 'Tap the screen to Start Game', {
      font: '48px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Wait for user interaction
    this.input.once('pointerdown', () => {
      this.scene.start('WelcomeScene');
    });
  }
}



class WelcomeScene extends Phaser.Scene {
  constructor() {
    super('WelcomeScene');
  }

  create() {
    const { width, height } = this.scale;

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
    this.time.delayedCall(60000, () => {
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

class GameScene1 extends Phaser.Scene {
  constructor() {
    super('GameScene1');
  }

  create() {
    const { width, height } = this.scale;

    this.add.text(width / 2, height / 2, 'Enter your email to..', {
      font: '48px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Show the HTML input box
    const emailInput = document.getElementById('email-input');
    emailInput.style.display = 'block';

    // Optional: Autofocus
    emailInput.focus();

    // Listen for when user presses Enter or clicks away
    emailInput.addEventListener('change', () => {
      const email = emailInput.value;
      console.log('User email:', email);

      // Hide input after use
      emailInput.style.display = 'none';

      // Show feedback in game
      this.add.text(width / 2, height / 2 + 50, `You entered: ${email}`, {
        font: '24px Arial',
        fill: '#ffff00'
      }).setOrigin(0.5);
    });

  }
}


const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'game-container', // match your HTML
  scale: {
    mode: Phaser.Scale.FIT,     // or RESIZE
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, WelcomeScene, GameScene],
  audio: {
    disableWebAudio: false
  }
};


new Phaser.Game(config);
