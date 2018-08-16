var express = require('express');  
var app = express();  
var server = require('http').Server(app);  
var io = require('socket.io')(server);
// var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
var SAT = require('sat');
var clockit = require('clockit');
// const spawn = require('threads').spawn;
// const spawn1 = spawn.spawn;
// const thread = spawn(function(input, done) {
//  // Everything we do here will be run in parallel in another execution context. 

//  // Remember that this function will be executed in the thread's context, 
//  // so you cannot reference any value of the surrounding code. 
//  done({ string : input.string, integer : parseInt(input.string) });
//  done({ string : input.string, integer : parseInt(input.string) });
// });


// //   cluster.on('exit', (worker, code, signal) => {
// //     console.log(`worker ${worker.process.pid} died`);
// //   });
// // } else {
//   // Workers can share any TCP connection
//   // In this case it is an HTTP server
  server.listen(process.env.PORT || 5000, function() {  
      console.log("Servidor corriendo en "+process.env.PORT);
     }); 

//   console.log(`Worker ${process.pid} started`);
// }







//utilizamos el directorio public
app.use(express.static('public'));

app.get('/game', function(req, res) {  
  res.sendFile( __dirname + "/public/" + "game.html" );
});

var response = new SAT.Response();
var responseBaseCollision = new SAT.Response();
var room=0;
var contador=0;
var playersMatch = new Array();
var allPlayers = new Array();
var allPlayers2 = new Array();
var bulletsMatch = new Array();
var bulletsMatchSpecial = new Array();
var platformLeft = new SAT.Circle(new SAT.Vector(740,1250), 240);
var platformRight = new SAT.Circle(new SAT.Vector(2190,1790), 240);
var roomMatch = new Array();
var baseUp = new SAT.Box(new SAT.Vector(950,0), 1090, 620).toPolygon();
var baseDown = new SAT.Box(new SAT.Vector(950,2490), 1060, 750).toPolygon();
var meteorito1 = new SAT.Circle(new SAT.Vector(1400,1700), 80);
var meteorito2 = new SAT.Circle(new SAT.Vector(2100,1100), 80);
var meteorito3 = new SAT.Circle(new SAT.Vector(400,2100), 80);
var meteorito4 = new SAT.Circle(new SAT.Vector(2400,2400), 80);
var meteorito5 = new SAT.Circle(new SAT.Vector(300,500), 80);
var meteorito6 = new SAT.Circle(new SAT.Vector(900,900), 80);
//CONEXION DE LOS USUARIOS
io.on('connection', function(socket) {  
  socket.on('disconnect', function(){
     console.log('user disconnected');
     contador--;
    // var posicion = usuarios.indexOf(socket.id);
     //delete usuarios[posicion];
     //usuarios = usuarios.filter(Boolean);
     deleteUser(socket.id);
  });
  contador++;
  
  console.log('Alguien se ha conectado con Sockets');
  joinInRoom(socket);
  io.sockets.emit('conectados', contador);

      socket.on('mouse',function(data) {    
           socket.broadcast.emit('mouse', data);
        });   
  // movimiento   
      socket.on('movement', function(data) {
          //movePlayer(socket.id,data); 
          var player = findPlayer(socket.id);
         if(player !=null && player.inmuneClock !=null && player.inmuneClock.ms > 10000) {
           
            switch(data){
              case 'up':
             
              if(player.up==false)
              player.collision.pos.y -= 16;
              player.up=true;
              break;
              case 'down':
              if(player.down==false)
              player.collision.pos.y += 16;
              player.down=true;
              break;
              case 'right':
              if(player.right==false)
              player.collision.pos.x += 16;
              player.right=true;
              break;
              case 'left':
              if(player.left==false)
              player.collision.pos.x -= 16;
              player.left=true;
             
              break;
            }  
          }
          else if(player !=null && player.inmuneClock!=null && player.inmuneClock.ms <= 10000) 
          {
            
            if(player.team==0)
            switch(data){
              case 'up':
              
              if(player.posicionY > 2500)
              player.up=true;
              break;
              case 'down':
              
              
              player.down=true;
            
              break;
              case 'right':
             
              if(player.posicionX < 1900)
              player.right=true;
              break;
              case 'left':
             
              if(player.posicionX > 1000)
              player.left=true;
              break;
            }  //Para el player.team 1
            else
            switch(data){
              case 'up':
              
              player.up=true;
              break;
              case 'down':
             
              if(player.posicionY < 1000)
              player.down=true;
              break;
              case 'right':
              
              if(player.posicionX < 1900)
              player.right=true;
              break;
              case 'left':
             
              if(player.posicionX > 1000)
              player.left=true;
              break;

            }
        }
        //mayor   que >
         
      })
      socket.on('latency', function(data) {
        io.to(findPlayer(socket.id).room).emit('latency', 'data');   
    })
  //rotation
      socket.on('rotation', function(data) {
        rotatePlayer(socket.id,data);    
    })
    socket.on('fireBullet', function() {
      //rotatePlayer(socket.id);   
      //findPlayer(socket.id).fire=true; 
      var response = new SAT.Response();
      var player = findPlayer(socket.id);
      
      if(player !=null && SAT.testPolygonCircle(baseDown, player.collision, response)==false && SAT.testPolygonCircle(baseUp, player.collision, response)==false)
      {
        
      player.fire=true;
      }
     //createBullet(findPlayer(socket.id));
     //sleep(2000);
  })
  socket.on('secondSkill', function() {
    
    var player = findPlayer(socket.id);    
    if(player.special == false && player.clock==null){
      player.clock = clockit.start();  
      if(player.rol==0){ secondSkillBarrier(player.room,player.team); }
      if(player.rol==1){ secondSkillSpy(player.room,player.team); }
      if(player.rol==2 && SAT.testPolygonCircle(baseUp, player.collision, response)==false){ createBulletSpecial(player); }

    }
    player.special=true;
   

})
    socket.on('bulletHit', function(data) {
      //rotatePlayer(socket.id);   
      //findPlayer(socket.id).fire=true; 
    
     //TODO COMPROBAR SUBRStrings DE IF(data.bullet.id !=socket.id) ME ESTAN HUANKEANDO
     var bullet = findBullet(data.bullet.id,data.bullet.room);
    
     if(bullet!=null && bullet.destroy ==false) {
        
      var player = findPlayer(data.ship);
      
      if(player !=null){
       
        player.collision.pos.x = player.posicionX;
        player.collision.pos.y = player.posicionY;
        player.collision.r = 80;
        bullet.collision.pos.x = bullet.x;
        bullet.collision.pos.y = bullet.y;
        bullet.collision.r = 8;
        var response = new SAT.Response();
        collided = SAT.testCircleCircle(player.collision, bullet.collision, response);
        bullet.destroy = collided; 
        //TODO utilizar el clock para comprobar 3s de la second skill y ver si se puede hacer daño
        if(collided)
        {
          player.life -= bullet.damage;
         
          if(player.life <=0){
              switch(player.rol){
                case 0:
                if(player.team==0){
                  player.posicionX = 1300;
                  player.posicionY = 2885;
                  player.life = 200;
                  player.inmuneClock = clockit.start();
                  player.collision=new SAT.Circle(new SAT.Vector(player.posicionX,player.posicionY),16);
                }
                if(player.team==1){
                  player.posicionX = 1300;
                  player.posicionY = 485;
                  player.life = 200;
                  player.inmuneClock = clockit.start();
                  player.collision=new SAT.Circle(new SAT.Vector(player.posicionX,player.posicionY),16);
                }
                break;
                case 1:
                if(player.team==0){
                  player.posicionX = 1500;
                  player.posicionY = 2885;
                  player.life = 100;
                  player.inmuneClock = clockit.start();
                  player.collision=new SAT.Circle(new SAT.Vector(player.posicionX,player.posicionY),16);
               }
               //TODO cambiar posiciones de muerte equipo 1
               if(player.team==1){
                player.posicionX = 1500;
                player.posicionY = 485;
                player.life = 100;
                player.inmuneClock = clockit.start();
                player.collision=new SAT.Circle(new SAT.Vector(player.posicionX,player.posicionY),16);
               }
                break;
                case 2:
                if(player.team==0){
                  player.posicionX = 1700;
                  player.posicionY = 2885;
                  player.life = 70;
                  player.inmuneClock = clockit.start();
                  player.collision=new SAT.Circle(new SAT.Vector(player.posicionX,player.posicionY),16);
               }
               if(player.team==1){
                player.posicionX = 1700;
                player.posicionY = 485;
                player.life = 70;
                player.inmuneClock = clockit.start();
                player.collision=new SAT.Circle(new SAT.Vector(player.posicionX,player.posicionY),16);
               }
                break;
                

              }
          }
          

        }
        else{
          bullet.destroy = true; 
        }
        
        

        
      }
      else{
        bullet.destroy = true; 
      }
      
     }
     
    
     
    //createBullet(findPlayer(socket.id));
    //sleep(2000);
  })
});
//todo 9 bullets
function secondSkillBullets(bulletParam){
  var aux=4.7;
  
  // var bullet = new Object(); 
  // bullet.rotation = 0.012345; 
 
  // bulletsMatch[bulletParam.room].push(bullet);
  for(var i=0;i<8;i++){
   bullet = new Object(); 
  
  bullet.damage = 5;
  bullet.speed = 40;
  bullet.rol = 2;
  bullet.team = bulletParam.team;
  bullet.id = bulletParam.id+(((1+Math.random())*0x10000)|0).toString(16).substring(1);
  bullet.x0 = bulletParam.x;
  bullet.y0 = bulletParam.y;
  bullet.collision = bulletParam.collision;
  bullet.x = bulletParam.x;
  bullet.y = bulletParam.y;
  bullet.rotation = aux;     
  bullet.room = bulletParam.room;
  bullet.destroy = false;
  
  aux=aux-0.8;
  if(bulletsMatch[bulletParam.room]!=null)
  bulletsMatch[bulletParam.room].push(bullet);
  bullet=null;
  }
 


}
function secondSkillSpy(room,team){
  console.log("entra");
  io.to(room).emit('secondSkillSpy',team);

}
function secondSkillBarrier(room,team){
  console.log("entra");
  io.to(room).emit('secondSkillBarrier',team);

}
function findBullet(socketID,i){

  for(var x=0;x<bulletsMatch[i].length;x++)
  {
    if(bulletsMatch[i][x].id==socketID)
      return bulletsMatch[i][x];
  }
}
setInterval( function() { confirmBullet(); }, 500);
function confirmBullet(){
  
  for(i=0;i<allPlayers2.length;i++)
  {
    
    if(allPlayers2[i]!=null)
    if(allPlayers2[i].fire==true)
    { 
      createBullet(allPlayers2[i]);
      allPlayers2[i].fire = false;
    }
  }
 }



