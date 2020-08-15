/*
* Yo! Code is free for use :D
* Author: https://twitter.com/Lreeeon
*/


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
    setAnim(imgArr, framePer=5) {
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
        this.newPos()
        this.x += this.velX
        this.y += this.velY
        this.hitBorder()
    }
    draw(ctx) {
        ctx.fillStyle = this.status
        ctx.fillRect(this.x, this.y, this.width, this.height)
        // super.draw(ctx)
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

class Rock extends Sprite {
    constructor(x, y, text, rockPicArr) {
        super(x, y, 250, 150)
        this.text = text
        this.setAnim(rockPicArr ||
            [document.getElementById("rock"), document.getElementById("rock2")]
        )
    }
    draw(ctx) {
        super.draw(ctx)
        ctx.font = "32px Arial"
        ctx.fillStyle = "blue"
        ctx.fillText(this.text, this.x + 60, this.y + 70)
    }
}

class PatternFill extends Sprite {
    constructor(width, height, spriteArr) {
        super(0, 0, width, height)
        this.setAnim(spriteArr, 10)
    }
    draw(ctx) {
        let pat = ctx.createPattern(this.getCurFrame(), 'repeat')
        ctx.fillStyle = pat
        ctx.fillRect(0, 0, this.width, this.height)
    }
    isCollidedW() {
        return false
    }
}

class Feesh extends Character {
    spriteArr = {
        onWater: [],
        sink: [],
        toLand: [],
        onLand: [],
        toWater: [],
        float: [],
    }
    constructor() {
        super(20, 120, 30, 30)
        this.hasTransition = true
        this.prevAnim = "onWater"
        this.curAnim = "onWater"
        this.isCollided = false
    }
    onAnimCycleDone() {
        console.log(this.curAnim);
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
            // this.setAnim(Feesh.spriteArr[this.curAnim], 10)
        }
    }
}


let fsh = new Feesh()
let myMovingCanvas = {
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
                document.getElementById("gif_test"),
                document.getElementById("gif_test2")
            ]),
            new Rock(100, 140, "Re calibrate"),
            new Rock(200, 240, "Re position")
        ])

        fsh.setAnim([
            document.getElementById("gif_test"),
            document.getElementById("gif_test2")
        ], 1)
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    update: function () {
        let ctx = this.context,
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
        fsh.isCollided = isCollided
        fsh.update()
        fsh.draw(ctx)
    }
}


function onKeyPr(e) {
    // console.log(e.key)
    if (["ArrowDown", "s", "S"].includes(e.key)) {
        fsh.accelY = 4
    } else if (["ArrowUp", "w", "W"].includes(e.key)) {
        fsh.accelY = -4
    } else if (["ArrowRight", "d", "D"].includes(e.key)) {
        fsh.accelX = 4
    } else if (["ArrowLeft", "a", "A"].includes(e.key)) {
        fsh.accelX = -4
    } else {
        fsh.accelX = 0
        fsh.accelY = 0
    }
}
function onRientation(e) {
    // console.log(e.gamma)
    fsh.accelX = e.gamma
    fsh.accelY = e.beta
}

function main() {
    window.addEventListener('deviceorientation', onRientation) // lmao
    window.addEventListener("keydown", onKeyPr)
    myMovingCanvas.start()
}


let loaded = 0,
    toLoad = 3 // total images
function doneLoad() {
    loaded += 1
    if (loaded == toLoad) {
        fadeAway(document.getElementsByClassName("load-scr")[0])
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