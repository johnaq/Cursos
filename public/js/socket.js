socket = io()

socket.on('connect', function () {
    socket.send('hi');

    socket.on("message", (texto) => {
        $(".toast").toast({delay:5000})
        $(".toast-body").html(texto);
        $(".toast").toast('show');
    });
  });



