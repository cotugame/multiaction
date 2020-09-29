'use strict'
const Player = require('./player')
const Stage = require('../../stages/stage')

class Player00 extends Player {
	constructor(scene, layer, x, y, camera, id, stage) {
		const chipSize = Stage.chipSize
		const width = 32, height = 32
		super(x, y, width, height)
		this.life = 64
		this.mouseOn = false
		this.mouseX = 0
		this.mouseY = 0
		this.mode = 0
		this.count = 0

		const color = (id === g.game.selfId) ? '#00ff00' : "#ff0000"
		const rect = new g.FilledRect({
			scene: scene,
			x: this.x-this.width/2,
			y: this.y-this.height,
			width: this.width,
			height: this.height,
			cssColor: color
		})
		this.rect = rect

		let vx = 0
		let vy = 0
		let jump = false
		rect.update.add(() => {
			const ax = 1/2
			const ay = 1/4
			const sx = 1
			const maxVx = 4
			const maxVy = 8

			if (this.isDead) {
				if (y > chipSize*stage.height+height) {
					y = chipSize*stage.height+height
					this.vy = 0
				}
				this.vy += ay
				y += this.vy
				rect.x = x-width/2
				rect.y = y-height
				rect.modified()
				return
			}

			if (this.mouseOn) {
				if (this.mouseX > g.game.width/2) {
					vx += ax
					if (vx > maxVx) vx = maxVx
					this.dir = 1
				} else {
					vx -= ax
					if (vx < -maxVx) vx = -maxVx
					this.dir = -1
				}
				if (jump === false) {
					if (this.mouseY < g.game.height/2) {
						vy = -8
						jump = true
					}
				}
			} else {
				if (vx > 0) {
					vx -= sx
					if (vx < 0) vx = 0
				} else {
					vx += sx
					if (vx > 0) vx = 0
				}
			}
			x += vx
			if (vx < 0) {
				if (stage.getAtr(x-width/2, y-1) & 8) {
					x += (chipSize-(x-width/2)%chipSize)
					vx = 0
				}
			} else {
				if (stage.getAtr(x+width/2, y-1) & 8) {
					x -= (x-width/2)%chipSize
					vx = 0
				}
			}

			vy += ay
			if (vy > maxVy) vy = maxVy
			y += vy
			if (y > chipSize*stage.height) {
				y = chipSize*stage.height
				vy = 0
				jump = false
			} else {
				if (vy < 0) {
					if (stage.getAtr(x, y-height) & 8) {
						y += chipSize-y%chipSize
						vy = 0
					}
				} else {
					if (stage.getAtr(x, y) & 8) {
						y -= y%chipSize
						vy = 0
						jump = false
					}
				}
			}

			rect.x = Math.floor(x-width/2)
			rect.y = Math.floor(y-height)
			rect.modified()
			if (id === g.game.selfId) {
				const playerPos = Player.playerPos
				camera.x = Math.floor(x-playerPos.x)
				camera.y = Math.floor(y-playerPos.y)
				camera.modified()
			}
		})
		layer.append(rect)
	}
}

module.exports = Player00
