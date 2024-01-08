class Tower {
    constructor({ position = { x: 0, y: 0} }) {
        this.position = position
        // center field for centering the projectile
        this.center = {
            x: this.position.x + 32,
            y: this.position.y + 32
        }
        this.projectiles = []
        this.firingRadius = 250
        this.target
        this.frames = 0
    }

    drawTower() {
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, 64, 64)

        c.beginPath()
        c.arc(this.center.x, this.center.y, this.firingRadius, 0, Math.PI * 2)
        c.fillStyle = 'rgba(0, 0, 255, 0.1)'
        c.fill()
    }

    updateTower() {
        this.drawTower()
        if (this.frames % 100 === 0 && this.target) {
            this.projectiles.push(
                new Projectile ({
                    position: {
                        x: this.center.x,
                        y: this.center.y
                    },
                    enemy: this.target
                })
            )
        }
        this.frames++
    }
}