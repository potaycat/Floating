/*
* Yo! Code is free for use :D
* Author: https://twitter.com/Lreeeon
*/

let matrix = document.getElementById('svg1').createSVGMatrix()

class Sprite {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.frames = []
        this.curFrame = 0
        this.framePer = 1
        this._frmPrCountr = 0
        this.hasTransition = false
    }
    isCollidedW(otherCpnt) {
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
    setAnim(imgArr, framePer = 5) {
        if (!Array.isArray(imgArr)) {
            console.error("setAnim() accepts array of Images only")
        }
        for (const img in imgArr) {
            if (!img) {
                console.error("Faulty sprite yo")
            }
        }
        this.frames = imgArr
        this.curFrame = 0
        this.framePer = framePer
    }
    getCurFrame() {
        return this.frames[this.curFrame]
    }
    shiftFrame() {
        if (this.curFrame + 1 >= this.frames.length) {
            this.curFrame = 0
            if (this.hasTransition) {
                this.onAnimCycleDone()
            }
        } else {
            this.curFrame += 1
        }
    }
    update() {
        this._frmPrCountr += 1
        if (this._frmPrCountr >= this.framePer) {
            this.shiftFrame()
            this._frmPrCountr = 0
        }
    }
    draw(ctx) {
        // ctx.fillStyle = this.status || "red"
        // ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.drawImage(this.getCurFrame(), this.x, this.y, this.width, this.height)
    }
}

class Character extends Sprite {
    constructor(x, y, width, height) {
        super(x, y, width, height)
        this.velX = 0
        this.velY = 0
        this.accelX = 0
        this.accelY = 0
        this.status = "green"

        this.dragFrce = 0.22 // slipperiness
    }
    update() {
        super.update()
        if (this.velX < this.accelX) {
            this.velX += this.dragFrce
        } else if (this.velX > this.accelX) {
            this.velX -= this.dragFrce
        }
        if (this.velY < this.accelY) {
            this.velY += this.dragFrce
        } else if (this.velY > this.accelY) {
            this.velY -= this.dragFrce
        }
        this.x += this.velX
        this.y += this.velY
        this.hitBorder()
    }
    hitBorder() {
        let bottom = myMovingCanvas.canvas.height - this.height
        let right = myMovingCanvas.canvas.width - this.width
        if (this.y > bottom) {
            this.y = bottom
            this.velY = -this.velY
            this.accelY = -this.accelY
            window.navigator.vibrate(50)
        } else if (this.y < 0) {
            this.y = 0
            this.velY = -this.velY
            this.accelY = -this.accelY
            window.navigator.vibrate(50)
        }
        if (this.x > right) {
            this.x = right
            this.velX = -this.velX
            this.accelX = -this.accelX
            window.navigator.vibrate(50)
        } else if (this.x < 0) {
            this.x = 0
            this.velX = -this.velX
            this.accelX = -this.accelX
            window.navigator.vibrate(50)
        }
    }
}

class Rock extends Sprite {
    constructor(x, y, w=250, h=210, text="", rockPicArr, framePer=21) {
        super(x, y, w, h)
        this.text = text
        this.setAnim(rockPicArr ||
            [document.getElementById("rock"), document.getElementById("rock2")]
        , framePer)
    }
    draw(ctx) {
        super.draw(ctx)
        ctx.font = "32px Arial"
        ctx.fillStyle = "blue"
        ctx.fillText(this.text, this.x + 60, this.y + 70)
    }
}

class PatternFill extends Sprite {
    constructor(width, height, spriteArr, framePer=10, sclF=1) {
        super(0, 0, width, height)
        this.setAnim(spriteArr, framePer)
    }
    draw(ctx) {
        let pat = ctx.createPattern(this.getCurFrame(), 'repeat')
        ctx.fillStyle = pat
        pat.setTransform(matrix.scale(0.9))
        ctx.fillRect(0, 0, this.width, this.height)
    }
    isCollidedW() {
        return false
    }
}

