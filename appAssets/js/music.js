var size = [1920, 1080];
var ratio = size[0] / size[1];

let app = new PIXI.Application(size[0], size[1], { backgroundColor: 0x10BB99 });
document.body.appendChild(app.view);

// create a new Sprite from an image path
let simpleRotary = PIXI.Sprite.fromImage('testAssets/simpleRotary.svg');
simpleRotary.anchor.set(0.5);
let faderRail = PIXI.Sprite.fromImage('testAssets/Fader/Components/fader_rail.svg');
faderRail.anchor.set(0.5);
let faderLine = PIXI.Sprite.fromImage('testAssets/Fader/Components/Volume_Lines.svg');
faderLine.anchor.set(0.5);
let faderHandle = PIXI.Sprite.fromImage('testAssets/Fader/Fader_Handle.svg');
faderHandle.anchor.set(0.5);

// move the sprite to the center of the screen
simpleRotary.x = app.renderer.width / 2;
simpleRotary.y = app.renderer.height / 2;

let faderContainer = new PIXI.Container();
app.stage.addChild(faderContainer);
faderContainer.addChild(faderRail);
faderContainer.addChild(faderLine);
faderContainer.addChild(faderHandle);
faderContainer.x = app.renderer.width / 2 + 100;
faderContainer.y = app.renderer.height / 2;

// Pointers normalize touch and mouse
// Opt-in to interactivity


// Shows hand cursor
simpleRotary.interactive = true;
simpleRotary.buttonMode = true;
simpleRotary.rotation = 0;
simpleRotary.pivot.x = simpleRotary.width / 2;
simpleRotary.pivot.y = simpleRotary.height / 2;
simpleRotary
    .on('pointerdown', onSDragStart)
    .on('pointerup', onSDragEnd)
    .on('pointerupoutside', onSDragEnd)
    .on('pointermove', onSDragMove)

// Alternatively, use the mouse & touch events:
// sprite.on('click', onClick); // mouse-only
// sprite.on('tap', onClick); // touch-only
let simpleRotaryOffset = -Math.PI / 2;

app.stage.addChild(simpleRotary);
let angleDeg = (p1, p2) => Math.atan2(p2.y - p1.y, p2.x - p1.x);

function onSDragStart(event) {

    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.8;
    this.dragging = true;

}

simpleRotary.rotation = simpleRotaryOffset;
let currentValue = 0;


let update = (currentValue) => {
    simpleRotary.rotation = simpleRotaryOffset + (currentValue * 2 * Math.PI);
    faderHandle.y = currentValue * faderLine.height;
    document.getElementById("syncValue").value = currentValue;
}

function onSDragMove(event) {
    if (this.dragging) {
        let newPosition = this.data.getLocalPosition(this.parent);
        let angleRadians = angleDeg(newPosition, this);
        currentValue = angleRadians / (2 * Math.PI);
        update(currentValue);
    }
}

function onSDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
}

faderHandle.interactive = true;
faderHandle.buttonMode = true;
faderHandle
    .on('pointerdown', onFDragStart)
    .on('pointerup', onFDragEnd)
    .on('pointerupoutside', onFDragEnd)
    .on('pointermove', onFDragMove)



function onFDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.8;
    this.dragging = true;

}

function onFDragMove(event) {
    if (this.dragging) {
        let newPosition = this.data.getLocalPosition(this.parent);
        if ((Math.abs(newPosition.y) - faderLine.height / 2) <= 0) {
            currentValue = newPosition.y / faderLine.height;
            update(currentValue);

        }

    }
}

function onFDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;

}

function onChangeTextFieldValue(input) {
    if (input.value < 0) input.value = 0;
    if (input.value > 0.5) input.value = 0.5;
    update(input.value);
}

function resize() {
    if (window.innerWidth / window.innerHeight >= ratio) {
        var w = window.innerHeight * ratio;
        var h = window.innerHeight;
    } else {
        var w = window.innerWidth;
        var h = window.innerWidth / ratio;
    }
    app.view.style.width = w + 'px';
    app.view.style.height = h + 'px';
}
window.onresize = function(event) {
    resize();
};