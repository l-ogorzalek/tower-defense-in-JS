class Projectile {
    constructor({position = {x: 0, y: 0}, enemy}) {
        this.position = position
        this.velocity = {
            x: 0,
            y: 0
        }
        this.enemy = enemy
        this.radius = 5
    }

    drawProjectile() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2) // full circle
        c.fillStyle = 'orange'
        c.fill()
    }

    updateProjectile() {
        this.drawProjectile()

        const angle = Math.atan2(
            this.enemy.center.y - this.position.y, 
            this.enemy.center.x - this.position.x
        )

        const velocityIncrease = 3
        this.velocity.x = Math.cos(angle) * velocityIncrease
        this.velocity.y = Math.sin(angle) * velocityIncrease

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y    
    }
}