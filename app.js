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
var contador=0
var usuarios = ["primer"];
//CONEXION DE LOS USUARIOS
io.on('connection', function(socket) {  
  socket.on('disconnect', function(){
     console.log('user disconnected');
     contador--;
     var posicion = usuarios.indexOf(socket.id);
     delete usuarios[posicion];
     usuarios = usuarios.filter(Boolean);
  });
  contador++;
  
  console.log('Alguien se ha conectado con Sockets');
  joinInRoom(socket);
  usuarios.push(socket.id);
  io.sockets.emit('conectados', contador);
    socket.on('mouse',function(data) {    
           socket.broadcast.emit('mouse', data);
          } );      
});

//comprueba si esta la sala llena e infresa en la room
function joinInRoom(socket){ 
  socket.join(room);
  if(io.sockets.adapter.rooms[room]!=null){
    if(io.sockets.adapter.rooms[room].length==3){
      var data;
      data='tudel';
      console.log("start game");
      io.to(room).emit('startGame',data); 
      room++; 
    } 
  }
  
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