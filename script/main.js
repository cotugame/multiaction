'use strict'
const Stage = require('./stages/sample')

function main(param) {
	const scene = new g.Scene({ game: g.game });
	const stage = new Stage(scene)
	scene.loaded.add(function () {
		const characters = {}

		const playerMain = (ev, delta = true) => {
			const playerId = ev.player.id
			const x = ev.point.x+(delta ? ev.startDelta.x : 0)
			const y = ev.point.y+(delta ? ev.startDelta.y : 0)
			if (characters[playerId] == null) {
				characters[playerId] = {} 
				characters[playerId].x = x
				characters[playerId].y = y
				const rect = new g.FilledRect({
					scene: scene,
					cssColor: "#ff0000",
					width: 32,
					height: 32
				})
				rect.update.add(() => {
					rect.x = characters[playerId].x
					rect.y = characters[playerId].y
					rect.modified()
				})
				scene.append(rect)
			} else {
				characters[playerId].x = x
				characters[playerId].y = y
			}
		}

		scene.pointDownCapture.add((ev) => {
			playerMain(ev, false)
		})
		scene.pointMoveCapture.add((ev) => {
			playerMain(ev)
		})
		scene.pointUpCapture.add((ev) => {
			playerMain(ev)
		})
	});
	g.game.pushScene(scene);
}
module.exports = main;
