
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
var barraSalud;
var barraEspecial;
var circle;
var totalTimer;
var barrer;
var anim;
var barraHP;
var barWinRed;
var barWinBlue;
var barraES;
var HPTotal;
var HPActual;
var pointBarBlue;
var pointBarRed;
// this is the main game state
var main = function(game){
};
// add the 
main.prototype = {
	preload: function() {
					game.load.image("background", "sprites/space.png");
					game.load.image("shipCircle", "sprites/descarga.png");
					game.load.image("barrera", "sprites/barrera.png");
					game.load.image("miniMap", "sprites/miniMap.jpg");
					game.load.image("platformGray", "sprites/platformGray.png");
					game.load.image("platformRed", "sprites/platformRed.png",);
					game.load.image("platformBlue", "sprites/platformBlue.png");
					game.load.image("barraSalud", "sprites/salud.png");
				    game.load.image("barraES", "sprites/es.png");
					game.load.image("barraHP", "sprites/hp.png");
					game.load.image("winBarRed", "sprites/PointBar1.png");
					game.load.image("winBarBlue", "sprites/winBar2.png");
					game.load.image("pointBarBlue", "sprites/pointBarBlue.png");
					game.load.image("pointBarRed", "sprites/pointBarRed.png");
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
						w = window.innerWidth * window.devicePixelRatio; 
						h = window.innerHeight * window.devicePixelRatio; 
						game.scale.setGameSize(w, h);
						this.game.scale.refresh();
					});
					this.game.scale.refresh();
		  			game.time.advancedTiming = true;
		
    },
	//this function is fired once when we load the game
	create: function () {
		//render on loss focus
		gameState.stage.disableVisibilityChange = true;
		//star physics
		game.physics.startSystem(Phaser.Physics.P2JS);
		console.log("client started");

		game.physics.p2.setPostBroadphaseCallback(checkBullet, this);
		//PLATFORMS
		 platformLeft = game.add.sprite(350,560, 'platformGray');
		 platformRight = game.add.sprite(1800,1500 ,'platformGray');
		 platformLeft.scale.setTo(0.5, 0.5);
		 platformRight.scale.setTo(0.5, 0.5);

		

		//MINIMAP and HUD
		rec = game.add.sprite(player.posicionX, player.posicionY, 'miniMap');
		rec.width = 200;
		rec.height = 200;
		barraSalud = game.add.sprite(player.posicionX, player.posicionY, 'barraSalud');
		barraSalud.width = 200;
		barraSalud.height = 100;
		barraEspecial = game.add.sprite(player.posicionX, player.posicionY, 'barraSalud');
		barraEspecial.width = 200;
		barraEspecial.height = 100;
		barraES = game.add.sprite(player.posicionX, player.posicionY, 'barraES');
		barraES.width = 94;
		barraES.height = 16;
		barraES.alpha = 0.8;
		barraHP = game.add.sprite(player.posicionX, player.posicionY, 'barraHP');
		barraHP.width = 94;
		barraHP.height = 16;
		barWinRed = game.add.sprite(player.posicionX, player.posicionY, 'winBarRed');
		barWinRed.width = 400;
		barWinRed.height = 100;
		barWinBlue = game.add.sprite(player.posicionX, player.posicionY, 'winBarBlue');
		barWinBlue.width = 400;
		barWinBlue.height = 100;
		pointBarRed = game.add.sprite(player.posicionX, player.posicionY, 'pointBarRed');
		pointBarRed.width = 239;
		pointBarRed.height = 15;
		pointBarBlue = game.add.sprite(player.posicionX, player.posicionY, 'pointBarBlue');
		pointBarBlue.width = 239;
		pointBarBlue.height = 15;
		


		shipCircle = game.add.sprite(game.camera.x+(game.camera.width/1.27), game.camera.y+(window.innerHeight/1.808), 'shipCircle');
		shipCircle.scale.setTo(0.01, 0.01);
		shipCircle2 = game.add.sprite(game.camera.x+(game.camera.width/1.27), game.camera.y+(window.innerHeight/1.808), 'shipCircle');
		shipCircle2.scale.setTo(0.01, 0.01);
		shipCircle3 = game.add.sprite(game.camera.x+(game.camera.width/1.27), game.camera.y+(window.innerHeight/1.808), 'shipCircle');
		shipCircle3.scale.setTo(0.01, 0.01);


		//listen to the “connect” message from the server. The server 
		//automatically emit a “connect” message when the cleint connets.When 
		//the client connects, call onsocketConnected.  
		//socket.on("connect", onsocketConnected); 
		    text = game.add.text(game.world.centerX, game.world.centerY, '', { font: "64px Arial", fill: "#ffffff", align: "center"}); 
			text.anchor.setTo(0.5, 0.5);
			
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
		//CREANDO LA BASE
		ship.animations.play('walk', 10, true);
		ship2.animations.play('walk', 10, true);
		ship3.animations.play('walk', 10, true);
			
		//barrer = game.add.sprite(1986, 2700, 'barrer');
		//anim = barrer.animations.add('barrerWalk');

		var barreraBlue = game.add.image(1986, 0, 'barrer');
		animBlue1 = barreraBlue.animations.add('barrerWalk');
		var barreraBlue2 = game.add.image(1986, 245, 'barrer');
		animBlue2 = barreraBlue2.animations.add('barrerWalk');
		var barreraBlue3 = game.add.image(1666, 530, 'barrer');
		animBlue3 = barreraBlue3.animations.add('barrerWalk');
		var barreraBlue4 = game.add.image(1426, 530, 'barrer');
		animBlue4 = barreraBlue4.animations.add('barrerWalk');

		var barreraBlue5 = game.add.image(1186, 530, 'barrer');
		animBlue5 = barreraBlue5.animations.add('barrerWalk');
		var barreraBlue6 = game.add.image(946, 530, 'barrer');
		animBlue6 = barreraBlue6.animations.add('barrerWalk');

		var barreraBlue7 = game.add.image(960, 0, 'barrer');
		animBlue7 = barreraBlue7.animations.add('barrerWalk');
		var barreraBlue8 = game.add.image(960, 245, 'barrer');
		animBlue8 = barreraBlue8.animations.add('barrerWalk');

		barreraBlue.angle = 90;
		barreraBlue.width = 280;
		barreraBlue2.width = 300;
		barreraBlue2.angle = 90;
		barreraBlue7.angle = 90;
		barreraBlue8.angle = 90;
		barreraBlue7.width = 280;
		barreraBlue8.width = 300;
		barreraBlue3.width = 282;
		barreraBlue4.width = 282;
		barreraBlue5.width = 282;
		barreraBlue6.width = 282;

	
	
	


			//cursores mas contacto +background
		cursors = game.input.keyboard.createCursorKeys();
		ship.body.onBeginContact.add(blockHit, this);
		ship.body.onEndContact.add(blockHitEnd, this);
		ship.body.allowSleep = false;
		ship2.body.allowSleep = false;
		ship3.body.allowSleep = false;
		tileSprite = game.add.tileSprite(0, 0, 8000, 8000, 'background');
		game.world.sendToBack(tileSprite);
		
	
	
	    HPTotal = player.life;
		console.log(player);
		
	},

	update: function() {
		console.log(HPTotal);
		console.log(player.life);
		ship.body.setZeroVelocity();
		ship2.body.setZeroVelocity();
		ship3.body.setZeroVelocity();
		//reglas de trois para actualizar bars
		barraHP.width = (94 * player.life)/HPTotal;
		pointBarRed.width = (239*room[0].team0)/3000;
		pointBarBlue.width = (239*room[1].team1)/3000;
		//barraHP.x += 232-barraHP.width;
		if(player.clock!=null)
		{   barraES.alpha = 0.5;
			switch(player.rol)
			{
			case 0:
			barraES.width = (94 * player.clock.ms)/10000;
			case 1:
			barraES.width = (94 * player.clock.ms)/10000;
			case 2:
			barraES.width = (94 * player.clock.ms)/10000;
			}
		}
		else{barraES.alpha = 1; barraES.width = 94;}
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
		//pintamos barra salud, especial, puntos...
		if(game.camera.width>1400){
			rec.x = game.camera.x+(game.camera.width/1.27)+100;
			rec.y = game.camera.y+(game.camera.height/1.808)+102;
			barraSalud.x = game.camera.x+(game.camera.width/1.27)-100;
			barraSalud.y = game.camera.y+(game.camera.height/1.808)+230;

			barraEspecial.x = game.camera.x+(game.camera.width/1.27)-100;
			barraEspecial.y = game.camera.y+(game.camera.height/1.808)+170;

			barraES.x = game.camera.x+(game.camera.width/1.27)-7;
			barraES.y = game.camera.y+(game.camera.height/1.808)+215;

			barraHP.x = game.camera.x+(game.camera.width/1.27)-7;
			barraHP.y = game.camera.y+(game.camera.height/1.808)+274;

			barWinBlue.x = game.camera.x+(game.camera.width/1.27)-1050;
			barWinBlue.y = game.camera.y;

			barWinRed.x = game.camera.x+(game.camera.width/1.27)-550;
			barWinRed.y = game.camera.y;

			pointBarRed.x = game.camera.x+(game.camera.width/1.27)-440;
			pointBarRed.y = game.camera.y+34;

			pointBarBlue.x = game.camera.x+(game.camera.width/1.27)-999;
			pointBarBlue.y = game.camera.y+34;
		}
		else{
			rec.x = game.camera.x+(game.camera.width/1.4)+100;
			rec.y = game.camera.y+(game.camera.height/1.808)+102;
			barraEspecial.x = game.camera.x+(game.camera.width/1.4)-100;
			barraEspecial.y = game.camera.y+(game.camera.height/1.808)+170;

			barraSalud.x = game.camera.x+(game.camera.width/1.4)-100;
			barraSalud.y = game.camera.y+(game.camera.height/1.808)+230;

			barraES.x = game.camera.x+(game.camera.width/1.4)-7;
			barraES.y = game.camera.y+(game.camera.height/1.808)+215;

			barraHP.x = game.camera.x+(game.camera.width/1.4)-7;
			barraHP.y = game.camera.y+(game.camera.height/1.808)+274;

			barWinBlue.x = game.camera.x+(game.camera.width/1.4)-700;
			barWinBlue.y = game.camera.y;

			barWinRed.x = game.camera.x+(game.camera.width/1.4)-300;
			barWinRed.y = game.camera.y;

			pointBarRed.x = game.camera.x+(game.camera.width/1.4)-190;
			pointBarRed.y = game.camera.y+34;

			pointBarBlue.x = game.camera.x+(game.camera.width/1.4)-649;
			pointBarBlue.y = game.camera.y+34;
		}

		//MOVIMIENTOD E LAS BALAS
		 if(balasSpriteMatch!=null)
		 if(balasMatch!=null)
		 for(i=0;i<balasSpriteMatch.length;i++)
		 {
			 if(balasSpriteMatch[i]!=null && balasMatch[i]!=null){
				 if(balasSpriteMatch[i].body!=null){
					// console.log(i);
					 //console.log(balasSpriteMatch[i]);
					balasSpriteMatch[i].body.x = balasMatch[i].x;
					balasSpriteMatch[i].body.y = balasMatch[i].y;
				 }
			 }
			  else if(balasSpriteMatch[i]!=null){	  
				balasSpriteMatch[i].body.kinematic = true;
			 	balasSpriteMatch[i].body.x =-Math.floor((Math.random() * 10000) + 1);
				balasSpriteMatch[i].body.y =-Math.floor((Math.random() * 10000) + 1);
				balasSpriteMatch[i].destroy();
				
				balasSpriteMatch[i] =null;
				 
			  }
		 }
		if (game.input.keyboard.isDown(Phaser.Keyboard.A))
		{  
			//game.physics.arcade.accelerationFromRotation(ship.rotation, 300, ship.acceleration);		
			if(ship.body.x >100 && collision ==false)
			 { startTime = Date.now();
				//ship.body.moveLeft(game.time.fps*4);	
				socket.emit('movement', 'left');
			 }
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.D))
		{
			if(ship.body.x < 2876 && collision ==false)
			{
				//ship.body.x +=4;
				startTime = Date.now();
				//ship.body.moveRight(game.time.fps*4);
				socket.emit('movement', 'right');
				console.log(room);
				
			}
		}
	
		if (game.input.keyboard.isDown(Phaser.Keyboard.W))
		{
			if(ship.body.y >100 && collision ==false)
			{   
				startTime = Date.now();
				//ship.body.y -=4;
				
				//ship.body.moveUp(game.time.fps*4);
				socket.emit('movement', 'up');
			}
		}
		 if (game.input.keyboard.isDown(Phaser.Keyboard.S))
		{
			
			if(ship.body.y < 2900 && collision ==false)
			{ 
				startTime = Date.now();
				console.log(game.time.fps);
				//ship.body.moveDown(game.time.fps*4);
				//ship.body.y +=4;
				socket.emit('movement', 'down');
			}
		}
		if(game.input.activePointer.leftButton.isDown==true){shotOne (); }

		ship.body.rotation = game.physics.arcade.angleToPointer(ship)+1.5;
		ship.rotation = game.physics.arcade.angleToPointer(ship)+1.5;
		//todo tocar aqui
		
			socket.emit('rotation', ship.rotation);
		

	
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

			//ACTUALIZACION DE LAS PLATAFORMAS
			var derechaGray = false; 
			var izquierdaGray = false;
			//si cualquier del equi 0 esta en la paltaforma left y ninguno del equipo 1
			if(room[0].r01 == true || room[0].r02 == true || room[0].r03 == true)
				if(room[0].r11 == false && room[0].r12 == false && room[0].r13 == false)
				{
					platformLeft.loadTexture('platformRed');
					izquierdaGray = true;
				}
			//si cualquier del equi 0 esta en la paltaforma right y ninguno del equipo 1      
			if(room[1].r01 == true || room[1].r02 == true || room[1].r03 == true)
				if(room[1].r11 == false && room[1].r12 == false && room[1].r13 == false)
				{
					platformRight.loadTexture('platformRed');
					derechaGray = true;
				}
			//si cualquier del equi 1 esta en la paltaforma left y ninguno del equipo 0
			if(room[0].r11 == true || room[0].r12 == true || room[0].r13 == true)
				if(room[0].r01 == false && room[0].r02 == false && room[0].r03 == false)
				{
					platformLeft.loadTexture('platformBlue');
					izquierdaGray = true;
				}
			//si cualquier del equi 1 esta en la paltaforma right y ninguno del equipo 0      
			if(room[1].r11 == true || room[1].r12 == true || room[1].r13 == true)
				if(room[1].r01 == false && room[1].r02 == false && room[1].r03 == false)
				{
					platformRight.loadTexture('platformBlue');
					derechaGray = true;
				}
			if(!izquierdaGray)
			{
			platformLeft.loadTexture('platformGray');
			}
			if(!derechaGray)
			{
			platformRight.loadTexture('platformGray');
			}

	   
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
	console.log('balas 1');
}
function shotTwo () {
	console.log("special");
	socket.emit('secondSkill');	
	console.log(player);
}

