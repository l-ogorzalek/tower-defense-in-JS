class Enemy {
    constructor({position = { x: 0, y: 0}}) {
        this.position = position
        this.width = 32
        this.height = 32
        this.waypointIndex = 0;
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }
    }

    drawEnemy() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    updateEnemy() { 
        this.drawEnemy()

        const waypoint = waypoints[this.waypointIndex]
        const yDistance = waypoint.y - this.center.y
        const xDistance = waypoint.x - this.center.x
        const angle = Math.atan2(yDistance, xDistance)

        this.position.x += Math.cos(angle)
        this.position.y += Math.sin(angle)
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }

        if (
            Math.round(this.center.x) === Math.round(waypoint.x) && 
            Math.round(this.center.y) === Math.round(waypoint.y) &&
            this.waypointIndex < waypoints.length - 1
            ) {
            this.waypointIndex++
        }
    }
}