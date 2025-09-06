let gamerEmail  = localStorage.getItem('gem') || '';;
let currentScene = localStorage.getItem('csKey') || 'BootScene';
let backGroundMusic;
let config;
let phaserScene = this.scene;

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
    this.load.image('green-orange', 'assets/green-orange.png');
    this.load.image('stone', 'assets/stone.png');
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

    // Show the HTML input box
    const emailInput = document.getElementById('table-input');
    emailInput.style.display = 'block';

    // Autofocus
    emailInput.focus();

    const logBtn = document.getElementById("logbtn");
    const regBtn = document.getElementById("regbtn");

    //LOGIN BUTTON LISTENER ===
    logBtn.addEventListener('click', () => {
      let logEmail = document.getElementById("email").value;
      let logPwd = document.getElementById("password").value;

      if (!logEmail || !logPwd) {
        document.getElementById("output").innerHTML =
          `<font style="color:red;">Email And Password Cannot be empty</font>`;
      } else {
        async function loginUser() {
          const api = await fetch('login.php', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: logEmail,
              password: logPwd
            })
          });

          const result = await api.json();
          if (api.ok) {
            if (result.status === "success") {
              // store in localStorage (must be stringified)
              localStorage.setItem('userdata', JSON.stringify(result.response));

              nextScreen.call(this); // call with correct "this"
            } else {
              document.getElementById("output").innerHTML =
                `${result.response}`;
            }
          }
        }
        loginUser.call(this); // preserve scene context
      }
    });

    //REGISTER BUTTON LISTENER ===
    regBtn.addEventListener('click', () => {
      let regEmail = document.getElementById("email-input").value;
      let regName = document.getElementById("name-reg").value;
      let pwd = document.getElementById("pwd-reg").value;
      let wallet = document.getElementById("wallet-reg").value;

      if (regEmail && regName && pwd && wallet) {
        async function regUser() {
          const sendApi = await fetch('register.php', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: regEmail,
              name: regName,
              password: pwd,
              wallet_address: wallet
            })
          });

          const result = await sendApi.json();
          if (sendApi.ok) {
            if (result.status === "success") {
              // store in localStorage
              localStorage.setItem('userdata', JSON.stringify(result.response));

              nextScreen.call(this);
            } else {
              document.getElementById("output").innerHTML =
                `<font style="color:red;">${result.response}</font>`;
            }
          } else {
            document.getElementById("output").innerHTML =
              `<font style="color:red;">Oops!! something went wrong</font>`;
          }
        }

        regUser.call(this);
      } else {
        document.getElementById("output").innerHTML =
          `<font style="color:red;">All fields are required</font>`;
      }
    });

    // HELPER FUNCTION TO MOVE TO NEXT SCENE
    function nextScreen() {
      localStorage.setItem('csKey', 'GameScene1');
      emailInput.style.display ='none';
      this.scene.start('GameScene2'); //next screen
    }
  }
}






class GameScene2 extends Phaser.Scene {
  constructor() {
    super('GameScene2');
  }

