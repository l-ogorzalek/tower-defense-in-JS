class Sprite {
    constructor({position = {x: 0, y: 0}, imageSrc, frames = {max: 1}}) {
        this.position = position
        this.image = new Image()
        this.image.src = imageSrc
        this.framesAmount = {
            max: frames.max,
            current: 0,
            elapsed: 0,
            hold: 10
        }
    }

    drawSprite(offset = {x: 0, y: 0}) {
        const cropWidth = this.image.width / this.framesAmount.max
        const crop = {
            position: {
                x: cropWidth * this.framesAmount.current,
                y: 0,
            },
            width: cropWidth,
            height: this.image.height
        }
        c.drawImage(
            this.image, 
            crop.position.x, 
            crop.position.y, 
            crop.width, 
            crop.height, 
            this.position.x + offset.x, 
            this.position.y + offset.y, 
            crop.width, 
            crop.height
        )
    }

    updateSprite() {
        // animation
        this.framesAmount.elapsed++
        if (this.framesAmount.elapsed % this.framesAmount.hold === 0) {
        this.framesAmount.current++
            if (this.framesAmount.current >= this.framesAmount.max - 1) {
                this.framesAmount.current = 0
            }
        }
    }
}