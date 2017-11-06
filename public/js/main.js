

//this is just configuring a screen size to fit the game properly
//to the browser
canvas_width = window.innerWidth * window.devicePixelRatio; 
canvas_height = window.innerHeight * window.devicePixelRatio;

//make a phaser game
game = new Phaser.Game(canvas_width,canvas_height, Phaser.CANVAS,
 'gameDiv');

var gameProperties = { 
	//this is the actual game size to determine the boundary of 
	//the world
	gameWidth: 8000, 
	gameHeight: 8000,
};

// this is the main game state
var main = function(game){
};
// add the 
main.prototype = {
	preload: function() {
		game.load.image("background", "http://gametest.mobi/phaser095/assets/pics/aya_touhou_teng_soldier.png");
		if(player.team == 0){
			switch(player.rol){
				case 0:	
					game.load.atlasJSONHash('ship', 'sprites/shipRound.png', 'sprites/shipRound.json');
					game.load.atlasJSONHash('bullet', 'sprites/bullet1.png', 'sprites/bullet1.json');
					break
				case 1:
					game.load.atlasJSONHash('ship', 'sprites/shipCone.png', 'sprites/shipCone.json');
					game.load.atlasJSONHash('bullet', 'sprites/bullet1.png', 'sprites/bullet1.json');
					break
				case 2:
					game.load.atlasJSONHash('ship', 'sprites/shipSpear1.png', 'sprites/shipSpear.json');
					game.load.atlasJSONHash('bullet', 'sprites/bullet1.png', 'sprites/bullet1.json');
					break
			}
		}
		
    },
	//this function is fired once when we load the game
	create: function () {
		console.log("client started");
		//listen to the “connect” message from the server. The server 
		//automatically emit a “connect” message when the cleint connets.When 
		//the client connects, call onsocketConnected.  
		//socket.on("connect", onsocketConnected); 
		ship = game.add.sprite(player.posicionX, player.posicionY, 'ship');
		var walk = ship.animations.add('walk');

		 //  Creates 30 bullets, using the 'bullet' graphic
		weapon = game.add.weapon(30, 'bullet');
		
			//  The bullet will be automatically killed when it leaves the world bounds
		weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
	
		//  The speed at which the bullet is fired
		weapon.bulletSpeed = 600;
	
		//  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
		weapon.fireRate = 100;
		
		//se redimensiona el mapa pero es obligatorio para la camara
		game.world.setBounds(0, 0, 3000, 3000);
		ship.anchor.setTo(0.5, 0.5);
		ship.scale.setTo(0.25, 0.25);
			//  And this starts the animation playing by using its key ("walk")
			//  30 is the frame rate (30fps)
			//  true means it will loop when it finishes
		ship.animations.play('walk', 10, true);
		cursors = game.input.keyboard.createCursorKeys();
		fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

		//true indica que se mueve con la rotacion
		weapon.trackSprite(ship, 0, 0, true);
		//camera
		game.camera.follow(ship, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
		game.add.image(game.world.centerX, game.world.centerY, 'background');

	},

	update: function() {
		if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
		{
			ship.x -= 4;
			//game.physics.arcade.accelerationFromRotation(ship.rotation, 300, ship.acceleration);
			socket.emit('movement', 'left');
		}
		else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
		{
			ship.x += 4;
			socket.emit('movement', 'right');
		}
	
		if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
		{
			ship.y -= 4;
			socket.emit('movement', 'up');
			console.log("up");
		}
		else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
		{
			ship.y += 4;
			socket.emit('movement', 'down');
		}
		ship.rotation = game.physics.arcade.angleToPointer(ship)+1.5;
		//todo tocar aqui
		document.getElementById("gameDiv").onmousemove = function(event) {//console.log( game.time.elapsed / 1000);
			socket.emit('rotation', ship.rotation);
		};

		if (fireButton.isDown)
		{
			weapon.fire();
		}
		
    },
}

// this function is fired when we connect
function onsocketConnected ()
{
	console.log("connected to server"); 
	
}

// wrap the game states.
var gameBootstrapper = {
    init: function(gameContainerElementId){
		game.state.add('main', main);
		game.state.start('main'); 
    }
};;

//call the init function in the wrapper and specifiy the division id 
gameBootstrapper.init("gameDiv");