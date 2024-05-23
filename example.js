import { Sprite, InputManager, AudioManager, ParticleManager, Animation, UIManager } from "https://hypackeldev.github.io/HYPACKEL-ENGINE-1/engine.js";
//why is this not working yet this is kinda annoying but ok so now pls work.
// Initialize canvas and context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Create instances of managers
const inputManager = new InputManager();
const audioManager = new AudioManager();
const particleManager = new ParticleManager();


// Define image URLs for animation
const imageUrls = [
    'spriteFrame3.svg',
    'spriteFrame1.svg',
    'spriteFrame2.svg'
]; 

// Create a new UIManager object (this will automatically draw the button with text


// Create sprite and animation instances
const mySprite = new Sprite(100, 100, 50, 50, true, "#FF0000", 2.5, true, "spriteFrame3.svg");
const MeanSprite = new Sprite(100, 100, 50, 50, true, "#050dff", 1, false);
const animation = new Animation(imageUrls);

function onclick(){
    mySprite.width = 100;
}

function onclick1(){
    mySprite.width = 50;
}

function onclick2(){
    mySprite.width = 10;
}

const button = new UIManager(canvas, ctx, 0, 0, 100, 40, 'rgb(50, 168, 82)', "big boy", '20pt Arial', '#ffffff', '0.05', '#4287f5', onclick);
const button1 = new UIManager(canvas, ctx, 0, 40, 100, 40, '#faf602', "normal boy", '15pt Arial', '#ffffff', '0.05', '#4287f5', onclick1);
const button2 = new UIManager(canvas, ctx, 0, 80, 100, 40, '#fa022c', "small boy", '15pt Arial', '#ffffff', '0.05', '#4287f5', onclick2);

const TEXT = new UIManager(canvas, ctx, 250, 0, 300, 100, '', "ENGINE TEST", '40pt Arial', '#000000', '0.0005', '');

const parall2 = new Sprite(-500, 442.5, canvas.width + 500, 300, false, "#050dff", 100000000000000, false, "costume3.png");
const parall = new Sprite(-500, 470, canvas.width + 500, 300, false, "#050dff", 100000000000000, false, "costume2.png");
const THEGround = new Sprite(-500, 500, canvas.width + 500, 300, false, "#050dff", 100000000000000000000, false, "costume1.png");

// Play animation on the sprite
mySprite.flipHorizontally = false;

// Load audio file
audioManager.loadSound('SIGMA.mp3');

async function scroll(){
    mySprite.SideScroller(THEGround);
    mySprite.OBJtomove(MeanSprite);
    mySprite.OBJtomove(parall, true, 0.5);
    mySprite.OBJtomove(parall2, true, 0.25);
}

// Game loop (update and render)
function gameLoop() {
    parall2.update();
    parall.update();
    THEGround.update();
    MeanSprite.update();
    mySprite.update();

    MeanSprite.movementDefault();

    particleManager.updateParticles();  

    if (inputManager.isKeyPressed("a")) {
        animation.playOnSprite(mySprite);
        mySprite.flipHorizontally = true;
    }
    if (inputManager.isKeyPressed("d")) {
        animation.playOnSprite(mySprite);
        mySprite.flipHorizontally = false;
    }
    
    if (!inputManager.isKeyPressed("w") && !inputManager.isKeyPressed("a") &&
        !inputManager.isKeyPressed("s") && !inputManager.isKeyPressed("d")) {
        animation.stop();
    }

    scroll();
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save(); // Save the current state
    ctx.translate(canvas.width/2, 0); // Translate

    parall2.draw(ctx);
    parall.draw(ctx);
    THEGround.draw(ctx);
    mySprite.draw(ctx);
    MeanSprite.draw(ctx);

    ctx.restore(); // Restore to the state before translation

    mySprite.collisionHandling(MeanSprite);
    mySprite.collisionHandling(THEGround);
    MeanSprite.collisionHandling(THEGround);

    button.drawUI();
    button1.drawUI();
    button2.drawUI();

    TEXT.drawUI();

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