function sleep(miliseconds) {
  var currentTime = new Date().getTime();

  while (currentTime + miliseconds >= new Date().getTime()) {
  }
}
function createBulletSpecial(player){
 
  var bullet = new Object();
      bullet.damage = 15;
      bullet.speed = 40;
      bullet.rol = 2;
      bullet.team = player.team;
      bullet.id = player.id+(((1+Math.random())*0x10000)|0).toString(16).substring(1);
      bullet.x0 = player.posicionX+100*Math.cos(player.rotation-1.5);
      bullet.y0 = player.posicionY+100*Math.sin(player.rotation-1.5);
      bullet.collision = new SAT.Circle(new SAT.Vector(player.posicionX+100*Math.cos(player.rotation-1.5),player.posicionY+100*Math.sin(player.rotation-1.5), 8));
      bullet.x = bullet.x0;
      bullet.y = bullet.y0;
      bullet.rotation = player.rotation;     
      bullet.room = player.room;
      bullet.destroy = false;
      bullet.special = true;
       if(bulletsMatchSpecial[player.room] == undefined)
       {
        bulletsMatchSpecial[player.room] = new Array();
       }
       bulletsMatchSpecial[player.room].push(bullet); 
      

}
function createBullet(player){
  var bullet = new Object();
    switch(player.rol)
   {
      case 0:
       bullet.damage = 10;
       bullet.speed = 20;
       bullet.rol = 0;
       bullet.team = player.team;
       bullet.id = player.id+(((1+Math.random())*0x10000)|0).toString(16).substring(1);
       bullet.x0 = player.posicionX+100*Math.cos(player.rotation-1.5);
       bullet.y0 = player.posicionY+40*Math.sin(player.rotation-1.5);
       bullet.collision = new SAT.Circle(new SAT.Vector(player.posicionX+40*Math.cos(player.rotation-1.5),player.posicionY+40*Math.sin(player.rotation-1.5), 8));
       bullet.x = bullet.x0;
       bullet.y = bullet.y0;
       bullet.rotation = player.rotation;
       bullet.destroy = false;
       bullet.room = player.room;
       
      break;
      case 1:
      bullet.damage = 3;
      bullet.speed = 40;
      bullet.rol = 1;
      bullet.team = player.team;
      bullet.id = player.id+(((1+Math.random())*0x10000)|0).toString(16).substring(1);
      bullet.x0 = player.posicionX+150*Math.cos(player.rotation-1.5);
      bullet.y0 = player.posicionY+150*Math.sin(player.rotation-1.5);
      bullet.collision = new SAT.Circle(new SAT.Vector(player.posicionX+100*Math.cos(player.rotation-1.5),player.posicionY+100*Math.sin(player.rotation-1.5), 8));
      bullet.x = bullet.x0;
      bullet.y = bullet.y0;
      bullet.rotation = player.rotation;
      bullet.destroy = false;
      bullet.room = player.room;
    //pendiente revisar player.collision
      break;
      case 2:
      bullet.damage = 5;
      bullet.speed = 40;
      bullet.rol = 2;
      bullet.team = player.team;
      bullet.id = player.id+(((1+Math.random())*0x10000)|0).toString(16).substring(1);
      bullet.x0 = player.posicionX+150*Math.cos(player.rotation-1.5);
      bullet.y0 = player.posicionY+150*Math.sin(player.rotation-1.5);
      bullet.collision = new SAT.Circle(new SAT.Vector(player.posicionX+100*Math.cos(player.rotation-1.5),player.posicionY+100*Math.sin(player.rotation-1.5), 8));
      bullet.x = bullet.x0;
      bullet.y = bullet.y0;
      bullet.rotation = player.rotation;     
      bullet.room = player.room;
      bullet.destroy = false;
      break;
   } 
   if(bulletsMatch[player.room] == undefined)
   {
    bulletsMatch[player.room] = new Array();
   }
   
   bulletsMatch[player.room].push(bullet); 
   
}
// setInterval( function() { createBullet(); }, 500);
// function createBullet(){
//  var i;
// for(i=0; i<room;i++)
//   {
//     io.to(i).emit('updatePlayers',playersMatch[i]); 
//   }
// }


