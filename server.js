const express = require('express'); //We'll be using express to help us 
const app = express();
const server = require('http').Server(app);

const { v4: uuidv4 } = require('uuid'); //Import uuid library which will generate unique IDs, change the link 


const io = require('socket.io')(server) //Importing socket io 

const { ExpressPeerServer } = require('peer'); //Import peer
const peerServer = ExpressPeerServer(server, {
  debug: true
});

app.set('view engine','ejs'); //Setting engine to ejs

app.use('/peerjs', peerServer); //which server is the peer going to use 
app.use(express.static('public'));

app.get('/',(req,res) => {
    res.redirect(`/${uuidv4()}`); //Generate a unique ID and redirect you to it
})

app.get('/:room', (req,res) =>{
    res.render('room', { roomid: req.params.room }) //render the room
} ) //room is a parameter

io.on('connection',socket =>{ //if the event, that is, connection is successful, we execute this
    socket.on('join-room' , (roomid, userid) => { //on the event join room
        socket.join(roomid); //joined the room using the ID
        socket.to(roomid).emit('user-connected', userid);//broadcast the message that the user has been connected to the room

        socket.on('message', message => { //listen for the message
            io.to(roomid).emit('sendMessage', message) //send the message to the room id
        })
    })
})

server.listen(process.env.PORT||3030);