function blockHit (body, bodyB, shapeA, shapeB, equation) {	
if(body.platform==null)
		collision = true;
	}

	function blockHitEnd (body, bodyB, shapeA, shapeB, equation) {
		console.log("hitEnd");
		collision = false;	
	}
	function platformHitRight(platform,ship)
	{
		console.log("hitP");

	}
	function platformHitEndRight(body, bodyB, shapeA, shapeB, equation)
	{
		console.log("hitEP");
		
	}
	function platformHitLeft(body1,body2)
	{
		console.log("hitP");

	}
	function platformHitEndLeft(body, bodyB, shapeA, shapeB, equation)
	{
		console.log("hitEP");
		
	}
	function checkPlatform(body1, body2) {

		//  To explain - the post broadphase event has collected together all potential collision pairs in the world
		//  It doesn't mean they WILL collide, just that they might do.
	
		//  This callback is sent each collision pair of bodies. It's up to you how you compare them.
		//  If you return true then the pair will carry on into the narrow phase, potentially colliding.
		//  If you return false they will be removed from the narrow phase check all together.
	
		//  In this simple example if one of the bodies is our space ship, 
		//  and the other body is the green pepper sprite (frame ID 4) then we DON'T allow the collision to happen.
		//  Usually you would use a collision mask for something this simple, but it demonstates use.
	

	if(body1.platform==true)
	platformHitRight(body1,body2);
	if(body1.platform==false)
	platformHitLeft(body1,body2);

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
			animBlue1.play(10, false);
			animBlue2.play(10, false);
			animBlue3.play(10, false);
			animBlue4.play(10, false);
			animBlue5.play(10, false);
			animBlue6.play(10, false);
			animBlue7.play(10, false);
			animBlue8.play(10, false);
			text.destroy();
			// console.log(game.input.activePointer.leftButton.isDown);
			// key1 = game.input.mouse.addKey(Phaser.Mouse.LEFT_BUTTON);
			// key1.onDown.add(shotOne, this);
			
			key2 = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			key2.onDown.add(shotTwo, this);
			setInterval(i);
		}
	}, 1000);

	function checkBullet(body1, body2) {

		//  To explain - the post broadphase event has collected together all potential collision pairs in the world
		//  It doesn't mean they WILL collide, just that they might do.
	
		//  This callback is sent each collision pair of bodies. It's up to you how you compare them.
		//  If you return true then the pair will carry on into the narrow phase, potentially colliding.
		//  If you return false they will be removed from the narrow phase check all together.
	
		//  In this simple example if one of the bodies is our space ship, 
		//  and the other body is the green pepper sprite (frame ID 4) then we DON'T allow the collision to happen.
		//  Usually you would use a collision mask for something this simple, but it demonstates use.
	if(body1.miBala!=null && body2.miBala!=null)
	{
		console.log(body1);
		console.log(body2);
		console.log("chocan dos balas");
		return false;
	}
	if(body1.idPlayer!=null)
	 return true;

	 return false;
	}
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