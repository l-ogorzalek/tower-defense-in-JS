class PlacementTile {
    constructor({position = {x: 0, y: 0}}) {
        this.position = position
        this.size = 64
        this.color = 'rgba(255, 255, 255, 0.2)'
        this.constructed = false
    }

    drawPlacementTile() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.size, this.size)
    }

    checkHover(mouse) {
        this.drawPlacementTile()

        if (mouse.x > this.position.x && 
            mouse.x < this.position.x + this.size &&
            mouse.y > this.position.y && 
            mouse.y < this.position.y + this.size
            ) {
                this.color = 'rgba(191, 191, 191, 0.45)'
            } else this.color = 'rgba(15, 15, 15, 0.3)'
    }
}