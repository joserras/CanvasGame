

//Envía el nombre de usuario y su socket.id al servidor
function login(data){
    var socket = io.connect('http://localhost:8080', { 'forceNew': true });
    var usuario = data.nickname.value;
    activateGame();
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