class Feesh extends Character {
    spriteArr = {
        onWater: [
            document.getElementById("feesh1"),
        ],
        sink: [],
        toLand: [],
        onLand: [],
        toWater: [],
        float: [],
    }
    constructor() {
        super(20, 120, 50, 50)
        this.hasTransition = true
        this.prevAnim = "onWater"
        this.curAnim = "onWater"
        this.isCollided = false
        this.desire2StayOnLand = 0.03
        this.setAnim(this.spriteArr["onWater"], 10)
    }
    onAnimCycleDone() {
        if (this.isCollided) {
            switch (this.curAnim) {
                case "onWater":
                    this.curAnim = "sink"
                    this.status = "yellow"
                    break
                case "sink":
                    this.curAnim = "toLand"
                    this.status = "yellow"
                    break
                case "toLand":
                    this.curAnim = "onLand"
                    this.status = "green"
                    break
                case "onLand":
                    this.curAnim = "onWater"
                    this.status = "green"
                    break
                case "toWater":
                    this.curAnim = "toLand"
                    this.status = "yellow"
                    break
                case "float":
                    this.curAnim = "sink"
                    this.status = "yellow"
                    break
            }
        } else {
            switch (this.curAnim) {
                case "onWater":
                    this.curAnim = "onWater"
                    this.status = "green"
                    break
                case "sink":
                    this.curAnim = "onWater"
                    this.status = "green"
                    break
                case "toLand":
                    this.curAnim = "toWater"
                    this.status = "yellow"
                    break
                case "onLand":
                    this.curAnim = "toWater"
                    this.status = "yellow"
                    break
                case "toWater":
                    this.curAnim = "float"
                    this.status = "yellow"
                    break
                case "float":
                    this.curAnim = "onWater"
                    this.status = "yellow"
                    break
            }
        }

        if (this.curAnim != this.prevAnim) {
            this.prevAnim = this.curAnim
            this.setAnim(this.spriteArr["onWater"], 10)
        }
    }
    update() {
        super.update()
        if (this.isCollided) {
            fsh.accelX -= Math.sign(fsh.accelX) * this.desire2StayOnLand
            fsh.accelY -= Math.sign(fsh.accelY) * this.desire2StayOnLand
        }
    }
    draw(ctx) {
        // TODO: rotate
        // ctx.translate(-this.x, -this.y)
        // ctx.rotate(0.1)
        // super.draw(ctx)
        let img = this.getCurFrame()
        // ctx.setTransform(matrix.rotate(45))
        ctx.drawImage(img, this.x-75, this.y-75, 200, 200)
    }
}


const fsh = new Feesh()
const myMovingCanvas = {
    canvas: document.getElementById("my-canvas"),
    elemnts: [],
    start: function () {
        this.canvas.width = window.screen.width
        this.canvas.height = window.screen.height
        this.context = this.canvas.getContext("2d")
        this.frameNo = 0
        this.interval = setInterval(() => {
            this.update()
        }, 33) // 30 FPS

        this.elemnts = this.elemnts.concat([
            new PatternFill(this.canvas.width, this.canvas.height, [
                document.getElementById("water1"),
                document.getElementById("water2"),
                document.getElementById("water3"),
                document.getElementById("water4"),
                document.getElementById("water5"),
                document.getElementById("water6")
            ], 17),
            new PatternFill(this.canvas.width, this.canvas.height, [
                document.getElementById("water-refl1"),
                document.getElementById("water-refl2")
            ], 31),
            new Rock(185, 150),
            // new Rock(200, 240, "Rocc 2")
        ])

        setInterval(() => {
            fsh.accelX = Math.random() * 4 - 2
            fsh.accelY = Math.random() * 4 - 2
        }, 7000)
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    update: function () {
        ctx = this.context
        els = this.elemnts
        isCollided = false

        this.clear()
        this.frameNo += 1
        if ((this.frameNo / 5) % 1 == 0) {
            // every 5 frames
        }
        els.forEach(el => {
            el.update()
            if (el.isCollidedW(fsh)) {
                // feesh outa water
                isCollided = true
            }
            el.draw(ctx)
        })
        if (isCollided && !fsh.isCollided) {
            fsh.isCollided = true
            window.navigator.vibrate(50)
        } else {
            fsh.isCollided = isCollided
        }
        fsh.update()
        fsh.draw(ctx)
    }
}


function onKeyPr(e) {
    // console.log(e.key)
    if (["ArrowDown", "s", "S"].includes(e.key)) {
        fsh.accelY = 2
    } else if (["ArrowUp", "w", "W"].includes(e.key)) {
        fsh.accelY = -2
    } else if (["ArrowRight", "d", "D"].includes(e.key)) {
        fsh.accelX = 2
    } else if (["ArrowLeft", "a", "A"].includes(e.key)) {
        fsh.accelX = -2
    } else {
        fsh.accelX = 0
        fsh.accelY = 0
    }
}
function onRientation(e) {
    // console.log(e.gamma)
    fsh.accelX = e.gamma * .075
    fsh.accelY = e.beta * .075
}

function main() {
    window.addEventListener('deviceorientation', onRientation) // lmao
    window.addEventListener("keydown", onKeyPr)
    myMovingCanvas.start()

    window.addEventListener("load", e => {
        var image = document.querySelector('img')
        var isLoaded = image.complete && image.naturalHeight !== 0
        alert(isLoaded);
    })
}


let loaded = 0,
    toLoad = 3 // total images
function doneLoad() {
    loaded += 1
    if (loaded == toLoad) {
        fadeAway(document.getElementById("load-scr"))
    }
}
function appear(elem) {
    elem.style.display = null
}
function fadeAway(elem) {
    elem.classList.add("hidden")
    setTimeout(() => {
        elem.style.display = "none"
    }, 600)
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("/serviceWorker.js")
            .then(res => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered", err))
    })
}