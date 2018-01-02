var express = require('express');  
var app = express();  
var server = require('http').Server(app);  
var io = require('socket.io')(server);
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// const spawn = require('threads').spawn;
// const spawn1 = spawn.spawn;
// const thread = spawn(function(input, done) {
//  // Everything we do here will be run in parallel in another execution context. 
//  console.log("tudel");
//  // Remember that this function will be executed in the thread's context, 
//  // so you cannot reference any value of the surrounding code. 
//  done({ string : input.string, integer : parseInt(input.string) });
//  done({ string : input.string, integer : parseInt(input.string) });
// });

// thread
//  .send({ string : '123' })
//  // The handlers come here: (none of them is mandatory) 
//  .on('message', function(response) {
//    console.log('123 * 2 = ', response.integer * 2);
//    thread.kill();
//  })
//  .on('error', function(error) {
//    console.error('Worker errored:', error);
//  })
//  .on('exit', function() {
//    console.log('Worker has been terminated.');
//  });
// const cluster = require('cluster');
// const http = require('http');
// const numCPUs = require('os').cpus().length;

// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`);

// //   // Fork workers.
// //   for (let i = 0; i < numCPUs; i++) {
// //     cluster.fork();
// //   }

// //   cluster.on('exit', (worker, code, signal) => {
// //     console.log(`worker ${worker.process.pid} died`);
// //   });
// // } else {
//   // Workers can share any TCP connection
//   // In this case it is an HTTP server
  server.listen(8080, function() {  
      console.log("Servidor corriendo en http://localhost:8080");
     }); 

//   console.log(`Worker ${process.pid} started`);
// }







//utilizamos el directorio public
app.use(express.static('public'));

app.get('/game', function(req, res) {  
  res.sendFile( __dirname + "/public/" + "game.html" );
});
//conexion a mongo y creaciond e collection
MongoClient.connect(url, function(err, db) {
  
  if (err) throw err;
  console.log("Database created!");
  db.createCollection("usuarios", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
  

});

var room=0;
var contador=0;
var playersMatch = new Array();
var allPlayers = new Array();
var allPlayers2 = new Array();
var bulletsMatch = new Array();
var allBullets = new Array();
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
          movePlayer(socket.id,data);    
      })
  //rotation
      socket.on('rotation', function(data) {
        rotatePlayer(socket.id,data);    
    })
    socket.on('fireBullet', function() {
      //rotatePlayer(socket.id);   
      //findPlayer(socket.id).fire=true; 
      
      
      findPlayer(socket.id).fire=true;
     //createBullet(findPlayer(socket.id));
     //sleep(2000);
  })
    socket.on('bulletHit', function(data) {
      //rotatePlayer(socket.id);   
      //findPlayer(socket.id).fire=true; 
      console.log("golpeo");
      
      console.log(data);
    //createBullet(findPlayer(socket.id));
    //sleep(2000);
  })
});

