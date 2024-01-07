class Tower {
    constructor({ position = { x: 0, y: 0} }) {
        this.position = position
    }

    drawTower() {
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, 64, 64)
    }
}