  create() {
    // Check login
    const userRaw = localStorage.getItem('userdata');
    if (!userRaw) {
      localStorage.setItem('csKey', 'GameScene1');
      document.getElementById("output").style.display = "block";
      document.getElementById("output").innerHTML = `You need to login first <a href="/bussygame">Login/Register</a>`;
      return;
    }

    const { width, height } = this.scale;
    localStorage.setItem('csKey', 'GameScene2');

    // Parse user data
    let userData;
    try {
      userData = JSON.parse(userRaw);
    } catch (e) {
      console.error("Invalid userdata in localStorage");
      return;
    }

    const userEmail = userData.email || "";
    const userName = userData.name || "";
    const walletAddress = userData.walletAddress || "";
    const balance = userData.balance ? userData.balance : 0;

    document.getElementById("questions").style.display = "block";
    document.getElementById('questionaire-user').innerHTML =
      `<font style="font-size:20px; font-weight:bold;">Welcome ${userName} | Email : ${userEmail} | Wallet : ${walletAddress}</font> | Balance : ${balance}`;

    // Load questions
    async function quest() {
      try {
        const api = await fetch('questionaire.php', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' }
        });

        const resulti = await api.json();
        if (api.ok && resulti.status === "success") {
          let ress = resulti.response;
          let sn = 1;
          let dataout = `<div><h3>Pick a Question</h3>`;
          for (let i = 0; i < ress.length; i++) {
            dataout += `
              <div style="height:50px;">
                <a href="javascript:void(0)" 
                   style="text-decoration:none; cursor:pointer; color:white;" 
                   onclick="choseQuest('${ress[i].question}', '${ress[i].optiona}', '${ress[i].optionb}', '${ress[i].answer}')">
                  ${sn++} --- ${ress[i].question}
                </a>
              </div>`;
          }
          dataout += `</div>`;
          document.getElementById("questionaire").innerHTML = dataout;
        } else {
          document.getElementById("questionaire").innerHTML = `${resulti.status || "Error loading questions"}`;
        }
      } catch (err) {
        console.error(err);
        document.getElementById("questionaire").innerHTML = "No questionnaire found";
      }
    }

    quest();
  }
}

// Global functions (because inline onclick calls them)
function choseQuest(qes, oa, ob, ans) {
  document.getElementById("questionaire").innerHTML = `
    <h3>Answer Task/Question</h3>
    <h4>Task/Question</h4>
    <p>${qes}</p>
    <p>Option A : ${oa.toUpperCase()}</p>
    <p>Option B : ${ob.toUpperCase()}</p>
    <p>Type your answer in the box below. e.g vitamin c</p>
    <div style="margin-left:300px;">
      <input type="text" id="answer_picked" />
      <p>
        <button onclick="answerQuest(document.getElementById('answer_picked').value, '${ans}')">Submit</button>
      </p>

      <h3>OR <br/> Make Payment</h3>
      <button>Pay 0.1 BNB</button>
    </div>
  `;
}

function answerQuest(answered, ans) {
  if (answered.toLowerCase() !== ans.toLowerCase()) {
    document.getElementById("questionaire").innerHTML = `
      <h3>Wrong Answer</h3>
      <p>The answer you picked is wrong, hence, you'll need to make payment if you still want to play the game</p>
      <div style="margin-left:300px;">
        <button>Pay 0.1 BNB</button>
      </div>
    `;
  } else {
    document.getElementById("questionaire").innerHTML = `
      <h3>Correct Answer</h3>
      <p>You can now play the game.</p>
      <h2>Game Level 1</h2>
      <p>Pick 500 Oranges into the basket within 2 minutes</p>
      <p>If you're able to pick 500 oranges within 2 minutes, you win; otherwise, you lose</p>
      <p>If you loose, you'll have to relogin and start all over</p>
      <p>Good Luck</p>
      <div style="margin-left:300px;">
        <button onclick="game.scene.start('GameScene3')">Play Game</button>
      </div>
    `;
  }
}









class GameScene3 extends Phaser.Scene {
  constructor() {
      super('GameScene3');
      this.score = 0;
      this.timeLeft = 120; // 2 minutes in seconds
  }