function movePlayer(i){
  if(playersMatch[i]!=null){
  playersMatch[i].forEach(element => { 
    element.movementup=false;
    element.movementdown=false;
    element.movementright=false;
    element.movementleft=false;
      if(element.up==true && element.posicionY>100){
  
        if(element.team == 0 && SAT.testPolygonCircle(baseUp, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito1, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito2, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito3, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito4, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito5, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito6, element.collision, responseBaseCollision)==false 
        || element.team == 1 && SAT.testPolygonCircle(baseDown, element.collision, response)==false
        && SAT.testCircleCircle(meteorito1, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito2, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito3, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito4, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito5, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito6, element.collision, responseBaseCollision)==false ){
        element.posicionY-=4;
        element.movementup=true;
      
        }
        // else if(element.team == 0 && SAT.testPolygonCircle(baseUp, element.collision, responseBaseCollision)==true){
        //   element.posicionY+=32;
       
        // } 
      }
      if(element.down ==true && element.posicionY < 2900){
        if(element.team == 0 && SAT.testPolygonCircle(baseUp, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito1, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito2, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito3, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito4, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito5, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito6, element.collision, responseBaseCollision)==false 
        || element.team == 1 && SAT.testPolygonCircle(baseDown, element.collision, response)==false&& SAT.testCircleCircle(meteorito1, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito2, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito3, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito4, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito5, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito6, element.collision, responseBaseCollision)==false ){
        element.posicionY+=4;
        element.movementdown=true;
        }
        // else if(element.team == 0 && SAT.testPolygonCircle(baseUp, element.collision, responseBaseCollision)==true){
        //   element.posicionY-=16;
        //   element.down=false;
        // } 
      }
      if(element.right==true && element.posicionX < 2876){
        if(element.team == 0 && SAT.testPolygonCircle(baseUp, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito1, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito2, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito3, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito4, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito5, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito6, element.collision, responseBaseCollision)==false 
        || element.team == 1 && SAT.testPolygonCircle(baseDown, element.collision, response)==false&& SAT.testCircleCircle(meteorito1, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito2, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito3, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito4, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito5, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito6, element.collision, responseBaseCollision)==false ){
        element.posicionX+=4;
        element.movementright=true;
      
        }
        // else if(element.team == 0 && SAT.testPolygonCircle(baseUp, element.collision, responseBaseCollision)==true){
        //   element.posicionX-=32;
          
        // } 
      }
      if(element.left==true && element.posicionX  > 100){
        if(element.team == 0 && SAT.testPolygonCircle(baseUp, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito1, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito2, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito3, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito4, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito5, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito6, element.collision, responseBaseCollision)==false 
        || element.team == 1 && SAT.testPolygonCircle(baseDown, element.collision, response)==false && SAT.testCircleCircle(meteorito1, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito2, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito3, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito4, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito5, element.collision, responseBaseCollision)==false 
        && SAT.testCircleCircle(meteorito6, element.collision, responseBaseCollision)==false ){
        element.posicionX-=4;
        element.movementleft=true;
        }
        // else if(element.team == 0 && SAT.testPolygonCircle(baseUp, element.collision, responseBaseCollision)==true){
        //   element.posicionX+=32;
          
        // } 
      }if(element.clock!=null)
      
      //ACTUALIZACION DE LOS ESPECIAL
      switch(element.rol)
      { case 0:
        if(element.clock!=null)
        if(element.clock.ms >10000)
        { 
          element.clock = null;
          element.special = false;
        }
        case 1:
        if(element.clock!=null)
        if(element.clock.ms >10000)
        { 
          element.clock = null;
          
        }
        if(element.clock!=null)
        if(element.clock.ms >3000)
        {
          element.special = false;
        }
        case 2:
        if(element.clock!=null)
        if(element.clock.ms >10000)
        { 
          element.clock = null;
          element.special = false;
        }
      }
     
      //COLISIONES CON LA BASE
   element.collision.pos.x = element.posicionX;
   element.collision.pos.y = element.posicionY;
   if(element.left==true)
   {
     
   element.collision.pos.x += 16; 
   }
   if(element.up==true)
   {
   element.collision.pos.y += 16; 
   }
   if(element.down==true)
   {
   element.collision.pos.y -= 16; 
   }
   if(element.right==true)
   {
   element.collision.pos.x -= 16; 
   }

   element.left=false;
   element.up=false;
   element.down=false;
   element.right=false;
   var responseLeft = new SAT.Response();
   var responseRight = new SAT.Response();
   var rl = SAT.testCircleCircle(element.collision, platformLeft, responseLeft);  
   var rr = SAT.testCircleCircle(element.collision, platformRight, responseRight); 
     if(rl == true)
     {
     
      
        if(element.team==0)
        {
          switch(element.rol)
          {
            case 0:
            roomMatch[i][0].r01 = true;
            break;
            case 1:
            roomMatch[i][0].r02 = true;
            break;
            case 2:
            roomMatch[i][0].r03 = true;
            break;
          }
        }
        if(element.team ==1)
        {
          switch(element.rol)
          {
            case 0:
            roomMatch[i][0].r11 = true;
            
            break;
            case 1:
            roomMatch[i][0].r12 = true;
            break;
            case 2:
            roomMatch[i][0].r13 = true;
            break;
          }
        }
      
     }
     else if(rl == false)
     {
     
      if(element.team==0)
        {
          switch(element.rol)
          {
            case 0:
            roomMatch[i][0].r01 = false;
            break;
            case 1:
            roomMatch[i][0].r02 = false;
            break;
            case 2:
            roomMatch[i][0].r03 = false;
            break;
          }
        }
        if(element.team ==1)
        {
          switch(element.rol)
          {
            case 0:
            roomMatch[i][0].r11 = false;
            break;
            case 1:
            roomMatch[i][0].r12 = false;
            break;
            case 2:
            roomMatch[i][0].r13 = false;
            break;
          }
        }
      
     }
     if(rr == true)
     {
      
        if(element.team==0)
        {
          switch(element.rol)
          {
            case 0:
            roomMatch[i][1].r01 = true;
            break;
            case 1:
            roomMatch[i][1].r02 = true;
            break;
            case 2:
            roomMatch[i][1].r03 = true;
            break;
          }
        }
        if(element.team ==1)
        {
          switch(element.rol)
          {
            case 0:
            roomMatch[i][1].r11 = true;
            
            break;
            case 1:
            roomMatch[i][1].r12 = true;
            break;
            case 2:
            roomMatch[i][1].r13 = true;
            break;
          }
        }
      
     }
     else if(rr == false)
     {

      if(element.team==0)
        {
          switch(element.rol)
          {
            case 0:
            roomMatch[i][1].r01 = false;

            break;
            case 1:
            roomMatch[i][1].r02 = false;
            break;
            case 2:
            roomMatch[i][1].r03 = false;
            break;
          }
        }
        if(element.team ==1)
        {
          switch(element.rol)
          {
            case 0:
            roomMatch[i][1].r11 = false;
            break;
            case 1:
            roomMatch[i][1].r12 = false;
            break;
            case 2:
            roomMatch[i][1].r13 = false;
            break;
          }
        }
      
     }
     

  });
}
}

