'use strict'
const Stage = require('../stages/stage')
const Player = require('../entities/player/player00')
const Normal = require('../entities/player/normal')
const Enemy = require('../entities/enemy/enemy')
const Boss00 = require('../entities/enemy/boss00')

function gameScene(stageNo, playerIds, camera) {
	const assetIds = []
	assetIds.push('entry')
	assetIds.push('tile00')
	assetIds.push('map00')
	const scene = new g.Scene({
		game: g.game,
		assetIds: assetIds
	})
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

		const tileSize = Stage.tileSize
		const width = 32
		const height = 32
		const x = 1*tileSize+width/2
		const y = (29+1)*tileSize

		const objLayer = new g.E({
			scene: scene,
			x: 0,
			y: 0
		})
		scene.append(objLayer)

		scene.message.add(function(msg) {
			if (!msg.data || !msg.data.playerId) return
			console.log('msg', msg.data.playerId)
			const id = msg.data.playerId
			players[id] = new Player(scene, objLayer, x, y, camera, id, stage)
		})

		playerIds.forEach((id) => {
			console.log('##', id)
			players[id] = new Player(scene, objLayer, x, y, camera, id, stage)
		})

		if (players[g.game.selfId] == null) {
			const id = g.game.selfId
			const button = new g.Sprite({
				scene: scene,
				src: scene.assets["entry"],
				x: (g.game.width-scene.assets["entry"].width)/2,
				y: (g.game.height-scene.assets["entry"].height)/2,
				touchable: true,
				local: true
			})
			button.pointDown.add(ev => {
				const id = ev.player.id
				g.game.raiseEvent(new g.MessageEvent({ playerId: ev.player.id }))
			})
			scene.append(button)
		}

		const uiLayer = new g.E({
			scene: scene,
			x: 0,
			y: 0
		})
		uiLayer.update.add(() => {
			uiLayer.x = camera.x
			uiLayer.y = camera.y
		})
		scene.append(uiLayer)

		enemies.push(new Enemy(scene, objLayer, 16, 29))
		enemies.push(new Boss00(scene, objLayer, 48, 29))

		const rect = new g.FilledRect({
			scene: scene,
			x: 0x20,
			y: 0x10,
			width: 0x40,
			height: 0x10,
			cssColor: "yellow"
		})
		rect.update.add(() => {
			if (players[g.game.selfId]) {
				rect.width = players[g.game.selfId].life
			}
		})
		uiLayer.append(rect)
	})

	scene.update.add(() => {
		Object.keys(players).forEach((id) => {
			const player = players[id]
			if (player.isDead === false) {
				enemies.forEach((enemy) => {
					const dx = (player.rect.x+player.width/2)-enemy.x
					const dy = (player.rect.y+player.height)-enemy.y
					const dis = dx**2+dy**2
					if (dis < 32**2) {
						player.life--
						if (player.life <= 0) {
							player.vy = -4
							player.jump = true
							player.dead = true
						}
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
