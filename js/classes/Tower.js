class Tower extends Sprite {
    constructor({ position = { x: 0, y: 0} }) {
        super({
            position,
            imageSrc: 'img/tower.png',
            frames: { 
                max: 19 }
        })

        // center field for centering the projectile
        this.center = {
            x: this.position.x + 32,
            y: this.position.y + 32
        }
        
        this.projectiles = []
        this.firingRadius = 250
        this.target

        this.drawOffset = {x: -33, y: -76}
    }

    drawTower() {
        super.drawSprite(this.drawOffset)
        }

    updateTower() {
        this.drawTower()
        if (this.target || 
        !this.target && this.framesAmount.current !== 0) {
            super.updateSprite()
        }

        if (this.target &&
        this.framesAmount.current === 6 &&
        this.framesAmount.elapsed % this.framesAmount.hold === 0) {
            this.shootProjectile()
        }
    }

    shootProjectile() {
        this.projectiles.push(
            new Projectile ({
                position: {
                    x: this.center.x -23,
                    y: this.center.y -105
                },
                enemy: this.target
            })
        )
    }
}