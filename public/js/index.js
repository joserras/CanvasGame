

//Envía el nombre de usuario y su socket.id al servidor
function login(data){
    var socket = io.connect('http://localhost:8080', { 'forceNew': true });
    console.log(data);
    var usuario = data.nickname.value;
    console.log(usuario);
      $.ajax({
            type: "POST", 
            url: "/login", 
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