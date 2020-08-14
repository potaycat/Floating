/*
* YO
*/


class Component {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    // crashWith = function(otherobj) {
    //     let myleft = this.x
    //     let myright = this.x + this.width
    //     let mytop = this.y
    //     let mybottom = this.y + this.height

    //     let otherleft = otherobj.x
    //     let otherright = otherobj.x + otherobj.width
    //     let othertop = otherobj.y
    //     let otherbottom = otherobj.y + otherobj.height
    //     let crash = true
    //     if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
    //         crash = false
    //     }
    //     return crash
    // }
}



class Character extends Component {
    constructor(width, height, x, y) {
        super(x, y, width, height)

        this.velX = 0
        this.velY = 0
        this.accelX = 0
        this.accelY = 0

        this.dragFrce = 0.3 // slipperiness
    }

    update(ctx) {
        this.newPos()

        ctx.fillStyle = "red"
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    newPos() {
        if (this.velX < this.accelX) {
            this.velX += this.dragFrce
        }
        else if (this.velX > this.accelX) {
            this.velX -= this.dragFrce
        }
        if (this.velY < this.accelY) {
            this.velY += this.dragFrce
        }
        else if (this.velY > this.accelY) {
            this.velY -= this.dragFrce
        }

        this.x += this.velX
        this.y += this.velY
        this.hitBorder()
    }

    hitBorder() {
        let bottom = myGameArea.canvas.height - this.height
        let right = myGameArea.canvas.width - this.width
        if (this.y > bottom) {
            this.y = bottom
            this.accelY = 0
        }
        else if (this.y < 0) {
            this.y = 0
            this.accelY = 0
        }
        if (this.x > right) {
            this.x = right
            this.accelX = 0
        }
        else if (this.x < 0) {
            this.x = 0
            this.accelX = 0
        }
    }


}


class Button extends Component {
    img = document.getElementById("rock")

    constructor(text, x, y) {
        super(x, y, 250, 150)

        this.text = text
    }

    update(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)

        ctx.font = "32px Arial"
        ctx.fillStyle = "blue"
        ctx.fillText(this.text, this.x + 60, this.y +70)

        // var myGif = GIF();
        // let patSrc = document.getElementById("gif_test")
        // ctx.drawImage(patSrc, 10, 30);

        // var myGif = GIF();
        // myGif.load(patSrc);
        // var pattern = ctx.createPattern(patSrc, 'repeat');
        // ctx.fillStyle = pattern;
        // // ctx.fillRect(0, 0, 100, 800);
        // ctx.drawImage(myGif, this.x, this.y, this.width, this.height)
    }
}




let myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 500
        this.canvas.height = 600
        this.context = this.canvas.getContext("2d")
        document.body.insertBefore(this.canvas, document.body.childNodes[0])
        document.getElementById("eee").addEventListener("keypress", onKeyPr)
        this.frameNo = 0
        this.interval = setInterval(updateGameArea, 33) // 30 FPS
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    loadScene: function () {
        ctx = this.canvas.getContext("2d")
        bg = document.getElementById("gif_test")
        ctx.drawImage(bg, 0, 0, 500, 500)
    }
}

function updateGameArea() {
    ctx = myGameArea.context

    function everyinterval(n) {
        if ((myGameArea.frameNo / n) % 1 == 0) { return true }
        return false
    }

    
    myGameArea.clear()
    myGameArea.frameNo += 1
    if (everyinterval(150)) {
        // every 150 frames
    }

    myGameArea.loadScene()
    floatingThing.update(ctx)
    for (i = 0; i < myButtons.length; i += 1) {
        // myButtons[i].update(ctx)
    }
}

function onKeyPr(e) {
    console.log(e.key)
    if (e.key == "s") {
        floatingThing.accelY = 3
    }
    if (e.key == "w") {
        floatingThing.accelY = -3
    }
    if (e.key == "d") {
        floatingThing.accelX = 3
    }
    if (e.key == "a") {
        floatingThing.accelX = -3
    }
    if (e.key == "g") {
        floatingThing.accelX = 0
        floatingThing.accelY = 0
    }
}




let floatingThing
let myButtons = [];
let reCalBtn
let rePosBtn
let aboutBtn

function main() {
    floatingThing = new Character(30, 30, 10, 120)
    myButtons.push(new Button("Re calibrate", 100, 140))
    myButtons.push(new Button("Re position", 200, 240))
    myGameArea.start()
}
