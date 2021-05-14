const express = require('express');
const path = require('path');
const http = require('http');
const PORT = process.env.PORT
const socketio = require('socket.io');
const { Socket } = require('dgram');
const app = express();
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, "public")))

//start server
server.listen(PORT, () => console.log(`Server Running on ${PORT}`))

//handle socket connection from client
var clients = []
var clientProfiles = []
io.on('connection', socket => {
    //On new player
    let newPlayer = {
        name: "New Player",
        ready: false,
        index: -1,
        color: "white",
        x: 0,
        y: 0,
        up: false,
        down: false,
        left: false,
        right: false 
    }
    clientProfiles.push(newPlayer)
    clients.push(socket)
    socket.emit('player-join',
        {
            playerNum: clients.length-1,
            allPeople: clientProfiles
        })

    socket.on('player-connect-data', data => {
        console.log(data)
        clientProfiles[data.index] = data
    })

    socket.broadcast.emit('new-player', clientProfiles[clients.length - 1])

    //On disconnection 
    socket.on('disconnect', () => {
        let disconnectIndex = clients.indexOf(socket)
        clients.splice(disconnectIndex, 1)
        clientProfiles.splice(disconnectIndex, 1)
        //readjust number
        clients.forEach((sock, i) => {
            socket.broadcast.to(sock.id).emit('change-num', { newNum: i, disconnectIndex: disconnectIndex })
        })
    })
    //on button press show Player Number
    socket.on('button-pressed', mes => console.log(clientProfiles))

    //handle name-change
    socket.on('info-change', data => {
        clientProfiles[parseInt(data.number)][data.infoType] = data['updateInfo'];
        io.emit('info-change-client', data)
    })

    //start game
    socket.on('start-game', () => {
        let allPlayerReady = true
        clientProfiles.forEach(player => {
            if (!player.ready) {
                allPlayerReady = false
            }
        })
        if (allPlayerReady) {
            io.emit('start-game-command', '')
        } else {
            socket.emit('not-all-ready', 'not everyone is ready!')
        }
    })

    socket.on('resync-data', data =>{
        socket.broadcast.emit('server-resync', data)
    })
})