function rotatePlayer(socketID,data){
  if(data >-1.7 && data < 4.7)
    findPlayer(socketID).rotation = data;
 
 }

function findPlayer(socketID){

    function encontrar(allPlayers2) { 
      return allPlayers2.id === socketID;
  }
 return (allPlayers2.find(encontrar));
}

//borramos usuarios de nuestro array players tras desconectarse
function deleteUser(id){
  //casposo
      var posicion = allPlayers.indexOf(id);
      delete allPlayers[posicion];
      allPlayers = allPlayers.filter(Boolean);
      var i=0;
      var x=0;
      var j=0;
     
  for(i=0; i<playersMatch.length;i++){
    for(x=0; x<playersMatch[i].length;x++){
      if(playersMatch[i][x]!=null)
      if(playersMatch[i][x].id == String(id))
      {  
        delete playersMatch[i][x];
        
       
      }
    }
  }
  //TODO HAY QUE HACER OTRO FILTRO PARA BORRAR LOS PLAYERmATCH[I]
   
      posicion = allPlayers2.indexOf(id);
      delete allPlayers2[posicion];
      allPlayers2 = allPlayers2.filter(Boolean);
      //console.log(allPlayers2);
}

//comprueba si esta la sala llena e infresa en la room
function joinInRoom(socket){ 
  socket.join(room);
  fillPlayer(socket);
  if(io.sockets.adapter.rooms[room]!=null){
    //hay que cambiarlo a ==6
    if(io.sockets.adapter.rooms[room].length==6){
      var data;
      data=playersMatch[room];
      console.log("start game");

      allPlayers.push(playersMatch[room]);
      playersMatch[room].forEach(element => {
        element.inmuneClock = clockit.start(); 
      });
      var dataRoom = new Object();
      dataRoom.r01 = false;   dataRoom.r11 = false;
      dataRoom.r02 = false;   dataRoom.r12 = false;
      dataRoom.r03 = false;   dataRoom.r13 = false;
      var dataRoom2 = new Object();
      dataRoom2.r01 = false;   dataRoom2.r11 = false;
      dataRoom2.r02 = false;   dataRoom2.r12 = false;
      dataRoom2.r03 = false;   dataRoom2.r13 = false;
      dataRoom.team0 = 0;
      dataRoom.team1 = 0;
      dataRoom.time = clockit.start(); 
      dataRoom2.time = clockit.start(); 
      roomMatch[room] = new Array();
      roomMatch[room].push(dataRoom);
      roomMatch[room].push(dataRoom2);
      io.to(room).emit('startGame',data); 
      room++;     
    } 
  }
  
}

