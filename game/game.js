let player;
let cursors;
let bullets;
let enemies;
let score = 0;
let scoreText;

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: { default: 'arcade' },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('player', '../assets/player.png');
  this.load.image('enemy', '../assets/enemy.png');
  this.load.image('bullet', '../assets/bullet.png');
  this.load.image('bg', '../assets/background.jpg');
}

function create() {
  this.add.image(400, 300, 'bg');

  player = this.physics.add.sprite(400, 500, 'player');
  bullets = this.physics.add.group();
  enemies = this.physics.add.group();
  cursors = this.input.keyboard.createCursorKeys();

  scoreText = this.add.text(16, 16, 'Kills: 0', { fontSize: '32px', fill: '#fff' });

  this.input.keyboard.on('keydown-SPACE', () => {
    const bullet = bullets.create(player.x, player.y - 20, 'bullet');
    bullet.setVelocityY(-400);
  });

  for (let i = 0; i < 10; i++) {
    const x = Phaser.Math.Between(50, 750);
    const y = Phaser.Math.Between(50, 300);
    const enemy = enemies.create(x, y, 'enemy');
    enemy.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
    enemy.setBounce(1);
    enemy.setCollideWorldBounds(true);
  }

  this.physics.add.overlap(bullets, enemies, shootEnemy, null, this);
}

function update() {
  if (cursors.left.isDown) player.setVelocityX(-200);
  else if (cursors.right.isDown) player.setVelocityX(200);
  else player.setVelocityX(0);
}

function shootEnemy(bullet, enemy) {
  bullet.destroy();
  enemy.destroy();
  score++;
  scoreText.setText('Kills: ' + score);

  if (score >= 10) {
    alert("🎉 You win!");
    location.reload();
  }
}
