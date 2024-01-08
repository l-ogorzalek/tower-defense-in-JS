const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1280
canvas.height = 768


c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)

const towerPlacementData2D = []

for (let i = 0; i < placementTilesData.length; i+= 40) {
    towerPlacementData2D.push(placementTilesData.slice(i, i + 40))
}

const placementTiles = []

towerPlacementData2D.forEach((row, yIndex) => {
    row.forEach((symbol, xIndex) => {
        if (symbol === 338) {
            // add building placement tile here
            placementTiles.push(
                new PlacementTile({
                    position: {
                        x: xIndex * 32,
                        y: yIndex * 32
                    }
                })
            )
        }
    })    
})

// console.log(placementTiles)

const image = new Image()

image.onload = () => {
    animate()
}
image.src = 'img/gameMap.png'

const enemies = []


function spawnWave(spawnCount) {
    for (let i = 1; i < spawnCount + 1; i++) {
        const xSpawnOffset = i * 150
        enemies.push(
            new Enemy({
                position: {x: waypoints[0].x - xSpawnOffset, y: waypoints[0].y}
            })
        )
    }   
}

const towers = []
let enemyCount = 3
let activeTile = undefined
let lives = 10

spawnWave(enemyCount)

function animate() {
    const animationID = requestAnimationFrame(animate)

    c.drawImage(image, 0, 0)

    /*enemies.forEach(enemy => {
        enemy.updateEnemy()
    })*/ // TO-BE-REMOVED: old loop

    // switching to for loop to avoid rendering issues

    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i]
        enemy.updateEnemy()

        if (enemy.position.x > canvas.width) {
            lives -= 1
            enemies.splice(i, 1)

            if (lives === 0) {
                console.log('game over')
                cancelAnimationFrame(animationID)
                document.querySelector('#gameOver').style.display = 'flex'
            }
        }
    }

    // tracking total number of enemies
    if (enemies.length === 0) {
        enemyCount+= 2
        spawnWave(enemyCount)
    }

    placementTiles.forEach((tile) => {
        tile.checkHover(mouse)
    })

    towers.forEach((tower) => {
        tower.updateTower()

        if (enemies.length > 0) {
            const enemyInRange = enemies.filter(enemy => {
                const xDifference = enemy.center.x - tower.center.x
                const yDifference = enemy.center.y - tower.center.y
                const distance = Math.hypot(xDifference, yDifference)
                return distance < tower.firingRadius 
            })
    
            if (enemyInRange.length > 0) {
                tower.target = enemyInRange[0]
            } else {
                tower.target = null 
            }
        } else {
            tower.target = null
        }

        /*tower.target = null
        const enemyInRange = enemies.filter(enemy => {
            const xDifference = enemy.center.x - tower.center.x
            const yDifference = enemy.center.y - tower.center.y
            const distance = Math.hypot(xDifference, yDifference)
            return distance < tower.firingRadius
        })
        tower.target = enemyInRange[0]*/ // TO-BE-REMOVED: old loop

        // switching to for loop to avoid rendering issues with multiple 
        // projectiles in the future

        for (let i = tower.projectiles.length - 1; i >= 0; i--) {
            const projectile = tower.projectiles[i]

            projectile.updateProjectile()

            const xDifference = projectile.enemy.center.x - projectile.position.x
            const yDifference = projectile.enemy.center.y - projectile.position.y
            const distance = Math.hypot(xDifference, yDifference)

            // if projectile hits an enemy
            if (distance < projectile.enemy.radius + projectile.radius) {
                // health decrement and enemy removal
                projectile.enemy.health -= 20
                if (projectile.enemy.health <= 0) {
                    const enemyIndex = enemies.findIndex((enemy) => {
                        return projectile.enemy === enemy
                    })
                    // failsafe for projectiles in flight
                    if (enemyIndex > -1) {
                        enemies.splice(enemyIndex, 1)
                    }
                }
                
                tower.projectiles.splice(i, 1)
            }
        }        
    })
}

const mouse = {
    x: undefined,
    y: undefined
}

canvas.addEventListener('click', (event) => {
    if (activeTile && !activeTile.isConstructed) {
        towers.push(
            new Tower({
                position: {
                    x: activeTile.position.x,
                    y: activeTile.position.y
                }
            })
        )
        activeTile.isConstructed = true
    }
})

window.addEventListener('mousemove', (event)  => {
    mouse.x = event.clientX
    mouse.y = event.clientY

    activeTile = null
    for (let i = 0; i < placementTiles.length; i++) {
        const tile = placementTiles[i]
        if (mouse.x > tile.position.x && 
            mouse.x < tile.position.x + tile.size &&
            mouse.y > tile.position.y && 
            mouse.y < tile.position.y + tile.size
        ) {
            activeTile = tile
            break
        }
    }
})