socket = io()

socket.on("mensaje", (texto) => {
    $(".toast").toast({delay:5000})
    $(".toast-body").html(texto);
    $(".toast").toast('show');
})