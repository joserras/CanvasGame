

//this is just configuring a screen size to fit the game properly
//to the browser
canvas_width = window.innerWidth * window.devicePixelRatio; 
canvas_height = window.innerHeight * window.devicePixelRatio;
//YOU
var ship;
var cursors;
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

		game.load.atlasJSONHash('ship', 'sprites/shipRound.png', 'sprites/shipRound.json');
		game.load.image("background", "http://gametest.mobi/phaser095/assets/pics/aya_touhou_teng_soldier.png");
		
		
    },
	//this function is fired once when we load the game
	create: function () {
		console.log("client started");
		//listen to the “connect” message from the server. The server 
		//automatically emit a “connect” message when the cleint connets.When 
		//the client connects, call onsocketConnected.  
		//socket.on("connect", onsocketConnected); 
		ship = game.add.sprite(game.world.centerX, game.world.centerY, 'ship');
		var walk = ship.animations.add('walk');
		//se redimensiona el mapa pero es obligatorio para la camara
		game.world.setBounds(0, 0, 3000, 3000);
		ship.anchor.setTo(0.5, 0.5);
		ship.scale.setTo(0.25, 0.25);
			//  And this starts the animation playing by using its key ("walk")
			//  30 is the frame rate (30fps)
			//  true means it will loop when it finishes
		ship.animations.play('walk', 10, true);
		cursors = game.input.keyboard.createCursorKeys();

		//camera
		game.camera.follow(ship, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
		game.add.image(game.world.centerX, game.world.centerY, 'background');

	},

	update: function() {

		if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
		{
			ship.x -= 4;
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
		

    },
}

// this function is fired when we connect
function onsocketConnected () {
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