  create() {
      const { width, height } = this.scale;
      localStorage.setItem('csKey', 'GameScene3');

      //clean the screen
      document.getElementById("questions").style.display = "none";

      //Add Background music
      backGroundMusic = this.sound.add('bg-music', { loop: true, volume: 0.5 });
      backGroundMusic.play();

      // Basket (player)
      this.player = this.physics.add.sprite(width / 2, height - 50, 'basket')
          .setCollideWorldBounds(true)
          .setScale(0.1); // smaller

      // "Fill" image to simulate oranges piling inside basket
      this.basketFill = this.add.graphics();
      this.fillLevel = 0; // how much it's filled

      // Group of oranges
      this.oranges = this.physics.add.group();
      for (let i = 0; i < 20; i++) {
          const orange = this.oranges.create(
              Phaser.Math.Between(50, width - 50),
              Phaser.Math.Between(-100, 0),
              'orange'
          ).setScale(0.04); // smaller oranges
          orange.setVelocityY(Phaser.Math.Between(50, 100));
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
              orange.setVelocityY(Phaser.Math.Between(120, 240));
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
      data.score = 0;
  }

  create() {
    //then take him back to scene1
    localStorage.setItem('csKey', 'GameScene1');
    //let crrsc = localStorage.getItem('csKey');
    //let lastval = parseInt(crrsc[-1]) + 1;
      const { width, height } = this.scale;
      this.add.text(width / 2, height / 2, `Oops!! You Lose! \n Total Oranges Picked: ${this.finalScore} \n You need to Win this level \n before moving to the next level \n Tap the screem to continue`, {
          fontSize: '48px',
          fill: '#f00',
          align: 'center'
      }).setOrigin(0.5);

      //clear storage so that he can restart
      localStorage.clear();

      this.input.once('pointerdown', () => {
          backGroundMusic = this.sound.add('bg-music', { loop: true, volume: 0.5 });
          this.scene.start('GameScene1');
      });
  }
}



class WinScene1 extends Phaser.Scene {
  constructor() {
      super('WinScene1');
  }

  init(data) {
      this.finalScore = data.score;
      data.score = 0;
  }

  create() {
    localStorage.setItem('csKey', 'GameScene4');
    //let crrsc = localStorage.getItem('csKey');
    //let lastval = parseInt(crrsc[-1]) + 1;
    //let crrsc[-1] = lastval;
    //get userdata
    const userdata = JSON.parse(localStorage.getItem('userdata'));
    const usermailer = userdata.email;
    const wallet = userdata.walletAddress;
    const userbal = userdata.balance ? userdata.balance : 0;
    const currentBalance = parseFloat(userbal);
    const newBalance = currentBalance + 0.1;


    console.log(userbal + '\n' + currentBalance + '\n' + newBalance);

      const { width, height } = this.scale;
      this.add.text(width / 2, height / 2, `Congratulations, You Win this level! \n Total Oranges Picked: ${this.finalScore} \n You won 0.1 BNB \n Wallet: ${wallet} \n Total Reward: ${newBalance}  \n Now to the next level \n Tap the screen to continue`, {
          fontSize: '48px',
          fill: '#ffff00',
          align: 'center'
      }).setOrigin(0.5);

      //now update his new wallet
      updateBalance(newBalance, usermailer);


      this.input.once('pointerdown', () => {
          this.scene.start('GameScene4');
      });
  }
}


async function updateBalance(balance, user) {
  const api = await fetch('update_balance.php', {
    method:"POST",
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      email:user,
      balance:balance
    })
  });
}



class GameScene4 extends Phaser.Scene {
  constructor() {
    super('GameScene4');
  }