setInterval( function() { confirmBullet(); }, 500);
function confirmBullet(){
  //console.log(allPlayers2);
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

function createBullet(player){
  var bullet =new Object();
    switch(player.rol)
   {
      case 0:
       bullet.speed = 20;
       bullet.rol = 0;
      
       bullet.id = player.id+(((1+Math.random())*0x10000)|0).toString(16).substring(1);
       console.log(bullet.id);
       bullet.x0 = player.posicionX+40*Math.cos(player.rotation-1.5);
       bullet.y0 = player.posicionY+40*Math.sin(player.rotation-1.5);
       bullet.x = bullet.x0;
       bullet.y = bullet.y0;
       bullet.rotation = player.rotation;
      
       bullet.room = player.room;
       
      break;
      case 1:
      bullet.speed = 40;
      bullet.rol = 1;
      bullet.id = player.id+(((1+Math.random())*0x10000)|0).toString(16).substring(1);
      bullet.x0 = player.posicionX+100*Math.cos(player.rotation-1.5);
      bullet.y0 = player.posicionY+100*Math.sin(player.rotation-1.5);
      bullet.x = bullet.x0;
      bullet.y = bullet.y0;
      bullet.rotation = player.rotation;
  
      bullet.room = player.room;
    
      break;
      case 2:
      bullet.speed = 40;
      bullet.rol = 2;
      bullet.id = player.id+(((1+Math.random())*0x10000)|0).toString(16).substring(1);
      bullet.x0 = player.posicionX+100*Math.cos(player.rotation-1.5);
      bullet.y0 = player.posicionY+100*Math.sin(player.rotation-1.5);
      bullet.x = bullet.x0;
      bullet.y = bullet.y0;
      bullet.rotation = player.rotation;
     
      bullet.room = player.room;
    
      break;
   } 
   if(bulletsMatch[player.room] ==undefined)
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


function movePlayer(socketID,data){
 switch (data){
    case 'up':
    
    if(findPlayer(socketID).posicionY>100)
    findPlayer(socketID).posicionY-=4;
    break;
    case 'down':
    console.log(findPlayer(socketID).posicionY);
    if(findPlayer(socketID).posicionY < 2900)
    findPlayer(socketID).posicionY+=4;
    break;
    case 'right':
    if(findPlayer(socketID).posicionX < 2876)
    findPlayer(socketID).posicionX+=4;
    break;
    case 'left':
    if(findPlayer(socketID).posicionX  > 100)
    findPlayer(socketID).posicionX-=4;
    break;
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
        playersMatch[i] = playersMatch[i].filter(Boolean);
for(j=0;j<playersMatch[i].length;j++)
      {
            switch(j){
              case 0:
              playersMatch[i][j].rol = 0;
              playersMatch[i][j].posicionX = 1300;
              playersMatch[i][j].posicionY = 1500;
              break;
          case 1:
          playersMatch[i][j].rol = 1;
          playersMatch[i][j].posicionX = 1600;
          playersMatch[i][j].posicionY = 1500;
              break;
          case 2:
          playersMatch[i][j].rol = 2;
          playersMatch[i][j].posicionX = 1900;
          playersMatch[i][j].posicionY = 1500;
              break;
          case 3:
              player.rol = 0;
              break;
          case 5:
              player.rol = 1;
              break;
          case 6:
              player.rol = 2;
              break;
            }
          
        }
        
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
    if(io.sockets.adapter.rooms[room].length==3){
      var data;
      data=playersMatch[room];
      console.log("start game");
      allPlayers.push(playersMatch[room]);
      io.to(room).emit('startGame',data); 
      room++;
     
      
    } 
  }
  
}


function updateBullet(i){
if(bulletsMatch[i]!=null)
  bulletsMatch[i].forEach(element => {
    

    //Calculadmos la distancia recorrida de la bala para borrarla
    switch(element.rol){
  
    case 0:
    element.x+=2*Math.cos(element.rotation-1.5);
    element.y+=2*Math.sin(element.rotation-1.5);

    var a = element.x-element.x0;
    var b = element.y-element.y0;
 
 
   // console.log(Math.sqrt(Math.pow(a,2)+Math.pow(b,2)));
     //Borrado de balas
     if(Math.sqrt(Math.pow(a,2)+Math.pow(b,2)  > 480000))
     {
       
       //console.log(element.room);
       var posicion = bulletsMatch[i].indexOf(element);
      
       
       delete bulletsMatch[i][posicion];
       bulletsMatch[i] = bulletsMatch[i].filter(Boolean);
      
 
     }
    case 1:
    element.x+=4*Math.cos(element.rotation-1.5);
    element.y+=4*Math.sin(element.rotation-1.5);

    var a = element.x-element.x0;
    var b = element.y-element.y0;
 
 
   // console.log(Math.sqrt(Math.pow(a,2)+Math.pow(b,2)));
     //Borrado de balas
     if(Math.sqrt(Math.pow(a,2)+Math.pow(b,2)  > 480000))
     {
       
       //console.log(element.room);
       var posicion = bulletsMatch[i].indexOf(element);
       delete bulletsMatch[i][posicion];
       bulletsMatch[i] = bulletsMatch[i].filter(Boolean);
     
 
     }

    case 2:
    element.x+=6*Math.cos(element.rotation-1.5);
    element.y+=6*Math.sin(element.rotation-1.5);

    var a = element.x-element.x0;
    var b = element.y-element.y0;
 
 
   // console.log(Math.sqrt(Math.pow(a,2)+Math.pow(b,2)));
     //Borrado de balas
     if(Math.sqrt(Math.pow(a,2)+Math.pow(b,2)  > 7800000))
     {
       
       //console.log(element.room);
       var posicion = bulletsMatch[i].indexOf(element);
      
       
       delete bulletsMatch[i][posicion];
       bulletsMatch[i] = bulletsMatch[i].filter(Boolean);
     
 
     }

    }
   
  });

}
var i;
setInterval( function() { updatePlayers(); }, 1000/30 );
function updatePlayers(){

for(i=0; i<room;i++)
  {
    updateBullet(i);
    
    io.to(i).emit('updatePlayers',playersMatch[i]);
    io.to(i).emit('updateBullets',bulletsMatch[i]); 

  }
}

function fillPlayer(socket){
  var player = new Object();
  //asignamos como id, nuestro id socket
  player.id=socket.id;
  //Asignamos el equipo ES POSIBLE QUE SE PUEDA ELIMINAR
 if(io.sockets.adapter.rooms[room].length>=1 && io.sockets.adapter.rooms[room].length<=3)
    player.team = 0;
 if(io.sockets.adapter.rooms[room].length>=4 && io.sockets.adapter.rooms[room].length<=6)
    player.team = 1;
    //asignamos el  y posicion inicial
    

    switch(io.sockets.adapter.rooms[room].length) {
      case 1:
          player.rol = 0;
          player.fire = false;
          player.posicionX = 1300;
          player.posicionY = 1500;
          break;
      case 2:
          player.rol = 1;
          player.fire = false;
          player.posicionX = 1600;
          player.posicionY = 1500;
          break;
      case 3:
          player.rol = 2;
          player.fire = false;
          player.posicionX = 2900;
          player.posicionY = 1500;
          break;
      case 4:
          player.rol = 0;
          break;
      case 5:
          player.rol = 1;
          break;
      case 6:
          player.rol = 2;
          break;
  };
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
MongoClient.connect(url, function(err, db) {
  db.collection("usuarios").find(query).toArray(function(err, result) {
    if (err) throw err; 
    console.log(result.length);
    if(result.length == 0)
      {
         db.collection("usuarios").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
      }
      else{console.log("usuario escogido");}
    db.close();
  });


});

	res.send(req.body);
 
});




// server.listen(8080, function() {  
//   console.log("Servidor corriendo en http://localhost:8080");
// }); 