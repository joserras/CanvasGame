var socket;
var room;
var advises = [10];
//ME
var player;
var players;
//Sprite
var ship;
var ship2;
var ship3;
var totalTimer;
var cursors;
var balasMatch;
var balasMatchSpecial;
//weapons
var weapon;
var fireButton;
var game = null;
//make a phaser game


//fisrt skill
var spriteBarrierRedSkill;
var spriteBarrierBlueSkill;
var startTime;
var timeAux1;
var timeAux2;

var balasSpriteMatch=[];
var balasSpriteMatchSpecial=[];

//rellenamos los consejos
advises[0] = "Wait a moment, looking for a match!";
advises[1] = "3 different roles!";
advises[2] = "Be healer, tank, or dps!";
advises[3] = "Catch the flag!";
advises[4] = "The best multiplayer game!";
advises[5] = "You can play as guest!";
advises[6] = "Be the best player!";
advises[7] = "Take the match control!";
advises[8] = "Play in team with other 5 players!";
advises[9] = "Take the match control!";



var suggestesTimer = setInterval(myTimer ,3000);
function myTimer() {    
    var random = Math.floor((Math.random() * 9) + 1);
    document.getElementById("form__advises").innerHTML = advises[random];

}

//http://battleshipa.herokuapp.com/
//Envía el nombre de usuario y su socket.id al servidor
function login(data){
    socket = io.connect('https://battleshipa.herokuapp.com/', { 'forceNew': true });
    var usuario = data.nickname.value;
    loading();
    activateSockets();
      $.ajax({
            type: "POST", 
            url: "https://battleshipa.herokuapp.com/login", 
            //hay que quitar de ahi el socket no es seguro
            data: JSON.stringify({"usuario" : usuario,"id": socket.id}), 
            contentType: "application/json", 
            success: function(d) {    
                console.log(d);             
            }, 
            error: function(d) {
                console.log("Error");
            }
        });

       
}

