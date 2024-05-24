class InputManager { 
    constructor() {
        this.keys = {}; // Store the state of each key (pressed or not)
        this.setupKeyboardListeners();
    }

    setupKeyboardListeners() {
        // Add event listeners for keydown and keyup events
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        document.addEventListener("keyup", this.handleKeyUp.bind(this));
    }

    handleKeyDown(event) {
        // Update the key state when a key is pressed
        this.keys[event.key] = true;
    }

    handleKeyUp(event) {
        // Update the key state when a key is released
        this.keys[event.key] = false;
    }

    isKeyPressed(key) {
        // Check if a specific key is currently pressed
        return this.keys[key] || false;
    }
}




class Sprite {
    constructor(xPos, yPos, xSize, ySize, physicsEnabled, color, mass, animAvailable, imgID) {
        this.x = xPos; // X-coordinate of the sprite
        this.y = yPos; // Y-coordinate of the sprite
        this.width = xSize; // Width of the sprite
        this.height = ySize; // Height of the sprite
        this.physicsEnabled = physicsEnabled; // Whether physics apply (e.g., gravity)
        this.color = color; // Color of the sprite
        this.mass = mass; // Mass of the sprite
        this.imgID = imgID; // Image ID of the sprite
        this.flipHorizontally = false; // Flag for horizontal flipping
        this.flipVertically = false; // Flag for vertical flipping
        this.Gravity = 1;
        this.CanvasHeight = 600;
        this.xv = 0;
        this.yv = 0;
        this.scrollx = 0;
        this.scrolly = 0;
        this.falseX = 400;
        this.jumping = false;
        this.inputManager = new InputManager();
    }


