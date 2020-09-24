'use strict'
const Stage = require('./stages/sample')

function main(param) {
	const scene = new g.Scene({ game: g.game });
	const stage = new Stage(scene)

	const camera = new g.Camera2D({ game: g.game })
	g.game.focusingCamera = camera
	g.game.modified = true

	scene.loaded.add(function () {
		const ax = 1/2
		const ay = 1/4
		const sx = 1
		const maxVx = 8
		const maxVy = 8
		const characters = {}

		function createPlayer(id) {
			const chipSize = Stage.chipSize
			const playerX = g.game.width/2
			const playerY = g.game.height-chipSize*2
			const width = 32
			const height = 32

			const x = 8*chipSize+width/2
			const y = (29+1)*chipSize
			characters[id] = {
				x: x,
				y: y,
				vx: 0,
				vy: 0,
				jump: false,
				mouseOn: false,
				mouseX: 0,
				mouseY: 0
			}
			const rect = new g.FilledRect({
				scene: scene,
				x: x-width/2,
				y: y-height,
				width: width,
				height: height,
				cssColor: (id === g.game.selfId) ? '#00ff00' : "#ff0000"
			})
			rect.update.add(() => {
				if (characters[id].mouseOn) {
					if (characters[id].mouseX > g.game.width/2) {
						characters[id].vx += ax
						if (characters[id].vx > maxVx) characters[id].vx = maxVx
					} else {
						characters[id].vx -= ax
						if (characters[id].vx < -maxVx) characters[id].vx = -maxVx
					}
					if (characters[id].jump === false) {
						if (characters[id].mouseY < g.game.height/2) {
							characters[id].vy = -8
							characters[id].jump = true
						}
					}
				} else {
					if (characters[id].vx > 0) {
						characters[id].vx -= sx
						if (characters[id].vx < 0) characters[id].vx = 0
					} else {
						characters[id].vx += sx
						if (characters[id].vx > 0) characters[id].vx = 0
					}
				}
				characters[id].x += characters[id].vx

						characters[id].vy += ay
						if (characters[id].vy > maxVy) characters[id].vy = maxVy
				characters[id].y += characters[id].vy
				if (characters[id].y > chipSize*32) {
					characters[id].y = chipSize*32
					characters[id].vy = 0
					characters[id].jump = false
				}

				rect.x = Math.floor(characters[id].x-width/2)
				rect.y = Math.floor(characters[id].y-height)
				rect.modified()
				if (id === g.game.selfId) {
					camera.x = Math.floor(characters[id].x-playerX)
					camera.y = Math.floor(characters[id].y-playerY)
					camera.modified()
				}
			})
			scene.append(rect)
		}

		if (characters[g.game.selfId] == null) {
		//	createPlayer(g.game.selfId)
		}

		const playerMain = (ev, delta = true) => {
			const playerId = ev.player.id
			const x = ev.point.x+(delta ? ev.startDelta.x : 0)
			const y = ev.point.y+(delta ? ev.startDelta.y : 0)
			if (characters[playerId] == null) {
				createPlayer(playerId)
			} else {
				characters[playerId].mouseOn = true
				characters[playerId].mouseX = x
				characters[playerId].mouseY = y
			}
		}

		scene.pointDownCapture.add((ev) => {
			playerMain(ev, false)
		})
		scene.pointMoveCapture.add((ev) => {
			playerMain(ev)
		})
		scene.pointUpCapture.add((ev) => {
			const id = ev.player.id
			if (characters[id] != null) {
				characters[id].mouseOn = false
			}
		})
	});
	g.game.pushScene(scene);
}
module.exports = main;