function updateRoom(i)
{
 //si cualquier del equi 0 esta en la paltaforma left y ninguno del equipo 1
  if(roomMatch[i][0].r01 == true || roomMatch[i][0].r02 == true || roomMatch[i][0].r03 == true)
    if(roomMatch[i][0].r11 == false && roomMatch[i][0].r12 == false && roomMatch[i][0].r13 == false)
       roomMatch[i][0].team0 +=0.2625;
 //si cualquier del equi 0 esta en la paltaforma right y ninguno del equipo 1      
  if(roomMatch[i][1].r01 == true || roomMatch[i][1].r02 == true || roomMatch[i][1].r03 == true)
    if(roomMatch[i][1].r11 == false && roomMatch[i][1].r12 == false && roomMatch[i][1].r13 == false)
       roomMatch[i][0].team0 +=0.2625;  
  //si cualquier del equi 0 esta en la paltaforma left y ninguno del equipo 1
  if(roomMatch[i][0].r11 == true || roomMatch[i][0].r12 == true || roomMatch[i][0].r13 == true)
    if(roomMatch[i][0].r01 == false && roomMatch[i][0].r02 == false && roomMatch[i][0].r03 == false)
      roomMatch[i][0].team1 +=0.2625;

  //si cualquier del equi 0 esta en la paltaforma right y ninguno del equipo 1      
  if(roomMatch[i][1].r11 == true || roomMatch[i][1].r12 == true || roomMatch[i][1].r13 == true)
    if(roomMatch[i][1].r01 == false && roomMatch[i][1].r02 == false && roomMatch[i][1].r03 == false)
      roomMatch[i][0].team1 +=0.2625;  

}


