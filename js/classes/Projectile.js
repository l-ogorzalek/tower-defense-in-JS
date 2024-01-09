class Projectile extends Sprite {
    constructor({position = {x: 0, y: 0}, enemy}) {
        super({position, imageSrc: 'img/projectile.png'})
        this.velocity = {
            x: 0,
            y: 0
        }
        this.enemy = enemy
        this.radius = 5
    }

    updateProjectile() {
        this.drawSprite()

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