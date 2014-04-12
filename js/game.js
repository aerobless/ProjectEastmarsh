//Game settings
var fixedWidth = 1000;
var fixedHeight = 700;

//Actual render size
var game = new Phaser.Game(fixedWidth, fixedHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });

//Load assets, setup window
function preload() {
    //Getting actual window info from jQuery
    var actualHeight = $(window).height();
    var actualWidth = $(window).width();

    //Scaling to window size (as long as it can still draw everything)
    game.scale.maxWidth = actualHeight;
    game.scale.maxHeight = actualWidth;

    //  Then we tell Phaser that we want it to scale up to whatever the browser can handle, but to do it proportionally
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setScreenSize();

    //Load assets
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/bloodcrystal.png');
    game.load.spritesheet('player', 'assets/player.png', 32, 48);
}

var player;
var platforms;
var cursors;
var stars;
var score = 0;
var scoreText;

//Create the environment etc.
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.stage.backgroundColor = '#59ABE3';

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();
    platforms.enableBody = true;

    //Floor
    var ground = platforms.create(0, game.world.height - 30, 'ground');
    ground.scale.setTo(10, 1);
    ground.body.immovable = true;

    var ledge = platforms.create(200, 500, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'player');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Stars
    stars = game.add.group();
    stars.enableBody = true;

    for (var i = 0; i < 12; i++)
    {
        var star = stars.create(i * 70, 0, 'star');
        star.body.gravity.y = 600;
        star.body.bounce.y = 0.3 + Math.random() * 0.2;
        star.scale.setTo(0.3, 0.3);
    }
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //Controls
    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;
        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;
        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();
        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }
}

function collectStar (player, star) {
    star.kill();
    score += 10;
    scoreText.text = 'Score: ' + score;
}