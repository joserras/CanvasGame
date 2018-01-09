var socket;
var advises = [10];
//ME
var player;
var players;
//Sprite
var ship;
var ship2;
var ship3;
var cursors;
var balasMatch;
//weapons
var weapon;
var fireButton;






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
    socket = io.connect('http://localhost:5000', { 'forceNew': true });
    var usuario = data.nickname.value;
    loading();
    activateSockets();
      $.ajax({
            type: "POST", 
            url: "/login", 
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
var balasSpriteMatch=[];
//Activamos los sockets en escucha
function activateSockets(){
    socket.on('startGame', function(data) {
        findPlayer(data,socket.id);
       players = data;
       
        activateGame();      
    })
    socket.on('updatePlayers', function(data) {
        findPlayer(data,socket.id);
        players = data;
       // console.log(player);
            
    })
    socket.on('updateBullets', function(data) {
        balasMatch = data;
        if(balasMatch!=null)
            for(i=0;i<balasMatch.length;i++)
            {   if(balasMatch[i]!=null && balasSpriteMatch[i]==null){
                    balasSpriteMatch[i]=game.add.sprite(balasMatch[i].x, balasMatch[i].y, 'bullet');
                    game.physics.p2.enable(balasSpriteMatch[i], true);                 
                    balasSpriteMatch[i].body.setCircle(6);
                    balasSpriteMatch[i].body.miBala = balasMatch[i].id; 
                    
                    balasSpriteMatch[i].body.onBeginContact.add(blockHitBullet, this);
                    balasSpriteMatch[i].body.onEndContact.add(blockHitEndBullet, this);     
                    
                }
            }
      
        //console.log(datosbalas);
            
    })
}


function blockHitBullet (body, bodyB, shapeA, shapeB, equation) {	

 
if(equation!=null && equation[0].shapeB!=null && equation[0].shapeB.body.parent!=null){
    
    
    if(equation[0].shapeB.body.parent.miBala!=null){
       
        for(i=0;i<balasMatch.length;i++)
        {
            if(Math.trunc(equation[0].shapeB.body.parent.x)==Math.trunc(balasMatch[i].x) && Math.trunc(equation[0].shapeB.body.parent.y)==Math.trunc(balasMatch[i].y))
            {
                console.log(body);
                console.log(equation);
                var bullet = game.add.sprite(balasMatch[i].x, balasMatch[i].y, 'bullet');
                if(body!=null)
                socket.emit('bulletHit',{bullet:balasMatch[i], ship:body.idPlayer });
            }
        }
    
    }
     else{
        
        
        for(i=0;i<balasMatch.length;i++)
        {
            
            if(Math.trunc(equation[0].shapeA.body.parent.x)==Math.trunc(balasMatch[i].x) && Math.trunc(equation[0].shapeA.body.parent.y)==Math.trunc(balasMatch[i].y))
            {  
               
               
                console.log(body.idPlayer);
                if(body!=null)
                socket.emit('bulletHit',{bullet:balasMatch[i], ship:body.idPlayer });
            }
        }
     
     }
}



            
        }
    
        function blockHitEndBullet (body, bodyB, shapeA, shapeB, equation) {
           	console.log("termino");
        }

// function deleteUser(id){
//     var posicion = players.indexOf(id);
//     delete players[posicion];
//     players = players.filter(Boolean);

    
// }
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
}

     
