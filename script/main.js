'use strict'
const gameScene = require('./scenes/gamescene')

function main(param) {
	let lastJoinedPlayerId = null

	g.game.join.add(ev => {
		lastJoinedPlayerId = ev.player.id
		console.log('join', lastJoinedPlayerId)
	})

	const scene = new g.Scene({
		game: g.game,
		assetIds: ["entry"]
	});

	const camera = new g.Camera2D({ game: g.game })
	g.game.focusingCamera = camera
	g.game.modified = true

	scene.loaded.add(function () {
		if (g.game.selfId === lastJoinedPlayerId) {
			console.log('owner')
		}

		scene.append(new g.FilledRect({
			scene: scene,
			x: 0,
			y: 0,
			width: g.game.width,
			height: g.game.height,
			cssColor: "black"
		}))

		const button = new g.Sprite({
			scene: scene,
			src: scene.assets["entry"],
			x: (g.game.width-scene.assets["entry"].width)/2,
			y: (g.game.height-scene.assets["entry"].height)/2,
			touchable: true,
			local: true
		})
		button.pointDown.add(ev => {
			g.game.raiseEvent(new g.MessageEvent({ playerId: ev.player.id }))
		})
		scene.append(button)

		scene.message.add(function(msg) {
			if (!msg.data || !msg.data.playerId) return
			g.game.replaceScene(gameScene(0, [ msg.data.playerId ], camera))
		})

		const font = new g.DynamicFont({
			game: g.game,
			fontFamily: g.FontFamily.SansSerif,
			size: 16
		})
		const label = new g.Label({
			scene: scene,
			font: font,
			text: "id"+g.game.selfId,
			fontSize: 16,
			textColor: "blue",
			x: (g.game.width-scene.assets["entry"].width)/2,
			y: (g.game.height-scene.assets["entry"].height)/2
		})
		scene.append(label)
	})
	g.game.pushScene(scene)
}

module.exports = main