//Activamos los sockets en escucha
function activateSockets(){
    socket.on('startGame', function(data) {
        totalTimer=12000 ;
       findPlayer(data,socket.id);
       players = data;   
       console.log(players);
       activateGame();
          
    })
    socket.on('updatePlayers', function(data) {
        findPlayer(data,socket.id);
        players = data;
       
       
            
    })
    socket.on('finishMatch', function(data) {

if(data==1)
{
    text = game.add.text(game.world.centerX, game.world.centerY, '¡El equipo azul ha ganado!', { font: "64px Arial", fill: "#ffffff", align: "center" });
    text.anchor.setTo(0.5, 0.5);  
}
else
{
    text = game.add.text(game.world.centerX, game.world.centerY, '¡El equipo rojo ha ganado!', { font: "64px Arial", fill: "#ffffff", align: "center" });
    text.anchor.setTo(0.5, 0.5);
}

    setTimeout(saludo(socket),3000);
          function saludo (socket){
              socket.disconnect();
            location.reload();

          }
    })
    socket.on('updateRoom', function(data) {     
        room = data;    
      
            
    })
    socket.on('deathPlayer', function(data) { 
        console.log("death");  
        console.log(data);    
        death = game.add.sprite(data.posicionX, data.posicionY, 'explosion');  
        death.animations.add('walk');

        death.animations.play('walk', 10, false);
            
    })
    socket.on('updateBullets', function(data,data1) {     

        balasMatch = data;
        
        balasMatchSpecial=data1;
        if(balasMatch!=null)
            for(i=0;i<balasMatch.length;i++)
            {   
                if(balasMatch[i]!=null && balasSpriteMatch[i]==null){                   
                    balasSpriteMatch[i]=game.add.sprite(balasMatch[i].x, balasMatch[i].y, 'bullet');                   
                    game.physics.p2.enable(balasSpriteMatch[i], true);
                   //balasSpriteMatch[i].body.collidesWith([ship,ship2,ship3]);  
                    balasSpriteMatch[i].checkWorldBounds = true;               
                    balasSpriteMatch[i].body.setCircle(6);
                    balasSpriteMatch[i].body.static= true;
                    balasSpriteMatch[i].body.miBala = balasMatch[i].id;
                    balasSpriteMatch[i].body.rol = balasMatch[i].rol;
                    balasSpriteMatch[i].body.onBeginContact.add(blockHitBullet, this);
                   
                    
                    // //solo para balas especial
                    // else if (balasMatch[i].special==true){
                    //     if(balasMatch[i].team==1)
                    //     balasSpriteMatch[i]=game.add.sprite(balasMatch[i].x, balasMatch[i].y, 'secondSkillBulletBlue');        
                    //     else
                    //     balasSpriteMatch[i]=game.add.sprite(balasMatch[i].x, balasMatch[i].y, 'secondSkillBulletRed');
                    //    console.log("special");
                        
                    //     game.physics.p2.enable(balasSpriteMatch[i], true);

                    //      if(balasSpriteMatch[i]!=null && balasSpriteMatch[i].body!=null)
                    //     {
                        
                    //     balasSpriteMatch[i].body.rotation = player.rotation;
                    //     }
                    // //balasSpriteMatch[i].body.collidesWith([ship,ship2,ship3]);  
                    //     balasSpriteMatch[i].checkWorldBounds = true;               
                    //     balasSpriteMatch[i].body.setCircle(9);
                    //     balasSpriteMatch[i].body.static= true;
                    //     balasSpriteMatch[i].body.miBala = balasMatch[i].id;
                    //     balasSpriteMatch[i].body.rol = balasMatch[i].rol;
                    //     balasSpriteMatch[i].body.onBeginContact.add(blockHitBullet, this);
                    // }
                                            
                    
                }
            }
            if(balasMatchSpecial!=null)
            for(i=0;i<balasMatchSpecial.length;i++)
            {   
                if(balasMatchSpecial[i]!=null && balasSpriteMatchSpecial[i]==null){
                    if(balasMatchSpecial[i].team==1)                                     
                    balasSpriteMatchSpecial[i]=game.add.sprite(balasMatchSpecial[i].x, balasMatchSpecial[i].y, 'secondSkillBulletBlue');
                    else
                    balasSpriteMatchSpecial[i]=game.add.sprite(balasMatchSpecial[i].x, balasMatchSpecial[i].y, 'secondSkillBulletRed'); 
                    
                    game.physics.p2.enable(balasSpriteMatchSpecial[i], true);
                  
                   balasSpriteMatchSpecial[i].checkWorldBounds = true;               
                   balasSpriteMatchSpecial[i].body.setCircle(9);
                   balasSpriteMatchSpecial[i].body.static= true;
                   balasSpriteMatchSpecial[i].body.miBala = balasMatchSpecial[i].id;
                   balasSpriteMatchSpecial[i].body.rol = balasMatchSpecial[i].rol;
                   balasSpriteMatchSpecial[i].body.onBeginContact.add(blockHitBulletSpecial, this);
                   balasSpriteMatchSpecial[i].body.rotation = balasMatchSpecial[i].rotation;
                    
                          
                    
                }
            }
           
            
    })
    socket.on('latency', function(data) {
        if(startTime !=null){ 
            latency = Date.now() - startTime; 
            console.log(latency);
        }
       
            
    })
    socket.on('secondSkillSpy', function(data) {
        console.log('spia activo');
        game.camera.flash(0x00F4E90, 500);
if(player!=null)
  if(player.team==0){ 
      shipCircle4.alpha = 1.0;
      shipCircle5.alpha = 1.0;
      shipCircle6.alpha = 1.0;
  }
  if(player!=null)
  if(player.team==1){ 
      shipCircle.alpha = 1.0;
      shipCircle2.alpha = 1.0;
      shipCircle3.alpha = 1.0;
  }
  var myinterval;
  myinterval=setInterval(myFunction, 3000);
  function myFunction()
  {
      console.log("only once!");
            if(player!=null)
            if(player.team==0){ 
                shipCircle4.alpha = 0.0;
                shipCircle5.alpha = 0.0;
                shipCircle6.alpha = 0.0;
            }
            if(player!=null)
            if(player.team==1){ 
                shipCircle.alpha = 0.0;
                shipCircle2.alpha = 0.0;
                shipCircle3.alpha = 0.0;
            }
      clearInterval(myinterval);
  } 
            
    })
    socket.on('secondSkillBarrier', function(data) {    
        
        if(data==0){
        spriteBarrierRedSkill = game.add.sprite(players[0].posicionX, players[0].posicionY, 'barrerSkillRed');
        spriteBarrierRedSkill.alpha = 0.4;
        game.physics.p2.enable(spriteBarrierRedSkill, true);
        //balasSpriteMatch[i].body.collidesWith([ship,ship2,ship3]);             
        spriteBarrierRedSkill.body.setCircle(90);
        spriteBarrierRedSkill.body.static= true;
        var spbared = spriteBarrierRedSkill.animations.add('walk');
        spriteBarrierRedSkill.animations.play('walk', 10, true);
        spriteBarrierRedSkill.anchor.setTo(0.5, 0.5);
        spriteBarrierRedSkill.scale.setTo(3.7, 3.7);
	    players[0].special=true;
       
        
            
        }
        else if(data==1){  
            spriteBarrierBlueSkill = game.add.sprite(players[3].posicionX, players[3].posicionY, 'barrerSkillBlue');  
            spriteBarrierBlueSkill.alpha = 0.4;
            game.physics.p2.enable(spriteBarrierBlueSkill, true);
            //balasSpriteMatch[i].body.collidesWith([ship,ship2,ship3]);             
            spriteBarrierBlueSkill.body.setCircle(90);
            spriteBarrierBlueSkill.body.static= true;
            var spbared = spriteBarrierBlueSkill.animations.add('walk');
            spriteBarrierBlueSkill.animations.play('walk', 10, true);
            spriteBarrierBlueSkill.anchor.setTo(0.5, 0.5);
            spriteBarrierBlueSkill.scale.setTo(3.7, 3.7);
            
            players[3].special=true;
        }
      
            
    })
    
}