function updateBullet(i){
if(bulletsMatch[i]!=null)
  bulletsMatch[i].forEach(element => {
    

    //Calculadmos la distancia recorrida de la bala para borrarla
    switch(element.rol){
  
    case 0:
    element.x+=2*Math.cos(element.rotation-1.5);
    element.y+=2*Math.sin(element.rotation-1.5);
    element.collision.pos.x=element.x;
    element.collision.pos.y=element.y;
    var a = element.x-element.x0;
    var b = element.y-element.y0;
 
 
   
     //Borrado de balas
     if(Math.sqrt(Math.pow(a,2)+Math.pow(b,2)  > 480000) || element.destroy==true 
     || SAT.testPolygonCircle(baseDown, element.collision, response)==true 
     || SAT.testPolygonCircle(baseUp, element.collision, response)==true
     || SAT.testCircleCircle(meteorito1, element.collision, response)==true
     || SAT.testCircleCircle(meteorito2, element.collision, response)==true
     || SAT.testCircleCircle(meteorito3, element.collision, response)==true
     || SAT.testCircleCircle(meteorito4, element.collision, response)==true
     || SAT.testCircleCircle(meteorito5, element.collision, response)==true
     || SAT.testCircleCircle(meteorito6, element.collision, response)==true)
     {
    
       var posicion = bulletsMatch[i].indexOf(element);    
       delete bulletsMatch[i][posicion];
       bulletsMatch[i] = bulletsMatch[i].filter(Boolean);      
 
     }
    case 1:
    element.x+=4*Math.cos(element.rotation-1.5);
    element.y+=4*Math.sin(element.rotation-1.5);
    element.collision.pos.x=element.x;
    element.collision.pos.y=element.y;
    var a = element.x-element.x0;
    var b = element.y-element.y0;
 
 
   // console.log(Math.sqrt(Math.pow(a,2)+Math.pow(b,2)));
     //Borrado de balas
     if(Math.sqrt(Math.pow(a,2)+Math.pow(b,2)  > 7800000) || element.destroy==true || SAT.testPolygonCircle(baseDown, element.collision, response)==true || SAT.testPolygonCircle(baseUp, element.collision, response)==true|| SAT.testCircleCircle(meteorito1, element.collision, response)==true
     || SAT.testCircleCircle(meteorito2, element.collision, response)==true
     || SAT.testCircleCircle(meteorito3, element.collision, response)==true
     || SAT.testCircleCircle(meteorito4, element.collision, response)==true
     || SAT.testCircleCircle(meteorito5, element.collision, response)==true
     || SAT.testCircleCircle(meteorito6, element.collision, response)==true)
     {
      
       //console.log(element.room);
       var posicion = bulletsMatch[i].indexOf(element);
       delete bulletsMatch[i][posicion];
       bulletsMatch[i] = bulletsMatch[i].filter(Boolean);
     
 
     }

    case 2:
    element.x+=6*Math.cos(element.rotation-1.5);
    element.y+=6*Math.sin(element.rotation-1.5);
    element.collision.pos.x=element.x;
    element.collision.pos.y=element.y;
    var a = element.x-element.x0;
    var b = element.y-element.y0;


   // console.log(Math.sqrt(Math.pow(a,2)+Math.pow(b,2)));
     //Borrado de balas
     if(Math.sqrt(Math.pow(a,2)+Math.pow(b,2)  > 480000) || element.destroy==true || SAT.testPolygonCircle(baseDown, element.collision, response)==true || SAT.testPolygonCircle(baseUp, element.collision, response)==true|| SAT.testCircleCircle(meteorito1, element.collision, response)==true
     || SAT.testCircleCircle(meteorito2, element.collision, response)==true
     || SAT.testCircleCircle(meteorito3, element.collision, response)==true
     || SAT.testCircleCircle(meteorito4, element.collision, response)==true
     || SAT.testCircleCircle(meteorito5, element.collision, response)==true
     || SAT.testCircleCircle(meteorito6, element.collision, response)==true)
     {
      
       var copy = Object.assign({}, element);
       var posicion = bulletsMatch[i].indexOf(element);
       delete bulletsMatch[i][posicion];
       bulletsMatch[i] = bulletsMatch[i].filter(Boolean);
       
       if(copy.special==true)
        secondSkillBullets(copy);

       
     }

    }
   
  });


  if(bulletsMatchSpecial[i]!=null && bulletsMatchSpecial[i]!=undefined)
  bulletsMatchSpecial[i].forEach(element => {
    element.x+=6*Math.cos(element.rotation-1.5);
    element.y+=6*Math.sin(element.rotation-1.5);
    element.collision.pos.x=element.x;
    element.collision.pos.y=element.y;
    var a = element.x-element.x0;
    var b = element.y-element.y0;


   // console.log(Math.sqrt(Math.pow(a,2)+Math.pow(b,2)));
     //Borrado de balas
     if(Math.sqrt(Math.pow(a,2)+Math.pow(b,2)  > 480000) || element.destroy==true || SAT.testPolygonCircle(baseDown, element.collision, response)==true || SAT.testPolygonCircle(baseUp, element.collision, response)==true|| SAT.testCircleCircle(meteorito1, element.collision, response)==true
     || SAT.testCircleCircle(meteorito2, element.collision, response)==true
     || SAT.testCircleCircle(meteorito3, element.collision, response)==true
     || SAT.testCircleCircle(meteorito4, element.collision, response)==true
     || SAT.testCircleCircle(meteorito5, element.collision, response)==true
     || SAT.testCircleCircle(meteorito6, element.collision, response)==true)
     {
      
       var copy = Object.assign({}, element);
       var posicion = bulletsMatchSpecial[i].indexOf(element);
       delete bulletsMatchSpecial[i][posicion];
       bulletsMatchSpecial[i] = bulletsMatchSpecial[i].filter(Boolean);
       
       if(copy.special==true)
        secondSkillBullets(copy);

       
     }
  });

}
var i;
setInterval( function() { updatePlayers(); }, 1000/60 );
function updatePlayers(){
  
for(i=0; i<room;i++)
  {
    updateBullet(i);
    movePlayer(i);
    updateRoom(i);
    io.to(i).emit('updatePlayers',playersMatch[i]);
    io.to(i).emit('updateBullets',bulletsMatch[i],bulletsMatchSpecial[i]); 
    io.to(i).emit('updateRoom',roomMatch[i]); 
  }
}

