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
for (let i = 1; i < 10; i++) {
    const xSpawnOffset = i * 150
    enemies.push(new Enemy({
        position: {x: waypoints[0].x - xSpawnOffset, y: waypoints[0].y}
    })
    )
}

const towers = []
let activeTile = undefined

function animate() {
    requestAnimationFrame(animate)

    c.drawImage(image, 0, 0)
    enemies.forEach(enemy => {
        enemy.updateEnemy()
    })

    placementTiles.forEach((tile) => {
        tile.checkHover(mouse)
    })

    towers.forEach((tower) => {
        tower.drawTower()
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