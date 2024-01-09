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

        //this.isMouseOver = false
    }

    drawTower() {
        super.drawSprite(this.drawOffset)

        // showing firing radius
        /*if (this.isMouseOver) {
            c.beginPath()
            c.arc(this.center.x, this.center.y, this.firingRadius, 0, Math.PI * 2)
            c.fillStyle = 'rgba(0, 0, 255, 0.1)'
            c.fill()*/ // TO-BE-REMOVED: clutters the screen
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

        /*this.drawTower()
        if (this.projectileFrames % 100 === 0 && this.target) {
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
        this.projectileFrames++
    }*/ // TO-BE-REMOVED: depreciated code
}