    movementDefault(){

        if (this.inputManager.isKeyPressed("i")) {
            this.y -= 10
        }
        if (this.inputManager.isKeyPressed("j")) {
            this.x -= 3;
        }
        if (this.inputManager.isKeyPressed("l")) {
            this.x += 3;
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    

    SideScroller(userground){
        this.setupSideScroll();

        this.xv = 0;
        this.yv = 0;
        let maxSpeed = 0.75; // Set your desired maximum speed
    
        if (this.inputManager.isKeyPressed("a")) {
            this.xv += -0.75;
        } else if (this.inputManager.isKeyPressed("d")) {
            this.xv += 0.75;
        } else {
            this.xv = 0;
        }
    
        // Limit the speed
        if (this.xv > maxSpeed) {
            this.xv = maxSpeed;
        } else if (this.xv < -maxSpeed) {
            this.xv = -maxSpeed;
        }
    
        if (this.inputManager.isKeyPressed("w") && !this.jumping) {
            this.yv -= 50;
            this.update();
            this.sleep(5000);
            this.jumping = true

        } else {
            this.yv = 0;
        }
    
        this.x = this.xv;
    
        this.getsidescrollpos();
        let cameraDelay = 1; // Adjust this value to your liking
        this.scrollx = this.scrollx + cameraDelay * (this.x - this.scrollx);
    
        this.OBJtomove(userground);
    }
    

    FreeCamEXPERIMENTAL(userground){
        this.setupSideScroll();
    
        this.xv = 0;
        this.yv = 0;
        let maxSpeed = 0.75; // Set your desired maximum speed
    
        if (this.inputManager.isKeyPressed("a")) {
            this.xv -= 20;
        } else if (this.inputManager.isKeyPressed("d")) {
            this.xv += 20;
        } else {
            this.xv = 0;
        }
    
        // Limit the speed
        if (this.xv > maxSpeed) {
            this.xv = maxSpeed;
        } else if (this.xv < -maxSpeed) {
            this.xv = -maxSpeed;
        }
    
        if (this.inputManager.isKeyPressed("w") && !this.jumping) {
            this.yv -= 10;
            this.update();
        } else if (this.inputManager.isKeyPressed("s")) {
            this.yv += 10;
        } else {
            this.yv = 0;
        }
    
        this.x = this.xv;
        this.y = this.yv;
    
        this.getsidescrollpos();
        let cameraDelay = 1; // Adjust this value to your liking
        this.scrollx = this.scrollx + cameraDelay * (this.x - this.scrollx);
        this.scrolly = this.scrolly + cameraDelay * (this.y - this.scrolly);

        this.OBJtomove(userground);
    }
    

    setupSideScroll(){
        this.scrollx = 0;
        this.scrolly = 0;
        this.x = 0;
        this.y += this.yv;
        this.yv = 0;
        this.xv = 0;
    }

    getsidescrollpos(){
        this.x = this.x - this.scrollx
        this.y = this.y - this.scrolly
    }

    OBJtomove(userground, parallaxEnabled, distance){
        if (parallaxEnabled){
            userground.x = userground.x - (this.scrollx * distance);
            userground.y = userground.y - (this.scrolly);
        } else{
            userground.x = userground.x - this.scrollx
            userground.y = userground.y - this.scrolly
        }
    }

    draw(ctx) {
        // Save the current state of the canvas
        ctx.save();
    
        // Translate the canvas only in the X direction
        ctx.translate(this.CanvasWidth / 2 - this.x, 0);
    
        if (this.imgID) {
            const img = new Image();
            img.src = this.imgID;
    
            // Adjust rendering based on flip flags
            if (this.flipHorizontally) {
                ctx.save();
                ctx.scale(-1, 1); // Flip horizontally
                ctx.drawImage(img, -this.x - this.width, this.y, this.width, this.height);
                ctx.restore();
            } else if (this.flipVertically) {
                ctx.save();
                ctx.scale(1, -1); // Flip vertically
                ctx.drawImage(img, this.x, -this.y - this.height, this.width, this.height);
                ctx.restore();
            } else {
                ctx.drawImage(img, this.x, this.y, this.width, this.height);
            }
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    // Restore the canvas to its original state
    ctx.restore();
}


    update() {
        if (this.physicsEnabled) {
            if (this.jumping) {
                this.yv += this.Gravity; // Gravity pulls down
                this.y += this.yv; // Velocity changes position

                // If we've hit the ground, stop jumping
                if (this.y >= this.CanvasHeight - this.height) {
                    this.y = this.CanvasHeight - this.height;
                    this.yv = 0;
                    this.jumping = false;
                }
            } else{
                this.y += this.Gravity; // Velocity changes position
            }
        }
    }
    

    checkTouching(otherSprite) {
        return (
            this.x < otherSprite.x + otherSprite.width &&
            this.x + this.width > otherSprite.x &&
            this.y < otherSprite.y + otherSprite.height &&
            this.y + this.height > otherSprite.y
        );
    }

    collisionHandling(collisionSprite) {
        if (this.checkTouching(collisionSprite)) {
            this.jumping = false;
            // Calculate total mass for pushing behavior
            const totalMass = this.mass + collisionSprite.mass;
    
            // Calculate relative mass ratio
            const massRatio = this.mass / collisionSprite.mass;
    
            // Adjust positions based on mass ratio
            const overlapX = Math.min(
                Math.abs(this.x - collisionSprite.x - collisionSprite.width),
                Math.abs(this.x + this.width - collisionSprite.x)
            );
    
            const overlapY = Math.min(
                Math.abs(this.y - collisionSprite.y - collisionSprite.height),
                Math.abs(this.y + this.height - collisionSprite.y)
            );
    
            if (overlapX < overlapY) {
                if (this.x < collisionSprite.x) {
                    this.x = collisionSprite.x - this.width;
                    collisionSprite.x += overlapX * massRatio;
                } else {
                    this.x = collisionSprite.x + collisionSprite.width;
                    collisionSprite.x -= overlapX * massRatio;
                }
            } else {
                if (this.y < collisionSprite.y) {
                    this.y = collisionSprite.y - this.height;
                    collisionSprite.y += overlapY * massRatio;
                } else {
                    this.y = collisionSprite.y + collisionSprite.height;
                    collisionSprite.y -= overlapY * massRatio;
                }
            }
        }
    }

}



class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = new Map(); // Store loaded audio buffers
    }

    async loadSound(url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.sounds.set(url, audioBuffer);
            return audioBuffer;
        } catch (error) {
            console.error(`Error loading sound from ${url}: ${error.message}`);
            return null;
        }
    }

