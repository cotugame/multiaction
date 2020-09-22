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
		const sx = 1
		const maxVx = 8
		const characters = {}

		function createPlayer(id) {
			const x = g.game.width/2
			const y = g.game.height*3/4
			characters[id] = {
				x: x,
				y: y,
				vx: 0,
				vy: 0,
				mouseOn: false,
				mouseX: 0,
				mouseY: 0
			}
			const rect = new g.FilledRect({
				scene: scene,
				x: x,
				y: y,
				width: 32,
				height: 32,
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
				rect.x = characters[id].x
				rect.modified()
				if (id === g.game.selfId) {
					camera.x = characters[id].x-(g.game.width/2+32/2)
					camera.y = characters[id].y-(g.game.height*3/4+32/2)
					stage.setpos(camera.x, camera.y)
					camera.modified()
				}
			})
			scene.append(rect)
		}

		if (characters[g.game.selfId] == null) {
			createPlayer(g.game.selfId)
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
