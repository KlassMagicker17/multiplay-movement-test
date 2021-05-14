var cvs, c;
var size = 10
var speed = 1
function startGame() {
    allReady = true
    cvs = document.getElementById('main')
    c = cvs.getContext('2d')
    cvs.width = 500
    cvs.height = 500
    document.getElementById('startButton').style.display = 'none'
    document.getElementById('currtable').style.display = 'none'
    c.fillStyle = 'red'
    c.fillRect(0,0,cvs.width,cvs.height)
    setInterval(mainGame,10)
    mainGame()
}
function mainGame() {
    c.fillStyle = 'red'
    c.fillRect(0,0,cvs.width,cvs.height)
    if(playerObj.up) {
        playerObj.y -= speed
    }
    if(playerObj.down) {
        playerObj.y += speed
    } 
    if(playerObj.left) {
        playerObj.x -= speed
    }
    if(playerObj.right) {
        playerObj.x += speed
    }
    peopleInLobby.forEach((p,i) => {
        c.fillStyle = p.color
        c.fillRect(p.x,p.y,size,size)
        if(true) {

            if(p.up) {
                p.y -= speed
            }
            if(p.down) {
                p.y += speed
            }
            if(p.left) {
                p.x -= speed
            }
            if(p.right) {
                p.x += speed
            }
        }
    })
}