let gamerEmail  = localStorage.getItem('gem') || '';;
let currentScene = localStorage.getItem('csKey') || 'BootScene';
let backGroundMusic;
let config;

class AssetsScene extends Phaser.Scene {
  constructor() {
    super('AssetsScene');
  }

  preload() {
    this.load.image('welcome-bg', 'assets/welcome-bg.png');
    this.load.image('logo', 'assets/logo.png');
    this.load.audio('bg-music', 'assets/bg-music.mp3');

    //gaming
    this.load.image('basket', 'assets/basket.png');
    this.load.image('orange', 'assets/orange.png');
    this.load.audio('catch-sound', 'assets/catch.mp3');
  }

  create() {
    this.scene.start(currentScene);
  }
}



class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  /*preload() {
    this.load.image('welcome-bg', 'assets/welcome-bg.png');
    this.load.image('logo', 'assets/logo.png');
    this.load.audio('bg-music', 'assets/bg-music.mp3');

    //gaming
    this.load.image('basket', 'assets/basket.png');
    this.load.image('orange', 'assets/orange.png');
    this.load.audio('catch-sound', 'assets/catch.mp3');
  }
  */

  create() {
    const { width, height } = this.scale;

    localStorage.setItem('csKey', 'GameScene1');

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

    localStorage.setItem('csKey', 'GameScene1');

    // Play background music
    this.bgMusic = this.sound.add('bg-music', { loop: true, volume: 0.5 });
    this.bgMusic.play();


    // Automatically go to GameScene after 5 seconds
    this.time.delayedCall(20000, () => {
      this.bgMusic.stop();
      this.scene.start('GameScene1');
    });
    

    // Optional: Click to skip
    this.input.once('pointerdown', () => {
      this.bgMusic.stop();
      this.scene.start('GameScene1');
    });
  }
}








class GameScene1 extends Phaser.Scene {
  constructor() {
    super('GameScene1');
  }

  create() {
    const { width, height } = this.scale;

    this.add.text(width / 2, height / 2, 'Enter email to continue', {
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
      gamerEmail = email;
      localStorage.setItem('gem', gamerEmail);

      // Show feedback in game
      this.add.text(width / 2, height / 2 + 50, `\n \n You Entered: ${email} `, {
        font: '24px Arial',
        fill: '#ffff00'
      }).setOrigin(0.5);
      

      this.add.text(width / 2, height * 0.5, `\n \n \n \n \n Tap the screen to Continue`, {
        font: '48px Arial',
        fill: '#ffffff'
      }).setOrigin(0.5);

      localStorage.setItem('csKey', 'GameScene1');
  
      // Wait for user interaction
      this.input.once('pointerdown', () => {
        this.scene.start('GameScene2');
      });


    });

  }
}





class GameScene2 extends Phaser.Scene {
  constructor() {
    super('GameScene2');
  }

