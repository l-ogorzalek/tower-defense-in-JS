const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1280
canvas.height = 960


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
const enemyTypes = [Enemy, SecondEnemyWorm, ThirdEnemyShroom, FourthEnemyRunner]

// old enemy spawn loop
/*
function spawnWave(spawnCount) {
    for (let i = 1; i < spawnCount + 1; i++) {
        const xSpawnOffset = i * 150
        enemies.push(
            new SecondEnemy({
                position: {x: waypoints[0].x - xSpawnOffset, y: waypoints[0].y}
            })
        )
    }   
}
*/

function spawnWave(waveNumber, spawnCount) {
    for (let i = 1; i <= spawnCount; i++) {
        const xSpawnOffset = i * 150;
        let enemy;

        if (waveNumber <= 2) {
            enemy = new Enemy({
                position: {x: waypoints[0].x - xSpawnOffset, y: waypoints[0].y}
            });
        } else if (waveNumber > 2 && waveNumber <= 5) {
            enemy = new SecondEnemyWorm({
                position: {x: waypoints[0].x - xSpawnOffset, y: waypoints[0].y}
            });
        } else if (waveNumber > 5 && waveNumber <= 7) {
            enemy = new ThirdEnemyShroom({
                position: {x: waypoints[0].x - xSpawnOffset, y: waypoints[0].y}
            });
        } else if (waveNumber > 7 && waveNumber < 14) {
            const randomIndex = Math.floor(Math.random() * enemyTypes.length);
            const EnemyType = enemyTypes[randomIndex];
            enemy = new EnemyType({
                position: {x: waypoints[0].x - xSpawnOffset, y: waypoints[0].y}
            });
        } else {
            // last wave
            spawnCount = 1;
            enemy = new EnemyBoss({
                position: {x: waypoints[0].x - xSpawnOffset, y: waypoints[0].y}
            });
        }

        enemies.push(enemy);
    }
}


const towers = []
let enemyCount = 3
let activeTile = undefined
let lives = 10
let money = 150
let wave = 1
let hasBossSurvived = false
const explosions = []

spawnWave(wave, enemyCount)

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
            if (wave < 15) {
                lives -= 1
                enemies.splice(i, 1)
                document.querySelector('#lives').innerHTML = lives
            } else {
                hasBossSurvived = true
                enemies.splice(i, 1)
            }

            if (lives === 0 || hasBossSurvived === true) {
                document.querySelector('#lives').innerHTML = 0
                console.log('game over')
                cancelAnimationFrame(animationID)
                document.querySelector('#gameOver').style.display = 'flex'
                return
            }
        }
    }

    for (let i = explosions.length - 1; i >= 0; i--) {
        const explosion = explosions[i]
        explosion.drawSprite()
        explosion.updateSprite()
        if (explosion.framesAmount.current >= explosion.framesAmount.max - 1) {
            explosions.splice(i, 1)
        }
    }

    // checking if game is won
     if (wave === 15 && enemies.length === 0) {
        console.log('YOU WIN')
        cancelAnimationFrame(animationID)
        document.querySelector('#youWin').style.display = 'flex'
    }

    // tracking total number of enemies + wave count
    if (enemies.length === 0) {
        if (wave >= 0 && wave <= 2) {
            enemyCount++
        } else {
            enemyCount = wave + 1
        }
        spawnWave(wave, enemyCount)
        console.log(enemyCount)
        wave += 1
        document.querySelector('#wave').innerHTML = wave
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
                        money += 25
                        document.querySelector('#money').innerHTML = money
                    }
                }
                
                explosions.push(
                    new Sprite({
                        position: {x: projectile.position.x - 33, y: projectile.position.y - 33},
                        imageSrc: 'img/explosion.png',
                        frames: {max: 4}
                    })
                )

                tower.projectiles.splice(i, 1)
            }
        }        
    })
}

const mouse = {
    x: undefined,
    y: undefined
}

canvas.addEventListener('dblclick', (event) => {
    if (activeTile && !activeTile.isConstructed && money - 50 >= 0) {
        money -= 50
        document.querySelector('#money').innerHTML = money
        towers.push(
            new Tower({
                position: {
                    x: activeTile.position.x,
                    y: activeTile.position.y
                }
            })
        )
        activeTile.isConstructed = true

        // sorting towers by y position to avoid rendering issues
        towers.sort((tower1, tower2) => {
            return tower1.position.y - tower2.position.y
        })
    }
})

// event listener for tower radius display
/*canvas.addEventListener('mousemove', (event) => {
    const mousePosition = {
        x: event.clientX - canvas.getBoundingClientRect().left,
        y: event.clientY - canvas.getBoundingClientRect().top
    }

    towers.forEach(tower => {
        const distance = Math.hypot(tower.center.x - mousePosition.x, 
            tower.center.y - mousePosition.y)
        tower.isMouseOver = distance < tower.width / 2
    })
})*/ // TO-BE-REMOVED: not usable in current form

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