var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

    var io = req.app.get('socketio');

    io.on('connection', function(socket){
        socket.on('chat message', function(msg){
            console.log(msg);
            io.emit('chat message', msg);
          });
    });

    res.render('chat/index', 
            { 
                title: 'Chat'
            });
});

module.exports = router;