  create() {
    const { width, height } = this.scale;
    localStorage.setItem('csKey', 'GameScene2');

    this.add.text(width / 2, height / 2, `Welcome ${gamerEmail} \n \n`, {
      font: '48px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Show the HTML input box
    const task1 = document.getElementById('divtask1');
    task1.style.display = 'block';

    task1.addEventListener('click', () => {
      task1.style.display="none";

      this.add.text(width / 2, height * 0.5, '\n \n \n Game : Pick atleast 500 Oranges into the basket \n Duration : 1 minute. \n Are you ready ?\n Tap the screen to Play', {
        font: '48px Arial',
        fill: '#ffffff'
      }).setOrigin(0.5);
      

      // Wait for user interaction
      this.input.once('pointerdown', () => {
        backGroundMusic = this.sound.add('bg-music', { loop: true, volume: 0.5 });
        this.scene.start('GameScene3');
      });
    });

  }
}





class GameScene3 extends Phaser.Scene {
  constructor() {
      super('GameScene3');
      this.score = 0;
      this.timeLeft = 60; // 2 minutes in seconds
  }

  create() {
      const { width, height } = this.scale;
      localStorage.setItem('csKey', 'GameScene3');

      //Add Background music
      //backGroundMusic = this.sound.add('bg-music', { loop: true, volume: 0.5 });
      backGroundMusic.play();

      // Basket (player)
      this.player = this.physics.add.sprite(width / 2, height - 50, 'basket')
          .setCollideWorldBounds(true)
          .setScale(0.3); // smaller

      // "Fill" image to simulate oranges piling inside basket
      this.basketFill = this.add.graphics();
      this.fillLevel = 0; // how much it's filled

      // Group of oranges
      this.oranges = this.physics.add.group();
      for (let i = 0; i < 20; i++) {
          const orange = this.oranges.create(
              Phaser.Math.Between(50, width - 50),
              Phaser.Math.Between(-300, 0),
              'orange'
          ).setScale(0.15); // smaller oranges
          orange.setVelocityY(Phaser.Math.Between(150, 300));
      }

      // Overlap: basket & oranges
      this.physics.add.overlap(this.player, this.oranges, this.catchOrange, null, this);

      // Score text
      this.scoreText = this.add.text(20, 20, 'Oranges Picked: 0', {
          fontSize: '20px',
          fill: '#fff'
      });

      // Timer text
      this.timerText = this.add.text(width - 150, 20, 'Time: 2:00', {
          fontSize: '20px',
          fill: '#ff0000'
      });

      // Countdown
      this.timerEvent = this.time.addEvent({
          delay: 1000,
          callback: this.updateTimer,
          callbackScope: this,
          loop: true
      });

      // Controls
      this.cursors = this.input.keyboard.createCursorKeys();
      this.input.on('pointermove', (pointer) => {
          this.player.x = pointer.x;
      });
  }

  update() {
      // Keyboard movement
      if (this.cursors.left.isDown) {
          this.player.setVelocityX(-300);
      } else if (this.cursors.right.isDown) {
          this.player.setVelocityX(300);
      } else {
          this.player.setVelocityX(0);
      }

      // Reset oranges that fall
      this.oranges.children.iterate((orange) => {
          if (orange.y > this.scale.height) {
              orange.y = 0;
              orange.x = Phaser.Math.Between(50, this.scale.width - 50);
              orange.setVelocityY(Phaser.Math.Between(150, 300));
          }
      });

      // Draw basket fill
      this.basketFill.clear();
      this.basketFill.fillStyle(0xffa500, 1);
      const basketTop = this.player.y - 10;
      const basketHeight = 30;
      const fillHeight = (this.fillLevel / 500) * basketHeight;
      this.basketFill.fillRect(
          this.player.x - 25,
          basketTop - fillHeight,
          50,
          fillHeight
      );
  }

  catchOrange(player, orange) {
      // Play catch sound if loaded
      if (this.sound.get('catch-sound')) {
          this.sound.play('catch-sound', { volume: 0.5 });
      }

      // Reset orange
      orange.y = 0;
      orange.x = Phaser.Math.Between(50, this.scale.width - 50);
      orange.setVelocityY(Phaser.Math.Between(150, 300));

      // Update score
      this.score++;
      this.scoreText.setText('Oranges Picked: ' + this.score);

      // Update fill level
      if (this.fillLevel < 500) {
          this.fillLevel++;
      }

      // Win condition
      if (this.score >= 500) {
          backGroundMusic.stop();
          this.scene.start('WinScene1', { score: this.score });
      }
  }

  updateTimer() {
      this.timeLeft--;
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      this.timerText.setText(`Time: ${minutes}:${seconds.toString().padStart(2, '0')}`);

      if (this.timeLeft <= 0) {
          // Time's up, check if player has won
          if (this.score >= 500) {
            backGroundMusic.stop();
            this.scene.start('WinScene1', { score: this.score });
          } else {
            backGroundMusic.stop();
            this.scene.start('LoseScene1', { score: this.score });
          }
      }
  }
}




class LoseScene1 extends Phaser.Scene {
  constructor() {
      super('LoseScene1');
  }

  init(data) {
      this.finalScore = data.score;
  }

  create() {
    localStorage.setItem('csKey', 'GameScene3');
      const { width, height } = this.scale;
      this.add.text(width / 2, height / 2, `Oops!! You Lose! \n Total Oranges Picked: ${this.finalScore}`, {
          fontSize: '48px',
          fill: '#f00',
          align: 'center'
      }).setOrigin(0.5);

      this.input.once('pointerdown', () => {
          this.scene.start('GameScene3');
      });
  }
}



class WinScene1 extends Phaser.Scene {
  constructor() {
      super('WinScene1');
  }

  init(data) {
      this.finalScore = data.score;
  }

  create() {
    localStorage.setItem('csKey', 'GameScene3');
      const { width, height } = this.scale;
      this.add.text(width / 2, height / 2, `Congratulations, You Win! \n Total Oranges Picked: ${this.finalScore}`, {
          fontSize: '48px',
          fill: '#ffff00',
          align: 'center'
      }).setOrigin(0.5);

      this.input.once('pointerdown', () => {
          this.scene.start('GameScene3');
      });
  }
}







if(currentScene ==='LoseScene1'){
  config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container', // match your HTML
    physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 0 },
          debug: false
      }
  },
    scale: {
      mode: Phaser.Scale.FIT,     // or RESIZE
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [AssetsScene, LoseScene1],
    audio: {
      disableWebAudio: false
    }
  };
}
else if(currentScene ==='WinScene1'){
  config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container', // match your HTML
    physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 0 },
          debug: false
      }
  },
    scale: {
      mode: Phaser.Scale.FIT,     // or RESIZE
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [AssetsScene, WinScene1],
    audio: {
      disableWebAudio: false
    }
  };
}
else if(currentScene ==='GameScene3'){
  config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container', // match your HTML
    physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 0 },
          debug: false
      }
    },
    scale: {
      mode: Phaser.Scale.FIT,     // or RESIZE
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [AssetsScene, GameScene3, WinScene1, LoseScene1],
    audio: {
      disableWebAudio: false
    }
  };
}
else if(currentScene ==='GameScene2'){
  config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container', // match your HTML
    physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 0 },
          debug: false
      }
    },
    scale: {
      mode: Phaser.Scale.FIT,     // or RESIZE
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [AssetsScene, GameScene2, GameScene3, WinScene1, LoseScene1],
    audio: {
      disableWebAudio: false
    }
  };
}
else if(currentScene ==='GameScene1'){
  config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container', // match your HTML
    physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 0 },
          debug: false
      }
    },
    scale: {
      mode: Phaser.Scale.FIT,     // or RESIZE
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [AssetsScene, GameScene1, GameScene2, GameScene3, WinScene1, LoseScene1],
    audio: {
      disableWebAudio: false
    }
  };
}
else if(currentScene ==='WelcomeScene'){
  config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container', // match your HTML
    physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 0 },
          debug: false
      }
    },
    scale: {
      mode: Phaser.Scale.FIT,     // or RESIZE
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [AssetsScene, WelcomeScene, GameScene1, GameScene2, GameScene3, WinScene1, LoseScene1],
    audio: {
      disableWebAudio: false
    }
  };
}
else if(currentScene ==='BootScene' || currentScene ===undefined || currentScene ===null || currentScene ===''){
  config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container', // match your HTML
    physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 0 },
          debug: false
      }
    },
    scale: {
      mode: Phaser.Scale.FIT,     // or RESIZE
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [AssetsScene, BootScene, WelcomeScene, GameScene1, GameScene2, GameScene3, WinScene1, LoseScene1],
    audio: {
      disableWebAudio: false
    }
  };
}


new Phaser.Game(config);

console.log(currentScene);