  create() {
    const { width, height } = this.scale;
    localStorage.setItem('csKey', 'GameScene4');

    this.add.text(width / 2, height / 2, `Welldone ${gamerEmail} \n \n`, {
      font: '48px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Show the HTML input box
    const task1 = document.getElementById('divtask2');
    task1.style.display = 'block';

    task1.addEventListener('click', () => {
      task1.style.display="none";

      this.add.text(width / 2, height * 0.5, '\n \n \n Game : Pick atleast 500 Ripe Oranges into the basket \n Duration : 1 minute. \n Are you ready ?\n Tap the screen to Play', {
        font: '48px Arial',
        fill: '#ffffff'
      }).setOrigin(0.5);
      

      // Wait for user interaction
      this.input.once('pointerdown', () => {
        backGroundMusic = this.sound.add('bg-music', { loop: true, volume: 0.5 });
        this.scene.start('GameScene5');
      });
    });

  }
}




class GameScene5 extends Phaser.Scene {
  constructor() {
      super('GameScene5');
      this.score = 0;
      this.timeLeft = 120; // 2 minutes
  }

  create() {
      const { width, height } = this.scale;
      localStorage.setItem('csKey', 'GameScene5');

      // Background music
      backGroundMusic.play();

      // Basket sprite
      this.player = this.physics.add.sprite(width / 2, height - 50, 'basket')
          .setCollideWorldBounds(true)
          .setScale(0.07);

      // Basket fill graphics
      this.basketFill = this.add.graphics();
      this.fillLevel = 0;

      // Group of oranges (ripe + green)
      this.oranges = this.physics.add.group();
      for (let i = 0; i < 15; i++) {
          const texture = Phaser.Math.Between(0, 1) === 0 ? 'orange' : 'green-orange';
          const orange = this.oranges.create(
              Phaser.Math.Between(10, width - 10),
              Phaser.Math.Between(-10, 0),
              texture
          ).setScale(0.07);
          orange.setVelocityY(Phaser.Math.Between(150, 300));
          orange.isRipe = (texture === 'orange');
      }

      // Direct collision with the basket (no catchZone anymore)
      this.physics.add.overlap(this.player, this.oranges, this.catchOrange, null, this);

      // Score text
      this.scoreText = this.add.text(20, 20, 'Ripe Oranges: 0', {
          fontSize: '18px',
          fill: '#fff'
      });

      // Timer text
      this.timerText = this.add.text(width - 150, 20, 'Time: 2:00', {
          fontSize: '18px',
          fill: '#ff0000'
      });

      // Timer
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
      if (this.cursors.left.isDown) {
          this.player.setVelocityX(-300);
      } else if (this.cursors.right.isDown) {
          this.player.setVelocityX(300);
      } else {
          this.player.setVelocityX(0);
      }

      // Reset oranges that fall past the bottom
      this.oranges.children.iterate((orange) => {
          if (orange.y > this.scale.height) {
              orange.y = 0;
              orange.x = Phaser.Math.Between(50, this.scale.width - 50);
              orange.setVelocityY(Phaser.Math.Between(150, 300));
              orange.setTexture(Phaser.Math.Between(0, 1) === 0 ? 'orange' : 'green-orange');
              orange.isRipe = (orange.texture.key === 'orange');
          }
      });

      // Basket fill bar
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
      // Reset orange after caught
      orange.y = 0;
      orange.x = Phaser.Math.Between(50, this.scale.width - 50);
      orange.setVelocityY(Phaser.Math.Between(150, 300));
      orange.setTexture(Phaser.Math.Between(0, 1) === 0 ? 'orange' : 'green-orange');
      orange.isRipe = (orange.texture.key === 'orange');

      if (orange.isRipe) {
          this.score++;
          this.fillLevel++;
      } else {
          this.score = Math.max(0, this.score - 1);
          this.fillLevel = Math.max(0, this.fillLevel - 1);
      }

      this.scoreText.setText('Ripe Oranges: ' + this.score);

      if (this.score >= 500) {
          this.scene.start('WinScene2', { score: this.score });
      }
  }

  updateTimer() {
      this.timeLeft--;
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      this.timerText.setText(`Time: ${minutes}:${seconds.toString().padStart(2, '0')}`);

      if (this.timeLeft <= 0) {
          if (this.score >= 500) {
              this.scene.start('WinScene2', { score: this.score });
          } else {
              this.scene.start('LoseScene2', { score: this.score });
          }
      }
  }
}






class LoseScene2 extends Phaser.Scene {
  constructor() {
      super('LoseScene2');
  }

  init(data) {
      this.finalScore = data.score;
      data.score = 0;
  }

  create() {
    localStorage.setItem('csKey', 'GameScene5');
    //let crrsc = localStorage.getItem('csKey');
    //let lastval = parseInt(crrsc[-1]) + 1;
      const { width, height } = this.scale;
      this.add.text(width / 2, height / 2, `Oops!! You Lose! \n Total Ripe Oranges Picked: ${this.finalScore} \n You need to Win this level \n before moving to the next level \n Tap the screem to continue`, {
          fontSize: '48px',
          fill: '#f00',
          align: 'center'
      }).setOrigin(0.5);

      this.input.once('pointerdown', () => {
          backGroundMusic = this.sound.add('bg-music', { loop: true, volume: 0.5 });
          this.scene.start('GameScene5');
      });
  }
}



class WinScene2 extends Phaser.Scene {
  constructor() {
      super('WinScene2');
  }

  init(data) {
      this.finalScore = data.score;
      data.score = 0;
  }

  create() {
    localStorage.setItem('csKey', 'GameScene6');
    //let crrsc = localStorage.getItem('csKey');
    //let lastval = parseInt(crrsc[-1]) + 1;
    //let crrsc[-1] = lastval;
      const { width, height } = this.scale;
      this.add.text(width / 2, height / 2, `Congratulations, You Win! \n Total Oranges Picked: ${this.finalScore} \n You need to perform another task \n before moving to the next level \n Tap the screen to continue`, {
          fontSize: '48px',
          fill: '#ffff00',
          align: 'center'
      }).setOrigin(0.5);

      this.input.once('pointerdown', () => {
          this.scene.start('GameScene6');
      });
  }
}



class GameScene6 extends Phaser.Scene {
  constructor() {
    super('GameScene6');
  }

  create() {
    const { width, height } = this.scale;
    localStorage.setItem('csKey', 'GameScene6');

    this.add.text(width / 2, height / 2, `Welldone ${gamerEmail} \n \n`, {
      font: '48px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Show the HTML input box
    const task1 = document.getElementById('divtask3');
    task1.style.display = 'block';

    task1.addEventListener('click', () => {
      task1.style.display="none";

      this.add.text(width / 2, height * 0.5, '\n \n \n Game : Pick atleast 500 Ripe Oranges only \n into the basket \n Duration : 2 minute. \n Are you ready ?\n Tap the screen to Play', {
        font: '48px Arial',
        fill: '#ffffff'
      }).setOrigin(0.5);
      

      // Wait for user interaction
      this.input.once('pointerdown', () => {
        backGroundMusic = this.sound.add('bg-music', { loop: true, volume: 0.5 });
        this.scene.start('GameScene7');
      });
    });

  }
}




class GameScene7 extends Phaser.Scene {
  constructor() {
      super('GameScene7');
      this.score = 0;
      this.timeLeft = 120; // 2 minutes
  }

  create() {
      const { width, height } = this.scale;
      localStorage.setItem('csKey', 'GameScene7');

      // Background music
      backGroundMusic.play();

      // Basket (player)
      this.player = this.physics.add.sprite(width / 2, height - 50, 'basket')
          .setCollideWorldBounds(true)
          .setScale(0.07);

      // Basket fill graphics
      this.basketFill = this.add.graphics();
      this.fillLevel = 0;

      // Falling objects group
      this.objects = this.physics.add.group();
      for (let i = 0; i < 20; i++) {
          const type = Phaser.Math.Between(0, 2); // 0 = ripe, 1 = green, 2 = stone
          let texture, isRipe, isBad;

          if (type === 0) {
              texture = 'orange';
              isRipe = true;
              isBad = false;
          } else if (type === 1) {
              texture = 'green-orange';
              isRipe = false;
              isBad = true;
          } else {
              texture = 'stone';
              isRipe = false;
              isBad = true;
          }

          const obj = this.objects.create(
              Phaser.Math.Between(10, width - 10),
              Phaser.Math.Between(-10, 0),
              texture
          ).setScale(0.07);

          obj.setVelocityY(Phaser.Math.Between(150, 300));
          obj.isRipe = isRipe;
          obj.isBad = isBad;
      }

      // Collision
      this.physics.add.overlap(this.player, this.objects, this.catchObject, null, this);

      // Score text
      this.scoreText = this.add.text(20, 20, 'Ripe Oranges: 0', {
          fontSize: '18px',
          fill: '#fff'
      });

      // Timer text
      this.timerText = this.add.text(width - 150, 20, 'Time: 2:00', {
          fontSize: '18px',
          fill: '#ff0000'
      });

      // Timer
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
      // Player movement
      if (this.cursors.left.isDown) {
          this.player.setVelocityX(-300);
      } else if (this.cursors.right.isDown) {
          this.player.setVelocityX(300);
      } else {
          this.player.setVelocityX(0);
      }

      // Reset objects that fall
      this.objects.children.iterate((obj) => {
          if (obj.y > this.scale.height) {
              obj.y = 0;
              obj.x = Phaser.Math.Between(50, this.scale.width - 50);
              obj.setVelocityY(Phaser.Math.Between(150, 300));

              const type = Phaser.Math.Between(0, 2);
              if (type === 0) {
                  obj.setTexture('orange');
                  obj.isRipe = true;
                  obj.isBad = false;
              } else if (type === 1) {
                  obj.setTexture('green-orange');
                  obj.isRipe = false;
                  obj.isBad = true;
              } else {
                  obj.setTexture('stone');
                  obj.isRipe = false;
                  obj.isBad = true;
              }
          }
      });

      // Basket fill bar
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

  catchObject(player, obj) {
      // Reset object
      obj.y = 0;
      obj.x = Phaser.Math.Between(50, this.scale.width - 50);
      obj.setVelocityY(Phaser.Math.Between(150, 300));

      const type = Phaser.Math.Between(0, 2);
      if (type === 0) {
          obj.setTexture('orange');
          obj.isRipe = true;
          obj.isBad = false;
      } else if (type === 1) {
          obj.setTexture('green-orange');
          obj.isRipe = false;
          obj.isBad = true;
      } else {
          obj.setTexture('stone');
          obj.isRipe = false;
          obj.isBad = true;
      }

      // Scoring
      if (obj.isRipe) {
          this.score++;
          this.fillLevel++;
      } else if (obj.isBad) {
          this.score = Math.max(0, this.score - 1);
          this.fillLevel = Math.max(0, this.fillLevel - 1);
      }

      this.scoreText.setText('Ripe Oranges: ' + this.score);

      // Win condition
      if (this.score >= 500) {
          this.scene.start('WinScene3', { score: this.score });
      }
  }

  updateTimer() {
      this.timeLeft--;
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      this.timerText.setText(`Time: ${minutes}:${seconds.toString().padStart(2, '0')}`);

      if (this.timeLeft <= 0) {
          if (this.score >= 500) {
              this.scene.start('WinScene3', { score: this.score });
          } else {
              this.scene.start('LoseScene3', { score: this.score });
          }
      }
  }
}






class LoseScene3 extends Phaser.Scene {
  constructor() {
      super('LoseScene3');
  }

  init(data) {
      this.finalScore = data.score;
      data.score = 0;
  }

  create() {
    localStorage.setItem('csKey', 'GameScene8');
    //let crrsc = localStorage.getItem('csKey');
    //let lastval = parseInt(crrsc[-1]) + 1;
      const { width, height } = this.scale;
      this.add.text(width / 2, height / 2, `Oops!! You Lose! \n Total Ripe Oranges Picked: ${this.finalScore} \n You need to Win this level \n before moving to the next level \n Tap the screem to continue`, {
          fontSize: '48px',
          fill: '#f00',
          align: 'center'
      }).setOrigin(0.5);

      this.input.once('pointerdown', () => {
          backGroundMusic = this.sound.add('bg-music', { loop: true, volume: 0.5 });
          this.scene.start('GameScene8');
      });
  }
}



class WinScene3 extends Phaser.Scene {
  constructor() {
      super('WinScene3');
  }

  init(data) {
      this.finalScore = data.score;
      data.score = 0;
  }

  create() {
    localStorage.setItem('csKey', 'GameScene8');
    //let crrsc = localStorage.getItem('csKey');
    //let lastval = parseInt(crrsc[-1]) + 1;
    //let crrsc[-1] = lastval;
      const { width, height } = this.scale;
      this.add.text(width / 2, height / 2, `Congratulations, You Win! \n Total Oranges Picked: ${this.finalScore} \n You need to perform another task \n before moving to the next level \n Tap the screen to continue`, {
          fontSize: '48px',
          fill: '#ffff00',
          align: 'center'
      }).setOrigin(0.5);

      this.input.once('pointerdown', () => {
          this.scene.start('GameScene8');
      });
  }
}













if(currentScene ==='LoseScene3'){
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
    scene: [AssetsScene, LoseScene3],
    audio: {
      disableWebAudio: false
    }
  };
}
else if(currentScene ==='WinScene3'){
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
    scene: [AssetsScene, WinScene3, LoseScene3],
    audio: {
      disableWebAudio: false
    }
  };
}
else if(currentScene ==='GameScene7'){
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
    scene: [AssetsScene, GameScene7, WinScene3, LoseScene3],
    audio: {
      disableWebAudio: false
    }
  };
}
else if(currentScene ==='GameScene6'){
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
    scene: [AssetsScene, GameScene6, GameScene7, WinScene3, LoseScene3],
    audio: {
      disableWebAudio: false
    }
  };
}
else if(currentScene ==='LoseScene2'){
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
    scene: [AssetsScene, LoseScene2, GameScene6, GameScene7, WinScene3, LoseScene3],
    audio: {
      disableWebAudio: false
    }
  };
}
else if(currentScene ==='WinScene2'){
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
    scene: [AssetsScene, WinScene2, LoseScene2, GameScene6, GameScene7, WinScene3, LoseScene3],
    audio: {
      disableWebAudio: false
    }
  };
}
else if(currentScene ==='GameScene5'){
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
    scene: [AssetsScene, GameScene5, WinScene2, LoseScene2, GameScene6, GameScene7, WinScene3, LoseScene3],
    audio: {
      disableWebAudio: false
    }
  };
}
else if(currentScene ==='GameScene4'){
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
    scene: [AssetsScene, GameScene4, GameScene5, WinScene2, LoseScene2, GameScene6, GameScene7, WinScene3, LoseScene3],
    audio: {
      disableWebAudio: false
    }
  };
}
else if(currentScene ==='LoseScene1'){
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
    scene: [AssetsScene, LoseScene1, GameScene4, GameScene5, WinScene2, LoseScene2, GameScene6, GameScene7, WinScene3, LoseScene3],
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
    scene: [AssetsScene, WinScene1, LoseScene1, GameScene4, GameScene5, WinScene2, LoseScene2, GameScene6, GameScene7, WinScene3, LoseScene3],
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
    scene: [AssetsScene, GameScene3, WinScene1, LoseScene1, GameScene4, GameScene5, WinScene2, LoseScene2, GameScene6, GameScene7, WinScene3, LoseScene3],
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
    scene: [AssetsScene, GameScene2, GameScene3, WinScene1, LoseScene1, GameScene4, GameScene5, WinScene2, LoseScene2, GameScene6, GameScene7, WinScene3, LoseScene3],
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
    scene: [AssetsScene, GameScene1, GameScene2, GameScene3, WinScene1, LoseScene1, GameScene4, GameScene5, WinScene2, LoseScene2, GameScene6, GameScene7, WinScene3, LoseScene3],
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
    scene: [AssetsScene, WelcomeScene, GameScene1, GameScene2, GameScene3, WinScene1, LoseScene1, GameScene4, GameScene5, WinScene2, LoseScene2, GameScene6, GameScene7, WinScene3, LoseScene3],
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
    scene: [AssetsScene, BootScene, WelcomeScene, GameScene1, GameScene2, GameScene3, WinScene1, LoseScene1, GameScene4, GameScene5, WinScene2, LoseScene2, GameScene6, GameScene7, WinScene3, LoseScene3],
    audio: {
      disableWebAudio: false
    }
  };
}


//new Phaser.Game(config);
const game = new Phaser.Game(config);

console.log(currentScene);