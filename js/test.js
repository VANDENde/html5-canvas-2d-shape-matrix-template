function mainStart() {
    globals();
    loadResources();
    loadLevel();
    initMyCanvas();
    initBackground();
    initThings();
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                             window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame ? requestAnimationFrame(gameLoop) : setTimeout(gameLoop, 16);
}

function globals() {
    gfxok = 0;
    level = 0;
    map = "";
    activscreen = 0; // 0 = gameScreen
    nativeGfxSize = 64;
    xorigin = 0, yorigin = 0;
    //common....
    mousex = 0;
    mousey = 0;
    xpos = 0;
    ypos = 0;
    Info = "";
    //game timing...
    timestart = null;
    frame = 0;
    fps = 100;
    speed1 = 0;
}

function loadLevel() {
    if (level === 0) {
        xmatrix = 21; //Math.floor(window.innerWidth / nativeGfxSize);
        ymatrix = 12; //.floor(window.innerHeight / nativeGfxSize);
        map = "0...................0" +
              "0...................0" +
              "0...................0" +
              "0...................0" +
              "0...................0" +
              "0...................0" +
              "0...................0" +
              "0...................0" +
              "0...................0" +
              "0...................0" +
              "0...................0" +
              "0...................0";
    }
}
        

function loadResources() {
    //gfx background 
    bg = new Image();
    bg.onload = function () {
        gfxok++;
    }
    bg.src = "./img/bg.png";

    //gfx file 64x64 pixel png...
    brick = new Image();
    brick.onload = function () {
        gfxok++;
    }
    brick.src = "./img/monster1.png";
    //
}

function initThings() {
    //object    =     TYPE      IMAGE   TITLE     x  y
    actor = new thing("actor" , brick, "Louis"  , 2, 2  );
    enemy1 = new thing("enemy", brick, "Feind1",  3 ,3  );
    things = [actor, enemy1];
}

/*
function recalcThings() {
    for (var i = 0; i < things.length; i++) {
        var x1 = things[i].x;
        var y1 = things[i].y;
        var x2 = x1 * blocksize;
        var y2 = y1 * blocksize;
        things[i].x = x2;
        things[i].y = y2;
    }
}
*/

function thing(type, gfx, name, x, y) {
    this.type = type;
    this.image = gfx;
    this.name = name;
    this.x = x; // actual position in matrix
    this.y = y;
    this.oldx = x; // last position in matrix
    this.oldy = y;
    this.goalx = 0; // destination in matrix 
    this.goaly = 0;
    this.direction = "none"; // actual moving direction : left, right, up, down
}


function initMyCanvas() {
    canvas = document.getElementsByTagName('canvas')[0];
    canvasrect = canvas.getBoundingClientRect();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //canvas.addEventListener('mousemove', function (evt) {
    //    mousex = evt.clientX - canvasrect.left,
    //    mousey = evt.clientY - canvasrect.top
    //    Info = 'MOVING Mouse position: ' + mousex + ',' + mousey;
    //}, false);
    canvas.addEventListener('click', function (evt) {
        mousex = evt.clientX - canvasrect.left,
        mousey = evt.clientY - canvasrect.top
        Info = 'CLICKING Mouse position: ' + mousex + ',' + mousey;
    }, false);
    ctx = canvas.getContext("2d");
    ctx.font = "20px Arial";
   //
    blocksize = Math.floor(window.innerWidth / xmatrix);
    yorigin = Math.floor(window.innerHeight / 2) - (ymatrix / 2 * blocksize);
    xorigin = 0;
    var tmp = Math.floor(window.innerHeight / blocksize);
    if (tmp < ymatrix) {
        blocksize = Math.floor(window.innerHeight / ymatrix);
        yorigin = 0;
        xorigin = Math.floor(window.innerWidth / 2) - (xmatrix / 2 * blocksize);
    }
}

function initBackground() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    var top = yorigin;
    var pointer = 0;
    for (var ypoi = 0; ypoi < ymatrix; ypoi++) {
        var left = xorigin;
        for (var xpoi = 0; xpoi < xmatrix; xpoi++) {
            sign = map[pointer];
            if (sign == "0") ctx.drawImage(brick, left, top, blocksize, blocksize);
            pointer++;
            left += blocksize;
        }
        top += blocksize;
    }
}

function resizeBrowser() {
    initMyCanvas();
    initBackground();
    Info = "resized Blocksize=" + blocksize;
}

function gameLoop(timestamp) {
    if (timestart === null) timestart = timestamp;
    var timeprogress = timestamp - timestart;
    frame++;
    if (timeprogress > 1000) {
        fps = frame;
        Info = fps + " FPS";
        frame = 0;
        timestart = timestamp;
        //recalc moving speed
        speed1 = 1 / fps; // 1 block in 1 second
    }
    if (gfxok === 2) {
        resizeBrowser();
        gfxok = 0;
    }
    if (activscreen === 0) gameScreen();
    ctx.fillText(Info, 10, canvas.height - 10);
    requestAnimationFrame(gameLoop);
}

function gameScreen() {
    //moveObjects();
    drawGameScene();
}

/*
function moveObjects() {
    for (var i = 0; i < things.length; i++) {
        things[i].oldx = things[i].x;
        things[i].x += speed1; // speed1 = move a blocksize in 1 second
        if (things[i].x > 21) things[i].x = -1;
    }
}
*/

function drawGameScene() {
    ctx.fillStyle = "#000000";
    for (var i = 0 ; i < things.length; i++) {
        var xold = things[i].oldx * blocksize + xorigin;
        var yold = things[i].oldy * blocksize + yorigin;
        var xpos = things[i].x * blocksize + xorigin;
        var ypos = things[i].y * blocksize + yorigin;
        //ctx.drawImage(bg, xold, yold, blocksize, blocksize, xold, yold, blocksize, blocksize);
        ctx.drawImage(things[i].image, xpos,ypos, blocksize, blocksize);
    }
}

