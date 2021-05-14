//for making the table
function writeCell(row, text) {
    let cell = document.createElement("td");
    let cellText = document.createTextNode(text);
    cell.appendChild(cellText);
    row.appendChild(cell);
}
function writeTable() {
    if(allReady) {return}
    let divThing = document.getElementById("lobby-people");
    //removing previous table
    document.getElementById('currtable').remove()
    //making table with id
    let tbl = document.createElement("table");
    let tblBody = document.createElement("tbody");
    tbl.id = 'currtable'
    //making header
    let head = document.createElement("tr");
    writeCell(head, 'Player Number')
    writeCell(head, 'Name')
    writeCell(head, 'ready')
    tblBody.appendChild(head)
    // creating all cells
    for (let i = 0; i < peopleInLobby.length; i++) {
        let row = document.createElement("tr");
        row.style.backgroundColor = peopleInLobby[i].color

        if (i == playerObj.index) {row.classList.add('row-bolden')}
        writeCell(row, i + 1)
        writeCell(row, peopleInLobby[i].name)
        if (peopleInLobby[i].ready) {
            writeCell(row, 'ready')
        } else {
            writeCell(row, 'not ready')
        }
        
        tblBody.appendChild(row)
    }
    tbl.appendChild(tblBody)
    divThing.appendChild(tbl)
}

//hide and unhide menu
function showMenu() {
    document.getElementsByClassName('player-profile')[0].classList.toggle('unhide')
}

//player info change
function infoElement(elemName, attr) {
    let element = document.getElementById(elemName)
    element.addEventListener('change', () => {
        playerObj[elemName] = element[attr];
        socket.emit('info-change', { number: playerObj.index, updateInfo: element[attr], infoType: elemName })
    })
}

//ask server to start game
function askStartGame() {
    socket.emit('start-game',playerObj.index)
}

//flag or something
function flagKeyPress(bool) {
    if(!playerObj[bool]) {
        playerObj[bool] = true;
        socket.emit('info-change', {number: playerObj.index, updateInfo: playerObj[bool], infoType: bool})
    }
}

//test function
function test() {
    socket.emit('button-pressed', 'come onnn')
}