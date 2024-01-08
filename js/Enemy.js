class Enemy {
    constructor({position = { x: 0, y: 0}}) {
        this.position = position
        this.width = 32
        this.height = 32
        this.waypointIndex = 0
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }
        this.radius = 16
        this.health = 100
        this.velocity = {
            x: 0,
            y: 0,
        }
    }

    drawEnemy() {
        c.fillStyle = 'red'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.beginPath()
        c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2)
        c.fill()

        // health bar
        c.fillStyle = 'rgba(255, 0, 0, 0.8)'
        c.fillRect(this.position.x, this.position.y - 10, this.width, 5)

        // health level
        c.fillStyle = 'rgba(0, 255, 0, 0.8)'
        c.fillRect(this.position.x, this.position.y - 10, this.width * this.health / 100, 5)
    }

    updateEnemy() { 
        this.drawEnemy()

        const waypoint = waypoints[this.waypointIndex]
        const yDistance = waypoint.y - this.center.y
        const xDistance = waypoint.x - this.center.x
        const angle = Math.atan2(yDistance, xDistance)

        const speed = 2

        this.velocity.x = Math.cos(angle) * speed
        this.velocity.y = Math.sin(angle) * speed

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }

        if (
            Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) <
                Math.abs(this.velocity.x) && 
                Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) <
                Math.abs(this.velocity.y) &&
            this.waypointIndex < waypoints.length - 1
            ) {
            this.waypointIndex++
        }
    }
}