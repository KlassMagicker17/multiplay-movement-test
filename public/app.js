console.clear()
const socket = io();
var playerObj = {
    name: "New Player",
    ready: true,
    color: "white",
    index: -1,
    x: 0,
    y: 0,
    up: false,
    down: false,
    left: false,
    right: false
}
var peopleInLobby = []
var nameInput, readyInput;
var allReady = false;
var menuBool = false


//give index and people here to this new player
socket.on('player-join', data => {
    playerObj.index = data.playerNum
    peopleInLobby = data.allPeople
    peopleInLobby[playerObj.index] = playerObj
    console.log(playerObj)
    socket.emit('player-connect-data', playerObj)
    writeTable()
})

//handle when someone disconnects
socket.on('change-num', data => {
    peopleInLobby.splice(data.disconnectIndex, 1)
    playerObj.index = parseInt(data.newNum) + 1
    writeTable()
})

//handle when someone connects ; add them to peopleInLobby
socket.on('new-player', data => {
    peopleInLobby.push(data)
    writeTable()
})

//handle updating of info from server
socket.on('info-change-client', data => {
    peopleInLobby[parseInt(data.number)][data.infoType] = data['updateInfo']
    writeTable()
})

//handle this player info change
addEventListener('load', () => {
    //name
    infoElement('name', 'value')
    //color
    infoElement('color', 'value')
    //ready
    infoElement('ready', 'checked')

    writeTable()
})

//if not everyone is not ready
socket.on('not-all-ready', data => alert(data))

//when everyone is ready
socket.on('start-game-command', () => startGame())

//detect movement
addEventListener('keydown', event => {
    switch (event.key) {
        case 'w':
            flagKeyPress('up');
            break;
        case 's':
            flagKeyPress('down');
            break;
        case 'a':
            flagKeyPress('left');
            break;
        case 'd':
            flagKeyPress('right');

            break;
    }
})
addEventListener('keyup', event => {
    switch (event.key) {
        case 'w':
            playerObj.up = false;
            socket.emit('info-change', { number: playerObj.index, updateInfo: false, infoType: 'up' })
            break;
        case 's':
            socket.emit('info-change', { number: playerObj.index, updateInfo: false, infoType: 'down' })
            playerObj.down = false;
            break;
        case 'a':
            socket.emit('info-change', { number: playerObj.index, updateInfo: false, infoType: 'left' })
            playerObj.left = false;
            break;
        case 'd':
            playerObj.right = false;
            socket.emit('info-change', { number: playerObj.index, updateInfo: false, infoType: 'right' })
            break;
    }
})

//resyncing with server
setInterval(() => {
    socket.emit('resync-data', playerObj)
}, 10)

socket.on('server-resync', data => {
    peopleInLobby[data.index] = data
})