    playSound(url, volume = 1.0) {
        const buffer = this.sounds.get(url);
        if (buffer) {
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = volume;
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            source.start();
        } else {
            console.warn(`Sound not loaded: ${url}`);
        }
    }
}


class ParticleManager {
    constructor() {
        this.particles = [];
    }

    createParticle(x, y, velocityX, velocityY, lifetime) {
        const particle = {
            x,
            y,
            velocityX,
            velocityY,
            lifetime,
        };
        this.particles.push(particle);
    }

    createRandomParticle(x, y, lifetime) {
        const velocityX = Math.random() * 2 - 1; // Random X velocity between -1 and 1
        const velocityY = Math.random() * 2 - 1; // Random Y velocity between -1 and 1
        this.createParticle(x, y, velocityX, velocityY, lifetime);
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.lifetime--;
            if (particle.lifetime <= 0) {
                this.particles.splice(i, 1); // Remove expired particles
            }
        }
    }

    renderParticles(context, color) {
        context.fillStyle = color; // Particle color
        for (const particle of this.particles) {
            context.fillRect(particle.x, particle.y, 5, 5); // Draw a small square for each particle
        }
    }
}


class Animation {
    constructor(imageArray) {
        this.frames = imageArray; // Array of image URLs or Image objects
        this.currentFrame = 0; // Index of the current frame
        this.frameInterval = 100; // Time (in milliseconds) between frames
        this.isPlaying = false; // Whether the animation is currently playing
        this.playElgibility = false;
    }

    playOnSprite(targetSprite) {
        this.playElgibility = true;
        if(this.playElgibility == true){
            if (!this.isPlaying) {
                this.isPlaying = true;
                const animate = () => {
                    if(this.playElgibility == true){
                    targetSprite.imgID = this.frames[this.currentFrame];
                    this.currentFrame = (this.currentFrame + 1) % this.frames.length;
                    setTimeout(animate, this.frameInterval);
                    }
                };
                animate();
            }
        }
    }

    stop() {
        this.isPlaying = false;
        this.playElgibility = false;
        this.currentFrame = 0;
    }

    setFrame(frameIndex) {
        if (frameIndex >= 0 && frameIndex < this.frames.length) {
            this.currentFrame = frameIndex;
        } else {
            console.error('Invalid frame index.');
        }
    }
}


class UIManager {
    constructor(canvas, ctx, x, y, width, height, color, text, font = '40pt Arial', fontColor, borderWidth, borderColor, onclick, notclicked){
        this.canvas = canvas;
        this.ctx = ctx;
        this.onclick = onclick
        this.notclicked = notclicked;
        this.text = text

        this.rect = {
            x: x,
            y: y,
            fontColor: fontColor,
            width: width,
            height: height,
            color: color, 
            font: font,
            borderWidth: borderWidth,
            borderColor: borderColor,
        }

        this.canvas.addEventListener('click', (evt) => {
            this.MousePos = this.getMousePos(evt)

            if (this.isInside(this.MousePos, this.rect)) {
                this.onclick();
            } else {
                
            }
        }, false);
    }

    getMousePos(event) {
        var rect = this.canvas.getBoundingClientRect();
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
    }

    isInside(pos, rect) {
        return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y
    }

    drawUI() {
        this.ctx.beginPath();
        this.ctx.rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        this.ctx.fillStyle = this.rect.color;
        this.ctx.fill();
        this.ctx.lineWidth = this.rect.borderWidth;
        this.ctx.strokeStyle = this.rect.borderColor;
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.font = this.rect.font;
        this.ctx.fillStyle = this.rect.fontColor;
    
        // Measure the width of the text
        var textWidth = this.ctx.measureText(this.text).width;
    
        // Calculate the position to center the text
        var textX = this.rect.x + (this.rect.width - textWidth) / 2;
        var textY = this.rect.y + (this.rect.height + parseInt(this.rect.font)) / 2;
    
        this.ctx.fillText(this.text, textX, textY);
    }
    
}







export{Sprite, InputManager, AudioManager, ParticleManager, Animation, UIManager}
