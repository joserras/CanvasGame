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
});

//borramos usuarios de nuestro array players tras desconectarse
function deleteUser(id){
      var posicion = allPlayers.indexOf(id);
      delete allPlayers[posicion];
      allPlayers = allPlayers.filter(Boolean);
      posicion = playersMatch.indexOf(id);
      delete playersMatch[posicion];
      playersMatch = playersMatch.filter(Boolean);
      console.log(posicion);
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

function fillPlayer(socket){
  var player = new Object();
  //asignamos como id, nuestro id socket
  player.id=socket.id;
  //Asignamos el equipo
 if(io.sockets.adapter.rooms[room].length>=1 && io.sockets.adapter.rooms[room].length<=3)
    player.team = 0;
 if(io.sockets.adapter.rooms[room].length>=4 && io.sockets.adapter.rooms[room].length<=6)
    player.team = 1;
    //asignamos el  y posicion inicial
    console.log("joder");
    console.log(io.sockets.adapter.rooms[room].length);
    switch(io.sockets.adapter.rooms[room].length) {
      case 1:
          player.rol = 0;
          player.posicionX = 1450;
          player.posicionY = 1500;
          break;
      case 2:
          player.rol = 1;
          player.posicionX = 1500;
          player.posicionY = 1500;
          break;
      case 3:
          player.rol = 2;
          player.posicionX = 1550;
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

   //Creamos la matriz solo con el primer jugador
   if(io.sockets.adapter.rooms[room].length==1)
      playersMatch[room] = new Array(6);

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




server.listen(8080, function() {  
  console.log("Servidor corriendo en http://localhost:8080");
}); 