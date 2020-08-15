/*
* Yo! Code is free for use :D
* Author: https://twitter.com/Lreeeon
*/


class Component {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
    isCollidedW(otherCpnt) { // not used
        let myleft = this.x,
            myright = this.x + this.width,
            mytop = this.y,
            mybottom = this.y + this.height
        let otherleft = otherCpnt.x,
            otherright = otherCpnt.x + otherCpnt.width,
            othertop = otherCpnt.y,
            otherbottom = otherCpnt.y + otherCpnt.height
        let isCollided = true
        if (mybottom < othertop || mytop > otherbottom || myright < otherleft || myleft > otherright) {
            isCollided = false
        }
        return isCollided
    }

    // animated sprite
    setFrameArr(imgArr) {
        if (!Array.isArray(imgArr)) {
            return
        }
        for (const img in imgArr) {
            if (!img) {
                return
            }
        }
        this.frameArr = imgArr
        this.currFrame = 0
    }
    getCurFrame() {
        return this.frameArr[this.currFrame]
    }
    shiftFrame() {
        if (this.currFrame + 1 >= this.frameArr.length) {
            this.currFrame = 0
        } else {
            this.currFrame += 1
        }
    }
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
        this.x += this.velX
        this.y += this.velY
        this.hitBorder()

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
    }
    hitBorder() {
        let bottom = myMovingCanvas.canvas.height - this.height
        let right = myMovingCanvas.canvas.width - this.width
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

class Rock extends Component {
    constructor(text, x, y) {
        super(x, y, 250, 150)
        this.text = text
        this.setFrameArr([document.getElementById("rock"), document.getElementById("rock2")])
    }
    update(ctx) {
        ctx.drawImage(this.getCurFrame(), this.x, this.y, this.width, this.height)

        ctx.font = "32px Arial"
        ctx.fillStyle = "blue"
        ctx.fillText(this.text, this.x + 60, this.y + 70)
    }
}

class PatternFill {

}


let myMovingCanvas = {
    canvas: document.getElementById("myCanvas"),
    start: function () {
        this.canvas.width = 500
        this.canvas.height = 600
        this.context = this.canvas.getContext("2d")
        this.frameNo = 0
        this.interval = setInterval(() => {
            this.update()
        }, 33) // 30 FPS
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    update: function () {
        this.clear()
        this.frameNo += 1
        if ( (this.frameNo / 9) % 1 == 0 ) {
            // every 9 frames
            for (i = 0; i < myButtons.length; i += 1) {
                myButtons[i].shiftFrame()
            }
        }
        ctx = this.context
        floatingThing.update(ctx)
        for (i = 0; i < myButtons.length; i += 1) {
            myButtons[i].update(ctx)
        }
    }
}


function onKeyPr(e) {
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
function onRientation(e) {
    console.log("AAAAAAAAAAAAA");
    var x = event.beta;  // In degree in the range [-180,180]
    var y = event.gamma; // In degree in the range [-90,90]
  
    output.innerHTML  = "beta : " + x + "\n";
    output.innerHTML += "gamma: " + y + "\n";
  
    // Because we don't want to have the device upside down
    // We constrain the x value to the range [-90,90]
    if (x >  90) { x =  90};
    if (x < -90) { x = -90};
  
    // To make computation easier we shift the range of 
    // x and y to [0,180]
    x += 90;
    y += 90;
  
    // 10 is half the size of the ball
    // It center the positioning point to the center of the ball
    ball.style.top  = (maxY*y/180 - 10) + "px";
    ball.style.left = (maxX*x/180 - 10) + "px";
}

let floatingThing
let myButtons = []

function main() {
    floatingThing = new Character(30, 30, 10, 120)
    myButtons.push(new Rock("Re calibrate", 100, 140))
    myButtons.push(new Rock("Re position", 200, 240))
    myButtons.push(new Rock("About", 999, 999))

    if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
        window.addEventListener('deviceorientation', onRientation); // lmao
    } else {
        window.addEventListener("keypress", onKeyPr)
    }
    myMovingCanvas.start()
}