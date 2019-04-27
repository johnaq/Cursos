socket = io()

socket.on('connect', function () {
    socket.on("message", (texto) => {
        $(".toast").toast({delay:5000})
        $(".toast-body").html(texto);
        $(".toast").toast('show');
    });
  });


  $(function () {
    var socket = io();
    $('#chatInput').on('keypress', function (e) {
        if(e.which === 13){
            socket.emit($('#chatInput').val());
            $('#chatInput').val('')
        }
    });
    socket.on('chat message', function(msg){
        

        var html = `<div class="answer left">
        <div class="avatar">
          <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="User name">
          <div class="status online"></div>
        </div>
        <div class="name">Alexander Herthic</div>
        <div class="text">
          ${msg}
        </div>
        <div class="time">5 min ago</div>
      </div>`;
      $('.chat-body').append(msg);

      });
  });