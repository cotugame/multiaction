'use strict'
const Stage = require('../stages/stage')
const Player = require('../entities/player/player00')
const Normal = require('../entities/player/normal')
const Enemy = require('../entities/enemy/enemy')
const Boss00 = require('../entities/enemy/boss00')

function gameScene(stageNo, playerIds, camera) {
	const scene = new g.Scene({ game: g.game })
	const players = {}
	const enemies = []
	const pattacks = []

	console.log('stage', stageNo)
	console.log(playerIds)
	console.log('camera', camera.x, camera.y)
	camera.x = 0
	camera.y = 0
	camera.modified()

	scene.loaded.add(() => {
		const stage = new Stage(scene, stageNo)

		const chipSize = Stage.chipSize
		const width = 32
		const height = 32
		const x = 1*chipSize+width/2
		const y = (29+1)*chipSize

		playerIds.forEach((id) => {
			console.log('##', id)
			players[id] = new Player(scene, x, y, camera, id, stage)
		})

		enemies.push(new Enemy(scene, 16, 29))
		enemies.push(new Boss00(scene, 48, 29))
	})

	scene.update.add(() => {
		Object.keys(players).forEach((id) => {
			const player = players[id]
			if (player.isDead === false) {
				enemies.forEach((enemy) => {
					const dx = player.rect.x-enemy.x
					const dy = player.rect.y-enemy.y
					const dis = dx**2+dy**2
					if (dis < 52**2) {
						player.vy = -4
						player.jump = true
						player.dead = true
					}
				})
				if (player.isAttack) {
					pattacks.push(new Normal(scene, player.rect.x+player.width/2, player.rect.y+player.height/2, player.dir))
				}
			}
		})

		for (let i =  pattacks.length-1; i >= 0; i--) {
			const atk = pattacks[i]
			if (atk.isDead) {
				atk.destroy()
				pattacks.splice(i, 1)
			} else {
				for (let j =  enemies.length-1; j >= 0; j--) {
					const enemy = enemies[j]
					const dx = atk.x-enemy.x
					const dy = atk.y-enemy.y
					const dis = dx**2+dy**2
					if (dis < 32**2) {
						atk.destroy()
						pattacks.splice(i, 1)
						if (--enemy.life <= 0) {
							enemy.destroy()
							enemies.splice(j, 1)
							if (enemies.length === 0) {
								g.game.replaceScene(gameScene(stageNo+1, Object.keys(players), camera))
							}
						}
					}
				}
			}
		}

	})

	scene.pointDownCapture.add((ev) => {
		const id = ev.player.id
		if (players[id]) {
			const player = players[id]
			player.mouseOn = true
			player.mouseX = ev.point.x
			player.mouseY = ev.point.y
		}
	})
	scene.pointMoveCapture.add((ev) => {
		const id = ev.player.id
		if (players[id]) {
			const player = players[id]
			player.mouseX = ev.point.x+ev.startDelta.x
			player.mouseY = ev.point.y+ev.startDelta.y
		}
	})
	scene.pointUpCapture.add((ev) => {
		const id = ev.player.id
		if (players[id]) {
			const player = players[id]
			player.mouseOn = false
		}
	})

	return scene
}

module.exports = gameScene