function fillPlayer(socket){
  var player = new Object();
  //asignamos como id, nuestro id socket
      player.id=socket.id;
 

    //asignamos el  y posicion inicial
      player.special = false;
      player.clock = null;
      player.right = false;
      player.left = false;
      player.up = false;
      player.down = false;
  
    switch(io.sockets.adapter.rooms[room].length) {
      
      case 1:
          player.team = 0;
          player.rol = 0;
          player.life = 200;
          player.fire = false;
          player.posicionX = 1300;
          player.posicionY = 2885;
          
          break;
      case 2:
          player.team = 0;
          player.rol = 1;
          player.life = 100;
          player.fire = false;
          player.posicionX = 1500;
          player.posicionY = 2885;
          break;
      case 3:
          player.team = 0;
          player.rol = 2;
          player.life = 70;
          player.fire = false;
          player.posicionX = 1700;
          player.posicionY = 2885;
          break;
      case 4:
          player.rol = 0;
          player.team = 1;
          player.life = 200;
          player.fire = false;
          player.posicionX = 1300;
          player.posicionY = 485;
          break;
      case 5:
          player.rol = 1;
          player.team = 1;
          player.life = 100;
          player.fire = false;
          player.posicionX = 1500;
          player.posicionY = 485;
          break;
      case 6:
          player.team = 1;
          player.rol = 2;
          player.life = 70;
          player.fire = false;
          player.posicionX = 1700;
          player.posicionY = 485;
          break;
     
  };
  player.collision = new SAT.Circle(new SAT.Vector(player.posicionX,player.posicionY),16);
   //Asignamos velocidad
   player.speed = 20;
   player.room = room;
   //Creamos la matriz solo con el primer jugador
   if(io.sockets.adapter.rooms[room].length==1)
      playersMatch[room] = new Array();
      allPlayers2.push(player);
  
   playersMatch[room].push(player);

}




//LOGEO DE USUARIO
app.post('/login', function (req, res) {
//console.log(socket.id);

  var myobj = { username: req.body.usuario, socketID: req.body.id };
  var query = { username: req.body.usuario };
  //CONEXION A MONGO
// MongoClient.connect(url, function(err, db) {
//   db.collection("usuarios").find(query).toArray(function(err, result) {
//     if (err) throw err; 
//     console.log(result.length);
//     if(result.length == 0)
//       {
//          db.collection("usuarios").insertOne(myobj, function(err, res) {
//             if (err) throw err;
//             console.log("1 document inserted");
//             db.close();
//         });
//       }
//       else{console.log("usuario escogido");}
//     db.close();
//   });


//  });

// 	res.send(req.body);
 
});




// server.listen(8080, function() {  
//   console.log("Servidor corriendo en http://localhost:8080");
// }); 