function blockHitBullet (body, bodyB, shapeA, shapeB, equation) {	

   
if(equation!=null && equation[0].shapeB!=null && equation[0].shapeB.body.parent!=null){   
    if(equation[0].shapeB.body.parent.miBala!=null){  
         
        if(balasMatch!=null)
        for(i=0;i<balasMatch.length;i++)
        {
            if(Math.trunc(equation[0].shapeB.body.parent.x)==Math.trunc(balasMatch[i].x) && Math.trunc(equation[0].shapeB.body.parent.y)==Math.trunc(balasMatch[i].y))
            {        
                if(body!=null){        
                balasSpriteMatch[i].body.x =-Math.floor((Math.random() * 10000) + 1);
                balasSpriteMatch[i].body.y =-Math.floor((Math.random() * 10000) + 1);
               
                socket.emit('bulletHit',{bullet:balasMatch[i], ship:body.idPlayer });
                }
            }
        }
    
    }
            else{
                
            if(balasMatch!=null)
            for(i=0;i<balasMatch.length;i++)
            {          
                if(Math.trunc(equation[0].shapeA.body.parent.x)==Math.trunc(balasMatch[i].x) && Math.trunc(equation[0].shapeA.body.parent.y)==Math.trunc(balasMatch[i].y))
                {                        
                   
                    if(body!=null){  
                          
                    socket.emit('bulletHit',{bullet:balasMatch[i], ship:body.idPlayer });
                    }
                }
            }
            
            }
        }


            
}
    


function blockHitBulletSpecial (body, bodyB, shapeA, shapeB, equation) {	

    if(balasMatchSpecial!=null)
            for(i=0;i<balasMatchSpecial.length;i++)
            {
              
                if((Math.trunc(equation[0].shapeB.body.parent.x)-Math.trunc(balasMatchSpecial[i].x))>-300 && equation[0].shapeB.body.parent.x-Math.trunc(balasMatchSpecial[i].x)<300 ) 
                {       
                    if(body!=null){  
                           if(balasMatchSpecial[i]!=null){
                               
                    socket.emit('bulletHitSpecial',{bullet:balasMatchSpecial[i], ship:body.idPlayer });
                           }
                    }
                }
            }
        
        
               
    
    
                
    }

function barrierHitBullet(body, bodyB, shapeA, shapeB, equation){
    console.log('hit');
    console.log(body);
    console.log(bodyB);



}

//Me encuentro entre los distintos jugadores
   function findPlayer(data,socketID){
    data.forEach(function(element) {
        if(element !=null)
        if(element.id == String(socketID))
        {
            player=element;
        
      }  }, this);

   }
   

//Mostramos el loading del juego
function loading(){
    clearInterval(suggestesTimer);
    document.getElementById("form__advises").innerHTML = advises[0];
    document.getElementById('form__button').style.display="none";
    document.getElementById('form__input').style.display="none";
    document.getElementsByClassName('sk-circle')[0].style.display="block";
}


function activateGame(){

    var div = document.createElement("div");
    div.id = "gameDiv";
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "js/main.js"; 
    document.getElementsByTagName("body")[0].appendChild(div);
    document.getElementsByTagName("head")[0].appendChild(script);
    document.getElementById('footer').style.display="none";
    document.getElementById('content').style.display="none";
    totalTimer-=(player.inmuneClock.ms);
    totalTimer=Math.trunc(totalTimer);
    console.log("totalTimer");
    console.log(totalTimer);

    var i =setInterval(function () {
      
        if(text!=null){
           
             
        totalTimer--; 
        text.setText('Empieza en: ' + totalTimer + '!');
        if (totalTimer == 0) {
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
            clearInterval(i);
        }
            setInterval(i);
        }
    }, 1000);
}

     
