
//this is just configuring a screen size to fit the game properly
//to the browser
canvas_width = window.innerWidth * window.devicePixelRatio; 
canvas_height = window.innerHeight * window.devicePixelRatio;

 game = new Phaser.Game(canvas_width,canvas_height, Phaser.CANVAS,
    'gameDiv');

 var gameState = new Phaser.Stage(game);


var gameProperties = { 
	//this is the actual game size to determine the boundary of 
	//the world
	gameWidth: 8000, 
	gameHeight: 8000,
};

//espera a colision
var collision = false;
var rec;
var circle;
var totalTimer;
var barrer;
var anim;
// this is the main game state
var main = function(game){
};
// add the 
main.prototype = {
	preload: function() {
					game.load.image("background", "sprites/space.png");
					game.load.image("shipCircle", "sprites/descarga.png");
					game.load.image("barrera", "sprites/barrera.png");
					game.load.atlasJSONHash('barrer', 'sprites/barrer.png', 'sprites/barrer.json');
		 			gameState.stage.disableVisibilityChange = true;
					game.load.atlasJSONHash('ship0', 'sprites/shipRound.png', 'sprites/shipRound.json');
			
					game.load.atlasJSONHash('ship1', 'sprites/shipCone.png', 'sprites/shipCone.json');
				
					game.load.atlasJSONHash('ship2', 'sprites/shipSpear1.png', 'sprites/shipSpear.json');
					
					game.load.atlasJSONHash('bullet', 'sprites/bullet1.png', 'sprites/bullet1.json');

					game.load.physics("shipConeCollide", "sprites/shipConeCollide.json");
					game.load.physics("shipRoundCollide", "sprites/shipRoundCollide.json");
				    game.load.physics("shipSpearCollide", "sprites/shipSpearCollide.json");

					game.load.spritesheet('veggies', 'sprites/veggie.png', 64, 64);
					//game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
					this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
					this.game.scale.setShowAll();
					window.addEventListener('resize', function () { 
						console.log("resize");
						w = window.innerWidth * window.devicePixelRatio; 
						h = window.innerHeight * window.devicePixelRatio; 
						game.scale.setGameSize(w, h);
						this.game.scale.refresh();});
					this.game.scale.refresh();
		
    },
	//this function is fired once when we load the game
	create: function () {
		gameState.stage.disableVisibilityChange = true;
		console.log("client started");
		//listen to the “connect” message from the server. The server 
		//automatically emit a “connect” message when the cleint connets.When 
		//the client connects, call onsocketConnected.  
		//socket.on("connect", onsocketConnected); 
		    text = game.add.text(game.world.centerX, game.world.centerY, '', { font: "64px Arial", fill: "#ffffff", align: "center"}); 
			text.anchor.setTo(0.5, 0.5);
			game.physics.startSystem(Phaser.Physics.P2JS);
			resizePolygon('shipConeCollide', 'scaleCone', 'shipCone', 0.25,254,240);
			resizePolygon('shipRoundCollide', 'scaleRound', 'shipRound', 0.25,192,190);
			resizePolygon('shipSpearCollide', 'scaleSpear', 'shipSpear', 0.25,190,190);
		    if(player.rol==0){
				ship = game.add.sprite(player.posicionX, player.posicionY, 'ship0');
				ship2 = game.add.sprite(players[1].posicionX, players[1].posicionY, 'ship1');
				ship3 = game.add.sprite(players[2].posicionX, players[2].posicionY, 'ship2');
				game.physics.p2.enable(ship, true);
				game.physics.p2.enable(ship2, true);
				game.physics.p2.enable(ship3, true);
				ship.body.clearShapes();
				ship2.body.clearShapes();
				ship3.body.clearShapes();
				ship.body.loadPolygon("scaleRound", "shipRound");
				ship2.body.loadPolygon("scaleCone", "shipCone");
				ship3.body.loadPolygon("scaleSpear", "shipSpear");
				ship.body.idPlayer = player.id;
				ship2.body.idPlayer = players[1].id;
				ship3.body.idPlayer = players[2].id;

			
			}
			if(player.rol==1){
				ship = game.add.sprite(player.posicionX, player.posicionY, 'ship1');
				ship2 = game.add.sprite(players[0].posicionX, players[0].posicionY, 'ship0');
				ship3 = game.add.sprite(players[2].posicionX, players[2].posicionY, 'ship2');
				game.physics.p2.enable(ship, true);
				game.physics.p2.enable(ship2, true);
				game.physics.p2.enable(ship3, true);
				ship.body.clearShapes();
				ship2.body.clearShapes();
				ship3.body.clearShapes();
				ship.body.loadPolygon("scaleCone", "shipCone");
				ship2.body.loadPolygon("scaleRound", "shipRound");
				ship3.body.loadPolygon("scaleSpear", "shipSpear");
				ship.body.idPlayer = player.id;
				ship2.body.idPlayer = players[0].id;
				ship3.body.idPlayer = players[2].id;
			
			}
			
			if(player.rol==2){	
				ship = game.add.sprite(player.posicionX, player.posicionY, 'ship2');
				ship2 = game.add.sprite(players[1].posicionX, players[1].posicionY, 'ship1');
				ship3 = game.add.sprite(players[0].posicionX, players[0].posicionY, 'ship0');
				
				game.physics.p2.enable(ship, true);
				game.physics.p2.enable(ship2, true);
				game.physics.p2.enable(ship3, true);
				ship.body.clearShapes();
				ship2.body.clearShapes();
				ship3.body.clearShapes();
				
				ship.body.loadPolygon("scaleSpear", "shipSpear");
				ship2.body.loadPolygon("scaleCone", "shipCone");
				ship3.body.loadPolygon("scaleRound", "shipRound");
				ship.body.idPlayer = player.id;
				ship2.body.idPlayer = players[1].id;
				ship3.body.idPlayer = players[0].id;
				
		    }
			
			ship.body.setZeroDamping();
			ship.body.fixedRotation = true;
			ship2.body.setZeroDamping();
			ship2.body.fixedRotation = true;
			ship3.body.setZeroDamping();
			ship3.body.fixedRotation = true;
		
		var walk = ship.animations.add('walk');
		var walk2 = ship2.animations.add('walk');
		var walk3 = ship3.animations.add('walk');
		 //  Creates 30 bullets, using the 'bullet' graphic
		weapon = game.add.weapon(1, 'bullet');
		
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
		ship2.anchor.setTo(0.5, 0.5);
		ship2.scale.setTo(0.25, 0.25);
		ship3.anchor.setTo(0.5, 0.5);
		ship3.scale.setTo(0.25, 0.25);
		// ship2.anchor.setTo(0.5, 0.5);
		// ship2.scale.setTo(0.25, 0.25);
		// ship3.anchor.setTo(0.5, 0.5);
		// ship3.scale.setTo(0.25, 0.25);
			//  And this starts the animation playing by using its key ("walk")
			//  30 is the frame rate (30fps)
			//  true means it will loop when it finishes
	
		
		//ship2.animations.play('walk', 10, true);
		//ship2.animations.play('walk', 10, true);
		//ship3.animations.play('walk', 10, true);
		
		totalTimer = 10;

		//true indica que se mueve con la rotacion
		weapon.trackSprite(ship, 0, 0, true);
		weapon.trackOffset.y = 50;
		weapon.trackOffset.x = 0;
		
		
		//camera
		game.camera.follow(ship, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
		
		//game.add.image(game.world.centerX, game.world.centerY, 'background');
		//CREANDO LA BASE
		ship.animations.play('walk', 10, true);
		ship2.animations.play('walk', 10, true);
		ship3.animations.play('walk', 10, true);
			ship.kinematic = true;
			ship2.kinematic = true;
			ship3.kinematic = true;
		//barrer = game.add.sprite(1986, 2700, 'barrer');
		//anim = barrer.animations.add('barrerWalk');

		var barrera = game.add.image(1986, 2700, 'barrer');
		anim1 = barrera.animations.add('barrerWalk');
		var barrera2 = game.add.image(1986, 2435, 'barrer');
		anim2 = barrera2.animations.add('barrerWalk');
		var barrera3 = game.add.image(1666, 2400, 'barrer');
		anim3 = barrera3.animations.add('barrerWalk');
		var barrera4 = game.add.image(1426, 2400, 'barrer');
		anim4 = barrera4.animations.add('barrerWalk');

		var barrera5 = game.add.image(1186, 2400, 'barrer');
		anim5 = barrera5.animations.add('barrerWalk');
		var barrera6 = game.add.image(946, 2400, 'barrer');
		anim6 = barrera6.animations.add('barrerWalk');

		var barrera7 = game.add.image(960, 2700, 'barrer');
		anim7 = barrera7.animations.add('barrerWalk');
		var barrera8 = game.add.image(960, 2435, 'barrer');
		anim8 = barrera8.animations.add('barrerWalk');

		barrera.angle = 90;
		barrera.width = 280;
		barrera2.width = 300;
		barrera2.angle = 90;
		barrera7.angle = 90;
		barrera8.angle = 90;
		barrera7.width = 280;
		barrera8.width = 300;
		barrera3.width = 282;
		barrera4.width = 282;
		barrera5.width = 282;
		barrera6.width = 282;
	
		//MiniMap
		var graphics = game.add.graphics(100, 100);
		graphics.beginFill(0x000000, 1);
		graphics.lineStyle(2, 0x0000FF, 1);
		if(game.camera.width>1400)
			rec =graphics.drawRect(game.camera.x+(game.camera.width/1.27), game.camera.y+(window.innerHeight/1.808), 200, 200);
		else
			rec =graphics.drawRect(game.camera.x+(game.camera.width/1.4), game.camera.y+(window.innerHeight/1.808), 200, 200);
		
		graphics.endFill();
		graphics.fixedToCamera = true;
		game.world.sendToBack(graphics);
		// graphics.beginFill(0xff0000);
		// circle = graphics.drawCircle((game.camera.x+1100)+(ship.body.x/14.38), (game.camera.y+450)+(ship.body.y/14.5), 10);
		// graphics.endFill();+(ship.body.x/14.38)+(ship.body.y/14.5)
		
		shipCircle = game.add.sprite(game.camera.x+(game.camera.width/1.27), game.camera.y+(window.innerHeight/1.808), 'shipCircle');
		shipCircle.scale.setTo(0.01, 0.01);
		shipCircle2 = game.add.sprite(game.camera.x+(game.camera.width/1.27), game.camera.y+(window.innerHeight/1.808), 'shipCircle');
		shipCircle2.scale.setTo(0.01, 0.01);
		shipCircle3 = game.add.sprite(game.camera.x+(game.camera.width/1.27), game.camera.y+(window.innerHeight/1.808), 'shipCircle');
		shipCircle3.scale.setTo(0.01, 0.01);
		//shipCircle.fixedToCamera = true;

		cursors = game.input.keyboard.createCursorKeys();
		ship.body.onBeginContact.add(blockHit, this);
		ship.body.onEndContact.add(blockHitEnd, this);
		ship.body.allowSleep = false;
		ship2.body.allowSleep = false;
		ship3.body.allowSleep = false;
		tileSprite = game.add.tileSprite(0, 0, 8000, 8000, 'background');
		game.world.sendToBack(tileSprite);
		window.graphics = graphics;
		//fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		
		// timer = game.time.create(false);
		// console.log(timer);
		// if(totalTimer>0){
		// 	timer.loop(1000, updateCounter, this);
		// 	timer.start(); 
		// 	text.fixedToCamera = true; 
		// }


		// veggies = game.add.group();
		// veggies.enableBody = true;
		// veggies.physicsBodyType = Phaser.Physics.P2JS;
	
		// var vegFrames = [ 1, 3, 4, 8 ];
	
		// for (var i = 0; i < 25; i++)
		// {
		// 	var veg = veggies.create(game.world.randomX, game.world.randomY, 'veggies', game.rnd.pick(vegFrames));
		// 	veg.body.setCircle(26);
		// 	veg.body.kinematic=true;
			
		// }
		console.log(game.camera.height);
		console.log(game.camera.width);

	},

	update: function() {
		
		ship.body.setZeroVelocity();
		ship2.body.setZeroVelocity();
		ship3.body.setZeroVelocity();
		ship.body.setZeroDamping();
		ship.body.setZeroForce();
		ship.body.setZeroRotation();
		ship2.body.setZeroDamping();
		ship2.body.setZeroForce();
		ship2.body.setZeroRotation();
		ship3.body.setZeroDamping();
		ship3.body.setZeroForce();
		ship3.body.setZeroRotation();
		

		//MOVIMIENTO DE MINIMAP
		if(game.camera.width>1400){
			shipCircle.x = game.camera.x+(game.camera.width/1.27)+100+(ship.body.x/14.38)-5;
			shipCircle.y = game.camera.y+(game.camera.height/1.808)+100+(ship.body.y/14.5);
			
			if(ship2.body.x>-100){
		    shipCircle2.x = game.camera.x+(game.camera.width/1.27)+100+(ship2.body.x/14.38)-5;
			shipCircle2.y = game.camera.y+(game.camera.height/1.808)+100+(ship2.body.y/14.5);
			}else{shipCircle2.alpha=0;}
			if(ship3.body.x>-100){
			shipCircle3.x = game.camera.x+(game.camera.width/1.27)+100+(ship3.body.x/14.38)-5;
			shipCircle3.y = game.camera.y+(game.camera.height/1.808)+100+(ship3.body.y/14.5);
			}else{shipCircle3.alpha=0;}
		}
		else{
			shipCircle.x = game.camera.x+(game.camera.width/1.4)+100+(ship.body.x/14.38)-5;
			shipCircle.y = game.camera.y+(game.camera.height/1.808)+100+(ship.body.y/14.5);
			if(ship2.body.x>-100){
				shipCircle2.x = game.camera.x+(game.camera.width/1.4)+100+(ship2.body.x/14.38)-5;
				shipCircle2.y = game.camera.y+(game.camera.height/1.808)+100+(ship2.body.y/14.5);
			}else{shipCircle2.alpha=0;}
			if(ship3.body.x>-100){
				shipCircle3.x = game.camera.x+(game.camera.width/1.4)+100+(ship3.body.x/14.38)-5;
				shipCircle3.y = game.camera.y+(game.camera.height/1.808)+100+(ship3.body.y/14.5);
			}else{shipCircle3.alpha=0;}
		}
		
		//MOVIMIENTOD E LAS BALAS
		 if(balasSpriteMatch!=null)
		 for(i=0;i<balasSpriteMatch.length;i++)
		 {
			 if(balasSpriteMatch[i]!=null && balasMatch[i]!=null){
				 if(balasSpriteMatch[i].body!=null){
					balasSpriteMatch[i].body.x = balasMatch[i].x;
					balasSpriteMatch[i].body.y = balasMatch[i].y;
				 }
			 }
			 else{
				balasSpriteMatch[i].body.x =-20;
				balasSpriteMatch[i].body.y =-20;
			 }
		 }
		if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
		{  
			//game.physics.arcade.accelerationFromRotation(ship.rotation, 300, ship.acceleration);
			
			if(ship.body.x >100 && collision ==false)
			 { startTime = Date.now();
				//ship.body.x -=4;	
				socket.emit('movement', 'left');
			 }
		}
		else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
		{
			if(ship.body.x < 2876 && collision ==false)
			{
				//ship.body.x +=4;
				startTime = Date.now();
				
				socket.emit('movement', 'right');
			}
		}
	
		if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
		{
			if(ship.body.y >100 && collision ==false)
			{   
				startTime = Date.now();
				//ship.body.y -=4;
				socket.emit('movement', 'up');
			}
		}
		else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
		{
			
			if(ship.body.y < 2900 && collision ==false)
			{ startTime = Date.now();
				
				
				//ship.body.y +=4;
				socket.emit('movement', 'down');
			}
		}
		ship.body.rotation = game.physics.arcade.angleToPointer(ship)+1.5;
		ship.rotation = game.physics.arcade.angleToPointer(ship)+1.5;
		//todo tocar aqui
		document.getElementById("gameDiv").onmousemove = function(event) {//console.log( game.time.elapsed / 1000);
			socket.emit('rotation', ship.rotation);
		};

	
		  //fire in here}, this);
		//Actualizacion de enemigos
	
			if(player.rol==0){
				if((players[0]!=null))
				{
					
					// console.log(game.time.now-game.time.prevTime);
					// console.log("game.time.now-game.time.prevTime");

					
					// console.log(players[0].posicionX);
				
					ship.body.x = players[0].posicionX;
					ship.body.y = players[0].posicionY;
					//if(24<players[0].posicionX-ship.body.x){
					//tween = game.add.tween(ship.body).to( { x: players[0].posicionX, y: players[0].posicionY }, 100, "Sine.easeInOut");
					//tween.interpolation(Phaser.Math.bezierInterpolation);
					//tween.start();
					
					//tween.onLoop.add(changeMethod, this);
				}
				else{ship.body.x=-200;}
					if(players[1] !=null)
					{
						ship2.rotation = players[1].rotation;
						ship2.body.rotation = players[1].rotation;
						ship2.body.x = players[1].posicionX;
						ship2.body.y = players[1].posicionY;
					}
					else{ship2.body.x=-200;}
					if(players[2] !=null)
					{
						ship3.body.x = players[2].posicionX;
						ship3.body.y = players[2].posicionY;
						ship3.rotation = players[2].rotation;
						ship3.body.rotation = players[2].rotation;
					}
					else{ship3.body.x=-200;}
			
			}

			
			if(player.rol == 1){
				if(players[1]!= null)
				{
					ship.body.x = players[1].posicionX;
					ship.body.y = players[1].posicionY;
				}
				else{ship.body.x=-200;}
				if(players[0]!=null)
				{
					
					ship2.body.x = players[0].posicionX;
					ship2.body.y = players[0].posicionY;
					ship2.body.rotation = players[0].rotation;
					ship2.rotation = players[0].rotation;
				}
				else{ship2.body.x=-200;}
				if(players[2]!=null){
					ship3.body.x = players[2].posicionX;
					ship3.body.y = players[2].posicionY;
					ship3.rotation = players[2].rotation;
					ship3.body.rotation = players[2].rotation;
				}
				else{ship3.body.x=-200;}
			}
			


			if(player.rol==2){	
				if(players[2]!=null){
					ship.body.x = players[2].posicionX;
					ship.body.y = players[2].posicionY;		
				}
				else{ship.body.x=-200;}

					if(players[1]!=null){
						ship2.body.x = players[1].posicionX;
						ship2.body.y = players[1].posicionY;
						ship2.rotation = players[1].rotation;
						ship2.body.rotation = players[1].rotation;
					}
					else{ship2.body.x=-200;}
					if(players[0]!=null){
						ship3.body.x = players[0].posicionX;
						ship3.body.y = players[0].posicionY;
						ship3.rotation = players[0].rotation;
						ship3.body.rotation = players[0].rotation;
			     	}
				else{ship3.body.x=-200;}
			}
			//console.log(circle);
	   
	   text.x = game.camera.view.centerX;
	   text.y = game.camera.view.centerY;
	   
	},
	
}


// this function is fired when we connect
function onsocketConnected ()
{
	console.log("connected to server"); 
	
}
function shotOne () {
	socket.emit('fireBullet');
	console.log(balasMatch);
}
function shotTwo () {
	console.log("special");
	socket.emit('secondSkill');	
}

function blockHit (body, bodyB, shapeA, shapeB, equation) {	
console.log("hit");
		collision = true;
	}

	function blockHitEnd (body, bodyB, shapeA, shapeB, equation) {
		console.log("hitEnd");
		collision = false;	
	}

	var i = setInterval(function(){
		totalTimer--;
		text.setText('Empieza en: ' + totalTimer +'!');
		if(totalTimer==0)
		{
			anim1.play(10, false);
			anim2.play(10, false);
			anim3.play(10, false);
			anim4.play(10, false);
			anim5.play(10, false);
			anim6.play(10, false);
			anim7.play(10, false);
			anim8.play(10, false);
			text.destroy();
			key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
			key1.onDown.add(shotOne, this);
			key2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
			key2.onDown.add(shotTwo, this);
			setInterval(i);
		}
	}, 1000);

function resizePolygon(originalPhysicsKey, newPhysicsKey, shapeKey, scale, moveX, moveY){
	var newData = [];
	var data = this.game.cache.getPhysicsData(originalPhysicsKey, shapeKey);
 
	for (var i = 0; i < data.length; i++) {
		var vertices = [];
 
		for (var j = 0; j < data[i].shape.length; j += 2) {
			
		   
		   vertices[j] = (data[i].shape[j] * scale)+moveX;
		   vertices[j+1] = (data[i].shape[j+1] * scale)+moveY; 
		}
 
		newData.push({shape : vertices});
	}
 
	var item = {};
	item[shapeKey] = newData;
	game.load.physics(newPhysicsKey, '', item);
 
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